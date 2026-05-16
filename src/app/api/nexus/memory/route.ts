import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { screenshot, description, metadata } = body;

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const memory = await prisma.screenMemory.create({
      data: {
        workspaceId: workspace.id,
        screenshotUrl: screenshot,
        description: description || "Visual snapshot captured by Neural Bridge",
        metadata: JSON.stringify(metadata || {}),
      },
    });

    return NextResponse.json({ success: true, memoryId: memory.id });
  } catch (error) {
    console.error("Memory Vault Error:", error);
    return NextResponse.json({ error: "Failed to store memory" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const memories = await prisma.screenMemory.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(memories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}
