"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, ShieldCheck, Zap, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const LOG_TEMPLATES = [
  { icon: Bot, color: "text-primary", message: "Agent {name} completed task: {task}" },
  { icon: Zap, color: "text-amber-400", message: "Workflow {id} triggered by Webhook" },
  { icon: ShieldCheck, color: "text-green-400", message: "Security handshake verified for node {node}" },
  { icon: Terminal, color: "text-zinc-400", message: "Kernel: Memory cleanup completed in {ms}ms" },
];

const AGENT_NAMES = ["Nexus-7", "Content Storm", "Research Bot", "CEO Clone"];
const TASKS = ["Lead Analysis", "Tweet Generation", "PDF Indexing", "Decision Matrix"];

export function GlobalExecutionFeed() {
  const [logs, setLogs] = useState<{ id: number; icon: any; color: string; message: string; time: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const name = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
      const task = TASKS[Math.floor(Math.random() * TASKS.length)];
      
      const message = template.message
        .replace("{name}", name)
        .replace("{task}", task)
        .replace("{id}", `WF-${Math.floor(Math.random() * 900) + 100}`)
        .replace("{node}", `NODE-${Math.floor(Math.random() * 50)}`)
        .replace("{ms}", Math.floor(Math.random() * 50).toString());

      setLogs(prev => [...prev.slice(-20), {
        id: Date.now(),
        icon: template.icon,
        color: template.color,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden border-white/5">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          Global Execution Log
        </h3>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-green-500 font-mono">LIVE</span>
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
        {logs.map((log) => {
          const Icon = log.icon;
          return (
            <div key={log.id} className="flex items-start gap-3 animate-in slide-in-from-left-2 fade-in duration-300">
              <span className="text-zinc-600 shrink-0">[{log.time}]</span>
              <Icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", log.color)} />
              <span className="text-zinc-300">{log.message}</span>
            </div>
          );
        })}
        {logs.length === 0 && <p className="text-zinc-600 italic">Waiting for kernel events...</p>}
      </div>
    </div>
  );
}
