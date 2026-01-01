"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileText, Users, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/documents");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="font-semibold text-lg">Collab Editor</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Real-Time Collaborative
            <br />
            Document Editing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, edit, and collaborate on documents in real-time. Built with
            modern web technologies for a seamless editing experience.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-gray-50">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Collaboration</h3>
            <p className="text-gray-600">
              See changes from collaborators instantly. Multiple users can edit
              the same document simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Rich Text Editing</h3>
            <p className="text-gray-600">
              Full-featured editor with formatting, lists, headings, and more.
              Intuitive interface for effortless writing.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gray-50">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Sync</h3>
            <p className="text-gray-600">
              Changes are saved automatically and synced across all devices in
              real-time. Never lose your work.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-semibold mb-6">Built with Modern Technology</h2>
          <div className="flex items-center justify-center gap-8 flex-wrap text-gray-500">
            <span>Next.js 14</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Tiptap</span>
            <span>•</span>
            <span>PostgreSQL</span>
            <span>•</span>
            <span>Socket.io</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500">
          <p>A portfolio project demonstrating real-time collaboration</p>
        </div>
      </footer>
    </div>
  );
}
