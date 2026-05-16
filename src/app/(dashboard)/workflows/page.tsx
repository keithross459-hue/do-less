"use client";

import Link from "next/link";
import { Network, PlusCircle, Play, Pause, MoreHorizontal, Zap, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const workflows = [
  { id: "wf-1", name: "Lead Qualification Pipeline", status: "active", nodes: 6, executions: 1243, lastRun: "2 min ago", successRate: 98.2 },
  { id: "wf-2", name: "Content Publishing Engine", status: "active", nodes: 12, executions: 842, lastRun: "15 min ago", successRate: 99.1 },
  { id: "wf-3", name: "Customer Onboarding Flow", status: "paused", nodes: 8, executions: 456, lastRun: "1 hour ago", successRate: 95.7 },
  { id: "wf-4", name: "Invoice Auto-Sender", status: "active", nodes: 4, executions: 2100, lastRun: "5 min ago", successRate: 99.8 },
  { id: "wf-5", name: "Social Media Scheduler", status: "draft", nodes: 9, executions: 0, lastRun: "Never", successRate: 0 },
  { id: "wf-6", name: "Cold Outreach Sequencer", status: "active", nodes: 15, executions: 567, lastRun: "30 min ago", successRate: 87.4 },
];

const statusConfig: Record<string, { label: string; dotColor: string; textColor: string }> = {
  active: { label: "Active", dotColor: "bg-green-500", textColor: "text-green-400" },
  paused: { label: "Paused", dotColor: "bg-amber-500", textColor: "text-amber-400" },
  draft: { label: "Draft", dotColor: "bg-zinc-500", textColor: "text-zinc-400" },
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-primary" />
            Workflows
          </h1>
          <p className="text-zinc-400 mt-1">Design, automate, and monitor your AI-powered workflows.</p>
        </div>
        <Link
          href="/workflows/new"
          className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-medium flex items-center gap-2 neon-border"
        >
          <PlusCircle className="w-5 h-5" />
          New Workflow
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20"><Zap className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-display font-bold text-white">5,208</p>
            <p className="text-xs text-zinc-500">Total Executions</p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
          <div>
            <p className="text-2xl font-display font-bold text-white">97.3%</p>
            <p className="text-xs text-zinc-500">Avg. Success Rate</p>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20"><Clock className="w-5 h-5 text-secondary" /></div>
          <div>
            <p className="text-2xl font-display font-bold text-white">1.2s</p>
            <p className="text-xs text-zinc-500">Avg. Latency</p>
          </div>
        </div>
      </div>

      {/* Workflow List */}
      <div className="space-y-3">
        {workflows.map((wf) => {
          const status = statusConfig[wf.status];
          return (
            <Link
              key={wf.id}
              href={`/workflows/${wf.id}`}
              className="flex items-center justify-between p-5 glass-panel hover:border-white/15 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                  <Network className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{wf.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{wf.nodes} nodes • Last run {wf.lastRun}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-mono text-white">{wf.executions.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Executions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-white">{wf.successRate > 0 ? `${wf.successRate}%` : "—"}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Success</p>
                </div>
                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10")}>
                  <span className={cn("w-2 h-2 rounded-full", status.dotColor, wf.status === "active" && "animate-pulse")} />
                  <span className={cn("text-xs font-medium", status.textColor)}>{status.label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
