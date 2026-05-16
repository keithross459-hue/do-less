import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "@xyflow/react";

export type NodeData = {
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  status?: "idle" | "running" | "success" | "error";
  config?: Record<string, unknown>;
};

export type WorkflowNode = Node<NodeData>;

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNode: string | null;
  isExecuting: boolean;
  executionLogs: { time: string; node: string; message: string; level: "info" | "success" | "error" | "warn" }[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNode: (id: string | null) => void;
  addNode: (node: WorkflowNode) => void;
  toggleExecution: () => void;
  addLog: (log: { node: string; message: string; level: "info" | "success" | "error" | "warn" }) => void;
  updateNodeStatus: (id: string, status: NodeData["status"]) => void;
}

const initialNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "triggerNode",
    position: { x: 80, y: 200 },
    data: { label: "New Lead Arrives", description: "Webhook trigger from CRM", icon: "zap", category: "trigger", status: "idle" },
  },
  {
    id: "ai-1",
    type: "aiNode",
    position: { x: 400, y: 120 },
    data: { label: "Qualify Lead", description: "GPT-4o analyzes lead quality", icon: "brain", category: "ai", status: "idle" },
  },
  {
    id: "condition-1",
    type: "conditionNode",
    position: { x: 750, y: 120 },
    data: { label: "Score > 80?", description: "Route based on lead score", icon: "gitBranch", category: "logic", status: "idle" },
  },
  {
    id: "action-1",
    type: "actionNode",
    position: { x: 1100, y: 40 },
    data: { label: "Send to Sales", description: "Create Slack notification", icon: "send", category: "action", status: "idle" },
  },
  {
    id: "action-2",
    type: "actionNode",
    position: { x: 1100, y: 240 },
    data: { label: "Nurture Sequence", description: "Add to email drip campaign", icon: "mail", category: "action", status: "idle" },
  },
  {
    id: "delay-1",
    type: "delayNode",
    position: { x: 400, y: 340 },
    data: { label: "Wait 24h", description: "Pause before follow-up", icon: "clock", category: "timing", status: "idle" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-t1-a1", source: "trigger-1", target: "ai-1", markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" } },
  { id: "e-a1-c1", source: "ai-1", target: "condition-1", markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" } },
  { id: "e-c1-ac1", source: "condition-1", target: "action-1", sourceHandle: "yes", markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" } },
  { id: "e-c1-ac2", source: "condition-1", target: "action-2", sourceHandle: "no", markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" } },
  { id: "e-t1-d1", source: "trigger-1", target: "delay-1", markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" } },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  isExecuting: false,
  executionLogs: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,240,255,0.6)" },
        },
        get().edges
      ),
    });
  },

  setSelectedNode: (id) => set({ selectedNode: id }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  toggleExecution: async () => {
    const wasExecuting = get().isExecuting;
    if (!wasExecuting) {
      set({ isExecuting: true, executionLogs: [] });
      
      const { nodes, edges } = get();
      const workflowId = "wf-1"; // Using placeholder ID for now
      
      try {
        const response = await fetch(`/api/workflows/${workflowId}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes, edges })
        });
        
        if (!response.body) throw new Error("No response body");
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "start") {
                get().addLog({ node: "system", message: data.message, level: "info" });
              } else if (data.type === "log") {
                get().updateNodeStatus(data.nodeId, data.status);
                get().addLog({ 
                  node: data.nodeId, 
                  message: data.message, 
                  level: data.status === "error" ? "error" : data.status === "success" ? "success" : "info" 
                });
              } else if (data.type === "done") {
                get().addLog({ node: "system", message: data.message, level: "success" });
                set({ isExecuting: false });
              } else if (data.type === "error") {
                get().addLog({ node: "system", message: data.message, level: "error" });
                set({ isExecuting: false });
              }
            }
          }
        }
      } catch (error) {
        console.error("Execution failed:", error);
        get().addLog({ node: "system", message: "Failed to connect to execution engine.", level: "error" });
        set({ isExecuting: false });
      }

    } else {
      set({ isExecuting: false });
      // Reset all nodes
      set({
        nodes: get().nodes.map((n) => ({ ...n, data: { ...n.data, status: "idle" as const } })),
      });
    }
  },

  addLog: (log) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    set({ executionLogs: [...get().executionLogs, { ...log, time }] });
  },

  updateNodeStatus: (id, status) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status } } : n
      ),
    });
  },
}));
