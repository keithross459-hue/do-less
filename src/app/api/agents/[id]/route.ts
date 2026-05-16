import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/agents/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        _count: { select: { conversations: true, memories: true } },
        memories: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}

// PATCH /api/agents/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    // Only update fields that are provided
    const directFields = ["name", "archetype", "backstory", "brandColor", "occupation", "operatingMode", "decisionFramework", "primaryModel", "fallbackModel", "temperature", "maxTokens", "systemPrompt", "status"];
    for (const field of directFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    if (body.personality !== undefined) updateData.personality = JSON.stringify(body.personality);
    if (body.communicationStyle !== undefined) updateData.communicationStyle = JSON.stringify(body.communicationStyle);

    const agent = await prisma.agent.update({ where: { id }, data: updateData });
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

// DELETE /api/agents/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.agent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
