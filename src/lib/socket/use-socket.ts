"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
  color: string;
}

interface RemoteCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

interface UseSocketProps {
  documentId: string;
  user: { id: string; name: string };
  onDocumentUpdate?: (content: string) => void;
}

export function useSocket({
  documentId,
  user,
  onDocumentUpdate,
}: UseSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);

  useEffect(() => {
    // Connect to socket server
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      // Join the document room
      socket.emit("join-document", { documentId, user });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Handle initial document state
    socket.on("document-state", ({ content }) => {
      if (onDocumentUpdate && content) {
        onDocumentUpdate(content);
      }
    });

    // Handle document updates from other users
    socket.on("document-updated", ({ content }) => {
      if (onDocumentUpdate) {
        onDocumentUpdate(content);
      }
    });

    // Handle user list updates
    socket.on("users-updated", ({ users: updatedUsers }) => {
      setUsers(updatedUsers);
    });

    // Handle cursor position updates from other users
    socket.on("cursor-moved", (data: RemoteCursor) => {
      setRemoteCursors((prev) => {
        const existing = prev.findIndex((c) => c.id === data.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    // Handle user leaving - remove their cursor
    socket.on("user-left", ({ oderId }) => {
      setRemoteCursors((prev) => prev.filter((c) => c.id !== oderId));
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId, user, onDocumentUpdate]);

  const sendUpdate = useCallback((content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("document-update", {
        documentId,
        content,
        version: Date.now(),
      });
    }
  }, [documentId]);

  const sendCursorPosition = useCallback((x: number, y: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("cursor-move", { documentId, x, y });
    }
  }, [documentId]);

  return {
    connected,
    users,
    remoteCursors,
    sendUpdate,
    sendCursorPosition,
  };
}
