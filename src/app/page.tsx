"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FileText,
  Users,
  Zap,
  ArrowRight,
  Shield,
  Globe,
  Sparkles,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/documents");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-2 bg-gray-900 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Collab Editor</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              <a href="#tech" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Tech Stack
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-full text-sm font-medium text-sky-700 mb-6 animate-fade-in-down">
              <Sparkles className="w-4 h-4" />
              Real-time collaboration made simple
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-in-up">
              Write together,
              <br />
              <span className="bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                in real-time.
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up">
              Create beautiful documents with your team. See changes instantly,
              collaborate seamlessly, and bring your ideas to life together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Link href="/login">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  Start Writing Free
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free forever for individuals
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative animate-fade-in-up">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white rounded-lg border text-xs text-gray-500">
                    collab-editor.app/documents/project-brief
                  </div>
                </div>
              </div>
              <div className="p-8 min-h-[300px] bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg skeleton mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-100 rounded skeleton" />
                      <div className="h-4 w-5/6 bg-gray-100 rounded skeleton" />
                      <div className="h-4 w-4/6 bg-gray-100 rounded skeleton" />
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-4 w-full bg-gray-100 rounded skeleton" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded skeleton" />
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-sky-500" />
                      <span className="text-xs font-medium text-sky-700">Sarah</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-purple-500" />
                      <span className="text-xs font-medium text-purple-700">Mike</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-green-700">You</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make team collaboration effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Real-Time Collaboration",
                description: "See changes from collaborators instantly. Multiple users can edit the same document simultaneously.",
                color: "sky",
              },
              {
                icon: FileText,
                title: "Rich Text Editing",
                description: "Full-featured editor with formatting, lists, headings, code blocks, and more.",
                color: "purple",
              },
              {
                icon: Zap,
                title: "Instant Sync",
                description: "Changes are saved automatically and synced across all devices in real-time.",
                color: "amber",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your documents are encrypted and stored securely. Only you control who has access.",
                color: "green",
              },
              {
                icon: Globe,
                title: "Access Anywhere",
                description: "Work from any device with a web browser. No installation required.",
                color: "rose",
              },
              {
                icon: Sparkles,
                title: "Live Cursors",
                description: "See where your teammates are editing in real-time with colored cursors.",
                color: "indigo",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get started in seconds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start collaborating with your team in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your free account with email or sign in with Google or GitHub.",
              },
              {
                step: "02",
                title: "Create a Document",
                description: "Start a new document or import existing content. It takes just one click.",
              },
              {
                step: "03",
                title: "Invite Your Team",
                description: "Share the document link and start collaborating in real-time.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent -translate-x-1/2" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 text-white text-3xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-24 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A powerful stack designed for performance, scalability, and developer experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Next.js 14", desc: "React Framework" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Tiptap", desc: "Rich Text Editor" },
              { name: "PostgreSQL", desc: "Database" },
              { name: "Socket.io", desc: "Real-time Sync" },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <p className="font-semibold text-white mb-1">{tech.name}</p>
                <p className="text-sm text-gray-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 gradient-hero">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 border-2 border-white" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600 mb-8">Loved by thousands of teams worldwide</p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to start collaborating?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams who use Collab Editor to work together seamlessly.
          </p>

          <Link href="/login">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-900 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Collab Editor</span>
            </div>

            <p className="text-gray-500 text-sm">
              A portfolio project demonstrating real-time collaboration
            </p>

            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
