import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { executeWorkflow } from "@/lib/workflow-engine";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await req.json();
    const { nodes, edges } = body;

    if (!nodes || !edges) {
      return NextResponse.json({ error: "Nodes and edges are required" }, { status: 400 });
    }

    // Set up SSE streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        
        const sendLog = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        sendLog({ type: "start", message: "Workflow execution started" });

        try {
          await executeWorkflow(id, nodes, edges, {}, (log) => {
            sendLog({ type: "log", ...log });
          });
          
          sendLog({ type: "done", message: "Execution completed" });
        } catch (error) {
          sendLog({ type: "error", message: (error as Error).message });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Workflow execution failed" }, { status: 500 });
  }
}
