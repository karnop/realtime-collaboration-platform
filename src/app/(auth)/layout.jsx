export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-emerald-200 shadow-lg">
            C
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            CollabPlatform
          </h2>
        </div>

        <div className="bg-white px-8 py-10 shadow-xl shadow-zinc-200/60 ring-1 ring-zinc-900/5 sm:rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
