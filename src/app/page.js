"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6 lg:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              C
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              CollabPlatform
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={async () => {
                await AuthService.logout();
                router.push("/login");
              }}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Dashboard Content Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-12 text-center">
              <div className="mx-auto h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4 text-2xl">
                📄
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                No documents yet
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto mb-6">
                Get started by creating a new document to share and collaborate
                with your team in real-time.
              </p>
              <button
                disabled
                className="btn-primary mx-auto w-auto opacity-50 cursor-not-allowed"
              >
                + Create Document (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
