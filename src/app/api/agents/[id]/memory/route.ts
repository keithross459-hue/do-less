import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/agents/[id]/memory
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const memories = await prisma.memory.findMany({
      where: { agentId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Group by layer
    const grouped: Record<string, typeof memories> = {};
    for (const mem of memories) {
      if (!grouped[mem.layer]) grouped[mem.layer] = [];
      grouped[mem.layer].push(mem);
    }

    return NextResponse.json({ memories, grouped });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}

// POST /api/agents/[id]/memory
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const memory = await prisma.memory.create({
      data: {
        agentId: id,
        layer: body.layer || "long-term",
        content: body.content,
        confidence: body.confidence ?? 0.9,
        source: body.source || "manual",
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    });
    return NextResponse.json(memory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create memory" }, { status: 500 });
  }
}

// DELETE /api/agents/[id]/memory
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const memoryId = searchParams.get("memoryId");

    if (memoryId) {
      await prisma.memory.delete({ where: { id: memoryId } });
    } else {
      // Delete all memories for this agent
      await prisma.memory.deleteMany({ where: { agentId: id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 });
  }
}
