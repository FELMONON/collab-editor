"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ArrowLeft, Loader2, Users, Check, Cloud, Wifi, WifiOff } from "lucide-react";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { useSocket } from "@/lib/socket/use-socket";

interface Document {
  id: string;
  title: string;
  content: string | null;
  owner: { name: string; image: string };
}

export default function DocumentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [remoteContent, setRemoteContent] = useState<string | null>(null);
  const isLocalUpdate = useRef(false);

  // Memoize user object to prevent socket reconnection
  const socketUser = useMemo(() => ({
    id: session?.user?.id || "",
    name: session?.user?.name || "Anonymous",
  }), [session?.user?.id, session?.user?.name]);

  // Socket connection for real-time collaboration
  const { connected, users, sendUpdate } = useSocket({
    documentId,
    user: socketUser,
    onDocumentUpdate: useCallback((newContent: string) => {
      if (!isLocalUpdate.current) {
        setRemoteContent(newContent);
      }
    }, []),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && documentId) {
      fetchDocument();
    }
  }, [session, documentId]);

  const fetchDocument = async () => {
    const res = await fetch(`/api/documents/${documentId}`);
    if (res.ok) {
      const data = await res.json();
      setDocument(data);
      setTitle(data.title);
      setContent(data.content || "");
    } else {
      router.push("/documents");
    }
    setLoading(false);
  };

  const saveDocument = useCallback(async () => {
    if (!documentId) return;

    setSaving(true);
    await fetch(`/api/documents/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    setLastSaved(new Date());
  }, [documentId, title, content]);

  // Handle local content updates
  const handleContentUpdate = useCallback((newContent: string) => {
    isLocalUpdate.current = true;
    setContent(newContent);
    sendUpdate(newContent);

    // Reset flag after a short delay
    setTimeout(() => {
      isLocalUpdate.current = false;
    }, 100);
  }, [sendUpdate]);

  // Apply remote updates
  useEffect(() => {
    if (remoteContent !== null && !isLocalUpdate.current) {
      setContent(remoteContent);
      setRemoteContent(null);
    }
  }, [remoteContent]);

  // Auto-save on content change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document && (title !== document.title || content !== document.content)) {
        saveDocument();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, document, saveDocument]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/documents")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
              placeholder="Untitled"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className="flex items-center gap-1.5">
              {connected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-xs text-gray-500">
                {connected ? "Live" : "Offline"}
              </span>
            </div>

            {/* Save status */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {saving ? (
                <>
                  <Cloud className="w-4 h-4 animate-pulse" />
                  <span className="text-xs">Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs">Saved</span>
                </>
              ) : null}
            </div>

            {/* Collaborators */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {users.slice(0, 4).map((u, i) => (
                  <div
                    key={u.id}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: u.color, zIndex: users.length - i }}
                    title={u.name}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {users.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                    +{users.length - 4}
                  </div>
                )}
              </div>
              <div className="ml-2 flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{users.length}</span>
              </div>
            </div>

            {/* User avatar */}
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full ring-2 ring-blue-500"
              />
            )}
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TiptapEditor content={content} onUpdate={handleContentUpdate} />
      </main>
    </div>
  );
}
