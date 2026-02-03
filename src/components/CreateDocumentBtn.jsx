"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentService } from "@/lib/appwrite";

export default function CreateDocumentBtn({ userId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      if (!userId) throw new Error("User ID is missing. Please log in again.");

      const doc = await DocumentService.createDocument(userId, title);
      setIsOpen(false);
      setTitle("");
      // readirecting to the new document
      router.push(`/documents/${doc.$id}`);
    } catch (err) {
      console.error("Failed to create document", err);
      setError(err.message || "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary w-auto inline-flex items-center gap-2 shadow-emerald-200 shadow-lg"
      >
        <span>+</span> New Document
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden ring-1 ring-zinc-900/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Create new document
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Give your document a clear name.
              </p>

              <form onSubmit={handleCreate}>
                <label
                  htmlFor="docTitle"
                  className="block text-xs font-medium text-zinc-700 mb-1 ml-1"
                >
                  Document Title
                </label>
                <input
                  id="docTitle"
                  type="text"
                  autoFocus
                  placeholder="e.g. Q3 Marketing Plan"
                  className="input-field mb-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {error && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setError("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
