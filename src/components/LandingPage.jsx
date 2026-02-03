import Link from "next/link";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="p-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-emerald-200 shadow-lg">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            CollabPlatform
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          v2.0 Now Available with Version Control
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Where teams write <br />
          <span className="text-emerald-600">better, together.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Experience real-time collaboration with zero latency. Write, edit, and
          manage versions in a beautifully designed environment built for modern
          teams.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Link
            href="/register"
            className="px-8 py-4 text-base font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-emerald-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start Writing for Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 text-base font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm hover:-translate-y-0.5"
          >
            View Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="flex flex-col p-12">
          <p className="text-base font-semibold text-zinc-700">Made By - </p>
          <p className="">
            Manav Mahesh Sanger, Amity University B.Tech CSE9 , Enrollment
            Number : A2305222603
          </p>
          <p className="">
            Samanyu Singh, Amity University B.Tech CSE9 , Enrollment Number :
            A2305222603
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
