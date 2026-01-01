import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/documents/[id] - Get a specific document
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await prisma.document.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { shares: { some: { userId: session.user.id } } },
        { isPublic: true },
      ],
    },
    include: {
      owner: { select: { name: true, image: true } },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}

// PATCH /api/documents/[id] - Update a document
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has edit access
  const document = await prisma.document.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { shares: { some: { userId: session.user.id, permission: { in: ["EDIT", "ADMIN"] } } } },
      ],
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found or no access" }, { status: 404 });
  }

  const body = await request.json();
  const { title, content } = body;

  const updated = await prisma.document.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only owner can delete
  const document = await prisma.document.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found or not owner" }, { status: 404 });
  }

  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
