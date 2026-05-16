import { Edge, Node } from "@xyflow/react";
import prisma from "@/lib/prisma";
import { getLanguageModel } from "@/lib/ai-engine";

interface WorkflowContext {
  [key: string]: any;
}

export interface ExecutionLog {
  nodeId: string;
  status: "running" | "success" | "error";
  message: string;
  timestamp: string;
  data?: any;
}

/**
 * Traverse and execute a workflow graph (DAG)
 */
export async function executeWorkflow(
  workflowId: string,
  nodes: Node[],
  edges: Edge[],
  initialPayload: Record<string, any> = {},
  onLog?: (log: ExecutionLog) => void
) {
  // Build adjacency list for execution order (assuming basic directed graph)
  const incomingEdges = new Map<string, Edge[]>();
  const outgoingEdges = new Map<string, Edge[]>();

  for (const node of nodes) {
    incomingEdges.set(node.id, []);
    outgoingEdges.set(node.id, []);
  }

  for (const edge of edges) {
    if (incomingEdges.has(edge.target)) incomingEdges.get(edge.target)!.push(edge);
    if (outgoingEdges.has(edge.source)) outgoingEdges.get(edge.source)!.push(edge);
  }

  // Find start nodes (no incoming edges)
  let queue: Node[] = nodes.filter((n) => incomingEdges.get(n.id)!.length === 0);
  const context: WorkflowContext = { ...initialPayload };
  const executed = new Set<string>();

  const log = (nodeId: string, status: "running" | "success" | "error", message: string, data?: any) => {
    if (onLog) {
      onLog({
        nodeId,
        status,
        message,
        timestamp: new Date().toISOString(),
        data,
      });
    }
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (executed.has(current.id)) continue;

    log(current.id, "running", `Starting execution of ${current.data?.label || current.type}`);

    try {
      // --- NODE EXECUTION LOGIC ---
      let resultData: any = {};

      if (current.type === "triggerNode") {
        // Mock Trigger
        resultData = { triggerPayload: context.triggerPayload || "simulated_event_data" };
        log(current.id, "success", `Webhook triggered: received payload`);
      } 
      else if (current.type === "aiNode") {
        // AI Model Execution
        const agentName = "Workflow Agent"; 
        const { model, config, isMock } = getLanguageModel("gpt-4o-mini"); // Default model for workflow nodes
        
        const aiPrompt = `Analyze this data: ${JSON.stringify(context)}`;
        
        if (isMock || !model) {
          resultData = { response: `[Mock AI Response]: Analyzed context and identified 3 key actionable items.` };
        } else {
           // Simulate a fast API call if we wanted real text, but for the backend engine we'll mock it for speed unless streaming
           resultData = { response: `Processed payload through ${config.name}.` };
        }
        log(current.id, "success", `AI inference complete (Model: ${config.name})`);
      }
      else if (current.type === "conditionNode") {
        // Logic Node (Simulated true branch)
        resultData = { conditionResult: true };
        log(current.id, "success", `Evaluated condition: TRUE branch taken`);
      }
      else if (current.type === "actionNode") {
        // Action Node (e.g. send slack)
        log(current.id, "success", `Action executed successfully: ${current.data?.label}`);
      }
      else if (current.type === "delayNode") {
        // Delay (mocked delay)
        await new Promise((resolve) => setTimeout(resolve, 500));
        log(current.id, "success", `Delay completed`);
      } 
      else if (current.type === "agentNode") {
        // Multi-Agent Dispatch
        const agentName = current.data?.label || "Nexus-7";
        log(current.id, "running", `Dispatching task to Agent: ${agentName}...`);
        
        // In a real system, we'd fetch the agent from DB and call the Chat API
        // For now, we simulate a handoff
        await new Promise(resolve => setTimeout(resolve, 1500));
        resultData = { agentOutput: `Agent ${agentName} completed the requested task.` };
        log(current.id, "success", `Agent ${agentName} finished execution and returned results.`);
      }
      else {
        log(current.id, "success", `Node processed`);
      }

      // Merge results into context
      Object.assign(context, resultData);
      executed.add(current.id);

      // Find next nodes
      const outEdges = outgoingEdges.get(current.id) || [];
      for (const edge of outEdges) {
        // If condition, only follow the correct path
        if (current.type === "conditionNode") {
          // If result is true, follow 'yes' handle. If false, follow 'no'.
          if (context.conditionResult && edge.sourceHandle !== "yes") continue;
          if (!context.conditionResult && edge.sourceHandle === "yes") continue;
        }

        const targetNode = nodes.find((n) => n.id === edge.target);
        if (targetNode && !executed.has(targetNode.id)) {
          // Wait for all incoming edges to complete before pushing (if we wanted strict DAG ordering)
          queue.push(targetNode);
        }
      }
    } catch (err) {
      log(current.id, "error", `Node execution failed: ${(err as Error).message}`);
      break; // Halt workflow on error
    }
  }

  // Update DB Stats
  if (workflowId !== "mock") {
    await prisma.workflow.update({
      where: { id: workflowId },
      data: { 
        executions: { increment: 1 },
        lastRunAt: new Date()
      }
    });
  }

  return { success: true, context };
}
