"use client";

import { useCallback, useRef, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import { TriggerNode, AiNode, ConditionNode, ActionNode, DelayNode, AgentNode } from "@/components/workflow/CustomNodes";
import { NodePalette, type NodeTemplate } from "@/components/workflow/NodePalette";
import { ExecutionPanel } from "@/components/workflow/ExecutionPanel";
import { PlayCircle, StopCircle, Save, RotateCcw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTypes = {
  triggerNode: TriggerNode,
  aiNode: AiNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  delayNode: DelayNode,
  agentNode: AgentNode,
};

export default function WorkflowBuilderPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    isExecuting,
    executionLogs,
    toggleExecution,
    setSelectedNode,
  } = useWorkflowStore();

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const templateData = event.dataTransfer.getData("application/reactflow");
      if (!templateData || !reactFlowInstance.current) return;

      const template: NodeTemplate = JSON.parse(templateData);
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${template.type}-${Date.now()}`,
        type: template.type,
        position,
        data: {
          label: template.label,
          description: template.description,
          icon: template.icon,
          category: template.category,
          status: "idle" as const,
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleDragStart = (event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(template));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-[calc(100vh-4rem)] -m-6 lg:-m-10 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 glass shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-white text-sm">Lead Qualification Pipeline</h2>
          <span className="text-[10px] bg-white/10 text-zinc-400 px-2 py-0.5 rounded-full font-mono">v1.2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            onClick={toggleExecution}
            className={cn(
              "px-4 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all",
              isExecuting
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            )}
          >
            {isExecuting ? (
              <><StopCircle className="w-3.5 h-3.5" /> Stop</>
            ) : (
              <><PlayCircle className="w-3.5 h-3.5" /> Run Workflow</>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        <NodePalette onDragStart={handleDragStart} />

        <div className="flex-1 flex flex-col min-h-0">
          {/* React Flow Canvas */}
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={(instance) => { reactFlowInstance.current = instance; }}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onNodeClick={(_, node) => setSelectedNode(node.id)}
              onPaneClick={() => setSelectedNode(null)}
              nodeTypes={memoizedNodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              className="bg-transparent"
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: "rgba(0,240,255,0.4)", strokeWidth: 2 },
              }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.05)" />
              <Controls showInteractive={false} />
              <MiniMap
                nodeStrokeWidth={3}
                pannable
                zoomable
                nodeColor={() => "rgba(0,240,255,0.3)"}
                maskColor="rgba(0,0,0,0.7)"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              />
            </ReactFlow>
          </div>

          {/* Execution Logs */}
          <ExecutionPanel logs={executionLogs} isExecuting={isExecuting} />
        </div>
      </div>
    </div>
  );
}
