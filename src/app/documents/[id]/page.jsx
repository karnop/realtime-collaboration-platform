"use client";

import { useEffect, useState } from "react";
import { DocumentService, AuthService } from "@/lib/appwrite";
import Link from "next/link";
import CollaborativeEditor from "@/components/Editor";
import { useRouter } from "next/navigation";

export default function DocumentPage({ params }) {
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const id = params.id;

  useEffect(() => {
    const init = async () => {
      try {
        const [doc, user] = await Promise.all([
          DocumentService.getDocument(id),
          AuthService.getCurrentUser(),
        ]);

        if (!user) {
          router.push("/login");
          return;
        }

        setDocument(doc);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, router]);

  const handleSave = async (content) => {
    try {
      await DocumentService.updateDocument(id, { body: content });
      setCopySuccess("Saved!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save document");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess("Link copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!document)
    return <div className="p-10 text-center">Document not found</div>;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            ←
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-zinc-900 leading-tight">
              {document.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                Live Sync
              </span>
              {copySuccess && (
                <span className="text-[10px] text-emerald-600 font-bold fade-in">
                  {copySuccess}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block px-3 py-1.5 bg-zinc-100 rounded-md text-xs text-zinc-600">
            {currentUser?.name}
          </div>

          <button
            onClick={handleShare}
            className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded hover:bg-zinc-700 transition-colors shadow-sm"
          >
            Share
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-8 overflow-auto flex justify-center">
        <div className="w-full max-w-4xl shadow-lg shadow-zinc-200/50">
          <CollaborativeEditor
            roomId={id}
            user={currentUser}
            initialContent={document.body}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
