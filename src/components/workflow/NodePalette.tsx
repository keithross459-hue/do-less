"use client";

import { Zap, Brain, GitBranch, Send, Clock, Webhook, Globe, FileText, Users, RotateCw, ShieldCheck, Mail, MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  iconComponent: React.ElementType;
  category: string;
  color: string;
}

const templates: { category: string; color: string; items: NodeTemplate[] }[] = [
  {
    category: "Agents",
    color: "primary",
    items: [
      { type: "agentNode", label: "Nexus-7", description: "Sales closer agent", icon: "bot", iconComponent: Bot, category: "agent", color: "primary" },
      { type: "agentNode", label: "Content Storm", description: "Viral content creator", icon: "bot", iconComponent: Bot, category: "agent", color: "primary" },
      { type: "agentNode", label: "Custom Agent", description: "Call a custom agent", icon: "bot", iconComponent: Bot, category: "agent", color: "primary" },
    ],
  },
  {
    category: "Triggers",
    color: "primary",
    items: [
      { type: "triggerNode", label: "Webhook", description: "Incoming HTTP event", icon: "webhook", iconComponent: Webhook, category: "trigger", color: "primary" },
      { type: "triggerNode", label: "Schedule", description: "Cron-based timer", icon: "clock", iconComponent: Clock, category: "trigger", color: "primary" },
      { type: "triggerNode", label: "Event", description: "System event listener", icon: "zap", iconComponent: Zap, category: "trigger", color: "primary" },
    ],
  },
  {
    category: "AI Models",
    color: "secondary",
    items: [
      { type: "aiNode", label: "AI Prompt", description: "Run LLM inference", icon: "brain", iconComponent: Brain, category: "ai", color: "secondary" },
      { type: "aiNode", label: "Classify", description: "AI text classifier", icon: "brain", iconComponent: Brain, category: "ai", color: "secondary" },
      { type: "aiNode", label: "Summarize", description: "AI summarizer", icon: "brain", iconComponent: Brain, category: "ai", color: "secondary" },
    ],
  },
  {
    category: "Logic",
    color: "amber-400",
    items: [
      { type: "conditionNode", label: "If / Else", description: "Conditional branch", icon: "gitBranch", iconComponent: GitBranch, category: "logic", color: "amber-400" },
      { type: "delayNode", label: "Delay", description: "Wait for duration", icon: "clock", iconComponent: Clock, category: "timing", color: "cyan-400" },
      { type: "conditionNode", label: "Loop", description: "Iterate over items", icon: "loop", iconComponent: RotateCw, category: "logic", color: "amber-400" },
    ],
  },
  {
    category: "Actions",
    color: "accent",
    items: [
      { type: "actionNode", label: "Send Email", description: "SMTP / Sendgrid", icon: "mail", iconComponent: Mail, category: "action", color: "accent" },
      { type: "actionNode", label: "API Call", description: "HTTP request", icon: "globe", iconComponent: Globe, category: "action", color: "accent" },
      { type: "actionNode", label: "Slack Message", description: "Post to channel", icon: "send", iconComponent: Send, category: "action", color: "accent" },
      { type: "actionNode", label: "Save File", description: "Write to storage", icon: "file", iconComponent: FileText, category: "action", color: "accent" },
      { type: "actionNode", label: "Notify User", description: "Push notification", icon: "send", iconComponent: MessageSquare, category: "action", color: "accent" },
    ],
  },
  {
    category: "Controls",
    color: "green-400",
    items: [
      { type: "actionNode", label: "Human Approval", description: "Wait for approval", icon: "shield", iconComponent: ShieldCheck, category: "control", color: "green-400" },
      { type: "actionNode", label: "Assign Agent", description: "Delegate to AI agent", icon: "users", iconComponent: Users, category: "control", color: "green-400" },
    ],
  },
];

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void;
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="w-64 h-full border-r border-white/10 glass flex flex-col shrink-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 shrink-0">
        <h3 className="font-display font-semibold text-sm text-white mb-1">Node Palette</h3>
        <p className="text-[11px] text-zinc-500">Drag nodes onto the canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {templates.map((group) => (
          <div key={group.category}>
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 px-1">{group.category}</h4>
            <div className="space-y-1.5">
              {group.items.map((item, i) => {
                const Icon = item.iconComponent;
                return (
                  <div
                    key={`${item.label}-${i}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <div className={cn("p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors")}>
                      <Icon className={cn("w-4 h-4 text-zinc-400 group-hover:text-white transition-colors")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 truncate">{item.label}</p>
                      <p className="text-[10px] text-zinc-600 truncate">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
