"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, Brain, GitBranch, Send, Mail, Clock, Webhook, Globe, FileText, Users, RotateCw, ShieldCheck, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeData } from "@/store/workflowStore";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap, brain: Brain, gitBranch: GitBranch, send: Send, mail: Mail,
  clock: Clock, webhook: Webhook, globe: Globe, file: FileText, users: Users,
  loop: RotateCw, shield: ShieldCheck,
};

const statusColors: Record<string, string> = {
  idle: "border-white/10",
  running: "border-primary/80 shadow-[0_0_20px_rgba(0,240,255,0.4)]",
  success: "border-green-500/80 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
  error: "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
};

const statusDotColors: Record<string, string> = {
  idle: "bg-zinc-600",
  running: "bg-primary animate-pulse",
  success: "bg-green-500",
  error: "bg-red-500",
};

/* ─── TRIGGER NODE ─── */
export const TriggerNode = memo(function TriggerNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const Icon = iconMap[d.icon || "zap"] || Zap;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[200px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-primary/50"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary/60">Trigger</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-primary/60" />
    </div>
  );
});

/* ─── AI NODE ─── */
export const AiNode = memo(function AiNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const Icon = iconMap[d.icon || "brain"] || Brain;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[200px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-secondary/50"
    )}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-secondary/60">AI Model</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

/* ─── CONDITION NODE ─── */
export const ConditionNode = memo(function ConditionNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[180px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-amber-500/50"
    )}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <GitBranch className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/60">Condition</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest">
        <span className="text-green-400">✓ Yes</span>
        <span className="text-red-400">✗ No</span>
      </div>
      <Handle type="source" position={Position.Right} id="yes" style={{ top: "40%" }} />
      <Handle type="source" position={Position.Right} id="no" style={{ top: "75%" }} />
    </div>
  );
});

/* ─── DELAY NODE ─── */
export const DelayNode = memo(function DelayNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[180px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-zinc-500/50"
    )}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
          <Clock className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500/60">Delay</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

/* ─── ACTION NODE ─── */
export const ActionNode = memo(function ActionNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const Icon = iconMap[d.icon || "send"] || Send;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[200px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-accent/50"
    )}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-accent/60">Action</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

/* ─── AGENT NODE ─── */
export const AgentNode = memo(function AgentNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const status = d.status || "idle";

  return (
    <div className={cn(
      "px-5 py-4 rounded-2xl border-2 bg-[#0a0a0a]/90 backdrop-blur-md min-w-[220px] transition-all duration-500",
      statusColors[status],
      selected && "ring-2 ring-primary/50"
    )}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary/60">AI Agent</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-tight">{d.label}</h3>
        </div>
      </div>
      {d.description && <p className="text-[11px] text-zinc-500 leading-snug">{d.description}</p>}
      
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase tracking-widest">
          <span>Active Agent:</span>
          <span className="text-primary font-bold">Nexus-7</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

