# Collab Editor

A real-time collaborative document editor built with modern web technologies. Multiple users can edit the same document simultaneously with live cursor tracking and instant synchronization.

## Features

- **Real-Time Collaboration** - See changes from collaborators instantly with WebSocket-based sync
- **Rich Text Editing** - Full-featured editor with formatting, lists, headings, and more
- **User Presence** - See who's currently viewing and editing the document
- **Auto-Save** - Changes are automatically saved to the database
- **GitHub Authentication** - Secure sign-in with OAuth
- **Document Management** - Create, edit, and organize your documents

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Editor | Tiptap (ProseMirror-based) |
| Real-time | Socket.io |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React     │  │   Tiptap    │  │   Socket.io Client  │  │
│  │   (Next.js) │  │   Editor    │  │   (Real-time sync)  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          │ HTTP           │ State               │ WebSocket
          │                │ Updates             │
          ▼                ▼                     ▼
┌─────────────────┐                    ┌─────────────────────┐
│  Next.js API    │                    │   Socket.io Server  │
│  Routes         │                    │   (Port 3001)       │
│  (/api/*)       │                    │                     │
└────────┬────────┘                    └──────────┬──────────┘
         │                                        │
         │ Prisma                                 │ Broadcast
         │                                        │
         ▼                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Users   │  │Documents │  │  Shares  │  │   Versions   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Sync Flow

1. User makes an edit in the Tiptap editor
2. Change is sent to Socket.io server via WebSocket
3. Server broadcasts the change to all connected clients
4. Other clients receive and apply the update to their editor
5. Changes are periodically persisted to PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud like Supabase)
- GitHub OAuth app for authentication

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/collab-editor.git
cd collab-editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

5. Set up the database:
```bash
npm run prisma:push
npm run prisma:generate
```

6. Start the development servers:
```bash
npm run dev:all
```

This starts both the Next.js app (port 3000) and Socket.io server (port 3001).

## Project Structure

```
collab-editor/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # NextAuth endpoints
│   │   │   └── documents/   # Document CRUD
│   │   ├── documents/       # Document pages
│   │   └── login/           # Auth pages
│   ├── components/
│   │   ├── editor/          # Tiptap editor components
│   │   └── providers.tsx    # Context providers
│   └── lib/
│       ├── auth.ts          # NextAuth configuration
│       ├── prisma.ts        # Database client
│       └── socket/          # Socket.io client hooks
├── server/
│   └── socket-server.ts     # Socket.io server
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## Key Technical Decisions

### Why Tiptap?
- Built on ProseMirror, battle-tested in production
- Extensible architecture for custom functionality
- First-class collaboration support via Yjs
- Great DX with React bindings

### Why Socket.io?
- Reliable WebSocket connection with fallback to polling
- Built-in room management for document isolation
- Event-based API that maps well to editor operations

### Why PostgreSQL?
- ACID compliance for document integrity
- JSON columns for flexible content storage
- Excellent performance with proper indexing

## Interview Talking Points

This project demonstrates:

1. **Real-Time Systems**
   - WebSocket-based communication
   - Event broadcasting to multiple clients
   - Handling concurrent connections

2. **System Design**
   - Separation of HTTP and WebSocket servers
   - Database schema design for collaborative features
   - State synchronization strategies

3. **Full-Stack Development**
   - Next.js App Router with server components
   - Type-safe API with TypeScript
   - Modern React patterns (hooks, context)

4. **Production Considerations**
   - OAuth authentication flow
   - Auto-save with debouncing
   - Graceful handling of disconnections

## Deployment

### Vercel (Next.js App)
```bash
vercel deploy
```

### Railway/Render (Socket.io Server)
Deploy the `server/socket-server.ts` as a separate service.

### Database
Use Supabase, Railway, or any PostgreSQL provider.

## Future Enhancements

- [ ] CRDT-based conflict resolution with Yjs
- [ ] Cursor position broadcasting
- [ ] Document version history
- [ ] Collaborative comments
- [ ] Export to PDF/Markdown

## License

MIT
