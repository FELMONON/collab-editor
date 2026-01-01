import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store document states and connected users
const documents = new Map<string, {
  content: string;
  users: Map<string, { id: string; name: string; color: string }>;
}>();

// Generate random color for user cursor
const getRandomColor = () => {
  const colors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
    "#06b6d4", "#6366f1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  let currentDocId: string | null = null;
  let currentUser: { id: string; name: string; color: string } | null = null;

  // Join a document room
  socket.on("join-document", ({ documentId, user }) => {
    currentDocId = documentId;
    currentUser = { ...user, color: getRandomColor() };

    socket.join(documentId);

    // Initialize document state if not exists
    if (!documents.has(documentId)) {
      documents.set(documentId, { content: "", users: new Map() });
    }

    const doc = documents.get(documentId)!;
    doc.users.set(socket.id, currentUser!);

    // Send current document state to the joining user
    socket.emit("document-state", { content: doc.content });

    // Broadcast user list to all users in the document
    io.to(documentId).emit("users-updated", {
      users: Array.from(doc.users.values()),
    });

    console.log(`User ${user.name} joined document ${documentId}`);
  });

  // Handle document updates
  socket.on("document-update", ({ documentId, content, version }) => {
    const doc = documents.get(documentId);
    if (doc) {
      doc.content = content;

      // Broadcast to all other users in the document
      socket.to(documentId).emit("document-updated", {
        content,
        version,
        oderId: socket.id,
      });
    }
  });

  // Handle mouse cursor position updates
  socket.on("cursor-move", ({ documentId, x, y }) => {
    if (currentUser) {
      // Broadcast cursor position to all other users in the document
      socket.to(documentId).emit("cursor-moved", {
        id: socket.id,
        name: currentUser.name,
        color: currentUser.color,
        x,
        y,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (currentDocId) {
      const doc = documents.get(currentDocId);
      if (doc) {
        doc.users.delete(socket.id);

        // Notify others that this user left
        io.to(currentDocId).emit("user-left", { oderId: socket.id });

        // Broadcast updated user list
        io.to(currentDocId).emit("users-updated", {
          users: Array.from(doc.users.values()),
        });

        // Clean up empty documents after delay
        if (doc.users.size === 0) {
          setTimeout(() => {
            const d = documents.get(currentDocId!);
            if (d && d.users.size === 0) {
              documents.delete(currentDocId!);
            }
          }, 60000);
        }
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
