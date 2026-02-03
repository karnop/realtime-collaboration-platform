import { Client, Account, ID, Databases } from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Auth Service
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
        {
          fullName: fullName,
          email: email,
        },
      );

      return newAccount;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },
};
