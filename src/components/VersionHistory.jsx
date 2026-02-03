"use client";

import { useEffect, useState } from "react";
import { DocumentService } from "@/lib/appwrite";

export default function VersionHistory({
  documentId,
  isOpen,
  onClose,
  onRestore,
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const list = await DocumentService.getVersions(documentId);
        setVersions(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, documentId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-zinc-200 transform transition-transform duration-200 z-50 flex flex-col">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
        <h3 className="font-semibold text-zinc-900">Version History</h3>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-800 text-xl leading-none"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-zinc-400 text-sm">
            Loading history...
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-sm">
            No versions saved yet.
            <br />
            Save the document to create a version.
          </div>
        ) : (
          versions.map((version) => (
            <div
              key={version.$id}
              className="group border border-zinc-200 rounded-lg p-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {version.label || "Auto-Save"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(version.$createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Restore this version? Current changes will be overwritten.",
                    )
                  ) {
                    onRestore(version.content);
                    onClose();
                  }
                }}
                className="w-full py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded hover:bg-emerald-200 transition-colors opacity-0 group-hover:opacity-100"
              >
                Restore Version
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
