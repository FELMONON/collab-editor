"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  LogOut,
  Loader2,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  User,
  ChevronDown,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface Document {
  id: string;
  title: string;
  updatedAt: string;
  owner: { name: string; image: string };
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDocuments();
    }
  }, [session]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch {
      addToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Document" }),
      });

      if (res.ok) {
        const doc = await res.json();
        addToast("Document created!", "success");
        router.push(`/documents/${doc.id}`);
      } else {
        addToast("Failed to create document", "error");
      }
    } catch {
      addToast("Failed to create document", "error");
    } finally {
      setCreating(false);
    }
  };

  const deleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        addToast("Document deleted", "success");
      } else {
        addToast("Failed to delete document", "error");
      }
    } catch {
      addToast("Failed to delete document", "error");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Collab Editor</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-white rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Documents</h2>
            <p className="text-gray-500 mt-1">
              {documents.length} document{documents.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button
            onClick={createDocument}
            loading={creating}
            icon={<Plus className="w-4 h-4" />}
          >
            New Document
          </Button>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Documents */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-20">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No documents match &quot;{searchQuery}&quot;</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-sky-600 hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sky-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Create your first document
                </h3>
                <p className="text-gray-500 mb-6">
                  Start writing and collaborating with your team in real-time.
                </p>
                <Button
                  onClick={createDocument}
                  loading={creating}
                  icon={<Plus className="w-4 h-4" />}
                  size="lg"
                >
                  New Document
                </Button>
              </div>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="group relative bg-white rounded-xl border hover:shadow-lg hover:border-sky-200 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Preview Area */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-sky-100 transition-colors">
                      <FileText className="w-5 h-5 text-gray-600 group-hover:text-sky-600 transition-colors" />
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {openMenuId === doc.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-white rounded-lg shadow-lg border z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/documents/${doc.id}`);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => deleteDocument(doc.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-sky-600 transition-colors">
                    {doc.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(doc.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {doc.owner.image ? (
                      <img
                        src={doc.owner.image}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-purple-500" />
                    )}
                    <span className="text-xs text-gray-500">{doc.owner.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Owner
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Last Modified
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => router.push(`/documents/${doc.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {doc.owner.image ? (
                          <img
                            src={doc.owner.image}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-purple-500" />
                        )}
                        <span className="text-sm text-gray-600">{doc.owner.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(doc.updatedAt)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {openMenuId === doc.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-white rounded-lg shadow-lg border z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/documents/${doc.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => deleteDocument(doc.id, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}
