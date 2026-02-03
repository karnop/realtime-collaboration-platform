"use client";

import { useEffect, useState } from "react";
import { AuthService, DocumentService } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import CreateDocumentBtn from "@/components/CreateDocumentBtn";
import Link from "next/link";
import LandingPage from "@/components/LandingPage";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();

        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const docs = await DocumentService.getDocuments(currentUser.$id);
        setDocuments(docs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // showing dashboard if user is logged in
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <main className="flex-1 p-6 lg:p-12">
        <div className="mx-auto max-w-7xl">
          {/* Dashboard Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-100">
                C
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                CollabPlatform
              </h1>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-900">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-500 truncate max-w-[150px]">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={async () => {
                  await AuthService.logout();
                  router.push("/login"); // Redirect to login (which will now show Landing Page eventually)
                  // Force reload to clear state if needed, or just let router handle it
                  window.location.reload();
                }}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </header>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">My Documents</h2>
            <CreateDocumentBtn userId={user?.$id} />
          </div>

          {/* Document Grid */}
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Link
                  href={`/documents/${doc.$id}`}
                  key={doc.$id}
                  className="group block bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg hover:shadow-zinc-200/50 hover:border-emerald-500/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-50 flex items-center justify-center text-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      📄
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      {formatDate(doc.$createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 truncate pr-4 mb-1 group-hover:text-emerald-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-zinc-500">Last edited by you</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 border-dashed p-16 text-center">
              <div className="mx-auto h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                📝
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                No documents found
              </h3>
              <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                You haven't created any documents yet. Create one to get
                started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Dashboard Footer */}
      <Footer />
    </div>
  );
}
