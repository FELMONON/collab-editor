"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { from: number; to: number };
}

interface UseSocketProps {
  documentId: string;
  user: { id: string; name: string };
  onDocumentUpdate?: (content: string) => void;
  onCursorUpdate?: (cursor: { id: string; name: string; color: string; cursor: { from: number; to: number } }) => void;
}

export function useSocket({
  documentId,
  user,
  onDocumentUpdate,
  onCursorUpdate,
}: UseSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

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

    // Handle cursor updates
    socket.on("cursor-updated", (data) => {
      if (onCursorUpdate) {
        onCursorUpdate(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId, user, onDocumentUpdate, onCursorUpdate]);

  const sendUpdate = useCallback((content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("document-update", {
        documentId,
        content,
        version: Date.now(),
      });
    }
  }, [documentId]);

  const sendCursorUpdate = useCallback((cursor: { from: number; to: number }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("cursor-update", { documentId, cursor });
    }
  }, [documentId]);

  return {
    connected,
    users,
    sendUpdate,
    sendCursorUpdate,
  };
}
