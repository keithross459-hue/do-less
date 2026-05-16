import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/agents - List all agents (for demo, no auth filter)
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { conversations: true, memories: true } },
      },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

// POST /api/agents - Create a new agent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure a demo workspace exists
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      // Ensure a user exists first
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { email: "demo@agentos.ai", name: "Demo User" }
        });
      }
      
      workspace = await prisma.workspace.create({
        data: {
          name: "Demo Workspace",
          slug: "demo-workspace",
          members: {
            create: { userId: user.id, role: "owner" }
          }
        }
      });
    }

    const agent = await prisma.agent.create({
      data: {
        workspaceId: workspace.id,
        name: body.name || "Unnamed Agent",
        archetype: body.archetype || "The Executive",
        backstory: body.backstory || null,
        brandColor: body.brandColor || "#00f0ff",
        occupation: body.occupation || null,
        personality: JSON.stringify(body.personality || {}),
        operatingMode: body.operatingMode || "Corporate",
        decisionFramework: body.decisionFramework || "Data-Driven",
        communicationStyle: JSON.stringify(body.communicationStyle || {}),
        primaryModel: body.primaryModel || "gpt-4o",
        fallbackModel: body.fallbackModel || null,
        temperature: body.temperature ?? 0.7,
        maxTokens: body.maxTokens ?? 2048,
        systemPrompt: body.systemPrompt || null,
        status: "idle",
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Failed to create agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
