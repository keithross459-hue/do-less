import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import prisma from "@/lib/prisma";
import { getLanguageModel, buildSystemPrompt, generateMockResponse } from "@/lib/ai-engine";

// POST /api/agents/[id]/chat
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { message, conversationId } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch agent
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      });
    }

    if (!conversation) {
      // Ensure demo user
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { email: "demo@agentos.ai", name: "Demo User", plan: "pro", credits: 12450 },
        });
      }

      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          agentId: id,
          title: message.slice(0, 50),
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    // Semantic Memory Retrieval (RAG)
    const { getRelevantMemories } = await import("@/lib/memory-engine");
    const memories = await getRelevantMemories(id, message);
    const memoryContext = memories.length > 0 
      ? "\n\nRELEVANT MEMORIES:\n" + memories.map(m => `- ${m.content}`).join("\n")
      : "";

    // Build system prompt from agent config
    const systemPrompt = buildSystemPrompt(agent) + memoryContext;

    // Get AI model
    const { model, config, isMock } = getLanguageModel(agent.primaryModel);

    if (isMock || !model) {
      // Mock response
      const startTime = Date.now();
      const mockReply = generateMockResponse(agent.name, message);

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: mockReply,
          model: config.id,
          latencyMs: Date.now() - startTime,
        },
      });

      // Update agent stats
      await prisma.agent.update({
        where: { id },
        data: { tasksCompleted: { increment: 1 }, status: "active" },
      });

      // Auto-create a memory from this interaction
      await prisma.memory.create({
        data: {
          agentId: id,
          layer: "short-term",
          content: `User asked: "${message.slice(0, 100)}". Responded with ${config.name} model.`,
          confidence: 0.85,
          source: "conversation",
        },
      });

      return NextResponse.json({
        reply: mockReply,
        conversationId: conversation.id,
        model: config.name,
        isMock: true,
      });
    }

    // Real AI - Stream response
    const startTime = Date.now();
    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...(conversation.messages || []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const result = streamText({
      model,
      messages: chatMessages,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
    });

    // For non-streaming response, collect the full text
    let fullResponse = "";
    const stream = (await result).textStream;
    for await (const chunk of stream) {
      fullResponse += chunk;
    }

    const latency = Date.now() - startTime;

    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: fullResponse,
        model: config.id,
        latencyMs: latency,
      },
    });

    await prisma.agent.update({
      where: { id },
      data: { tasksCompleted: { increment: 1 }, status: "active" },
    });

    await prisma.memory.create({
      data: {
        agentId: id,
        layer: "short-term",
        content: `Conversation: "${message.slice(0, 80)}". Used ${config.name}. Latency: ${latency}ms.`,
        confidence: 0.9,
        source: "conversation",
      },
    });

    return NextResponse.json({
      reply: fullResponse,
      conversationId: conversation.id,
      model: config.name,
      isMock: false,
      latencyMs: latency,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
