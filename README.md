# CollabPlatform – Real-time Collaborative Editor

A full-stack, real-time collaboration platform similar to **Google Docs**. Built with **Next.js 14**, **Appwrite**, and **Liveblocks**, it allows multiple users to edit documents simultaneously with near-zero latency, manage versions, and share work instantly.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Backend / Database:** Appwrite (Cloud)
- **Real-time Engine:** Liveblocks
- **Editor:** TipTap (Headless wrapper for ProseMirror)
- **State Sync:** Yjs

---

## ✨ Features

- **Real-time Collaboration:** Multiple users can edit the same document at the same time.
- **Live Presence:** See who else is currently viewing the document (avatars).
- **Authentication:** Secure email/password login via Appwrite.
- **Document Management:** Create, view, and manage documents from a dashboard.
- **Version Control:** Save named versions (snapshots) and restore previous states instantly.
- **Sharing:** Generate unique links to share documents with collaborators.
- **Responsive Design:** Fully responsive UI with a premium, minimalist aesthetic.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collab-platform.git
cd collab-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following keys:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_COLLECTION_USERS=users
NEXT_PUBLIC_APPWRITE_COLLECTION_DOCUMENTS=documents
NEXT_PUBLIC_APPWRITE_COLLECTION_VERSIONS=versions

# Liveblocks Configuration
# Get these from https://liveblocks.io/
LIVEBLOCKS_SECRET_KEY=sk_...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
```

---

## 🗄️ Appwrite Database Setup

Set up the database structure in your **Appwrite Console**.

### Database

- Create a database
- Database ID must match `NEXT_PUBLIC_APPWRITE_DATABASE_ID`

### Collection 1: `users`

**Permissions**

- Role: Any → Read, Create

**Attributes**

- `fullName` (String, 100, Required)
- `email` (String, 100, Required)
- `avatarUrl` (URL, Optional)

### Collection 2: `documents`

**Permissions**

- Role: Any → Create, Read, Update, Delete

**Attributes**

- `title` (String, 255, Required)
- `userId` (String, 255, Required)
- `body` (String, 10000+, Optional)

### Collection 3: `versions`

**Permissions**

- Role: Any → Create, Read, Update, Delete

**Attributes**

- `documentId` (String, 255, Required)
- `content` (String, 10000+, Required)
- `label` (String, 255, Optional)

---

## ▶️ Run the Project

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.
