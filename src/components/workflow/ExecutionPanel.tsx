"use client";

import { cn } from "@/lib/utils";
import { Activity, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface ExecutionLog {
  time: string;
  node: string;
  message: string;
  level: "info" | "success" | "error" | "warn";
}

const levelConfig = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  success: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  warn: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
};

interface ExecutionPanelProps {
  logs: ExecutionLog[];
  isExecuting: boolean;
}

export function ExecutionPanel({ logs, isExecuting }: ExecutionPanelProps) {
  return (
    <div className="h-48 border-t border-white/10 glass flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <Activity className={cn("w-4 h-4", isExecuting ? "text-primary animate-pulse" : "text-zinc-500")} />
          <h3 className="text-xs font-display font-semibold text-zinc-300 uppercase tracking-wider">Execution Log</h3>
        </div>
        {isExecuting && (
          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
            ● LIVE
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
        {logs.length === 0 && (
          <p className="text-zinc-600 text-center py-4">Run the workflow to see execution logs...</p>
        )}
        {logs.map((log, i) => {
          const config = levelConfig[log.level];
          const Icon = config.icon;
          return (
            <div key={i} className={cn("flex items-start gap-2 px-2 py-1.5 rounded-lg transition-all", config.bg)}>
              <Icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", config.color)} />
              <span className="text-zinc-500 shrink-0">{log.time}</span>
              <span className="text-zinc-400 shrink-0 font-bold">[{log.node}]</span>
              <span className="text-zinc-300 break-all">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
