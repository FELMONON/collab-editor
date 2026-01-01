import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/documents - List all documents for the user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { shares: { some: { userId: session.user.id } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { name: true, image: true } },
    },
  });

  return NextResponse.json(documents);
}

// POST /api/documents - Create a new document
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title } = body;

  const document = await prisma.document.create({
    data: {
      title: title || "Untitled",
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(document, { status: 201 });
}
