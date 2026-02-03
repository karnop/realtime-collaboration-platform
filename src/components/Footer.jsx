export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            C
          </div>
          <span className="text-sm font-semibold text-zinc-900">
            CollabPlatform
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm text-zinc-500">
          <a href="#" className="hover:text-zinc-900 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-zinc-900 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-zinc-900 transition-colors">
            Support
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
