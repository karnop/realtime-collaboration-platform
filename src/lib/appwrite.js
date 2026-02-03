import { Client, Account, ID, Databases, Query } from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
  documentsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_DOCUMENTS,
  versionsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_VERSIONS,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const AuthService = {
  async register(email, password, fullName) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        fullName,
      );
      await account.createEmailPasswordSession(email, password);
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        { fullName: fullName, email: email },
      );
      return newAccount;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    return await account.createEmailPasswordSession(email, password);
  },

  async logout() {
    return await account.deleteSession("current");
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  async getJWT() {
    try {
      const response = await account.createJWT();
      return response.jwt;
    } catch (error) {
      console.error("Error creating JWT:", error);
      return null;
    }
  },
};

export const DocumentService = {
  async createDocument(userId, title) {
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.documentsCollectionId,
      ID.unique(),
      { userId, title, body: "" },
    );
  },

  async updateDocument(documentId, data) {
    return await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.documentsCollectionId,
      documentId,
      data,
    );
  },

  async getDocuments(userId) {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.documentsCollectionId,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
      );
      return response.documents;
    } catch (error) {
      return [];
    }
  },

  async getDocument(documentId) {
    return await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.documentsCollectionId,
      documentId,
    );
  },

  async createVersion(documentId, content, label = "") {
    try {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.versionsCollectionId,
        ID.unique(),
        {
          documentId: documentId,
          content: content,
          label: label,
        },
      );
    } catch (error) {
      console.error("Failed to create version", error);
    }
  },

  async getVersions(documentId) {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.versionsCollectionId,
        [
          Query.equal("documentId", documentId),
          Query.orderDesc("$createdAt"),
          Query.limit(20), // Limit to last 20 versions
        ],
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch versions", error);
      return [];
    }
  },
};
