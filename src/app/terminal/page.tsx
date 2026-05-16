"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Zap, Shield, Maximize2, X, ChevronRight, Activity, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TerminalOverlay() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [logs, setLogs] = useState([
    { type: "sys", text: "Nexus Shell [v2.4.0]" },
    { type: "sys", text: "Direct kernel access enabled. Use help for commands." }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const execute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLogs(prev => [...prev, { type: "user", text: cmd }]);
    setInput("");
    
    // Simple command responses
    setTimeout(() => {
      if (cmd === "help") {
        setLogs(prev => [...prev, { type: "sys", text: "Available: analyze-screen, deploy, fetch-github, notify-slack, exit" }]);
      } else if (cmd === "analyze-screen") {
        setLogs(prev => [...prev, { type: "sys", text: "Neural Bridge triggered. Capturing screen..." }]);
      } else {
        setLogs(prev => [...prev, { type: "sys", text: `Command '${cmd}' recognized by Nexus kernel. Executing...` }]);
      }
    }, 500);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black/60 backdrop-blur-md border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none">
      {/* Title Bar */}
      <div className="flex items-center justify-between p-3 bg-black/40 border-b border-white/10 drag">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">NexusOS::Terminal</span>
        </div>
        <div className="flex items-center gap-3 no-drag">
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[8px] font-bold text-primary uppercase">Active</span>
          </div>
          <button className="text-zinc-600 hover:text-white transition-colors"><Maximize2 className="w-3 h-3" /></button>
          <button className="text-zinc-600 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3">
            <span className={cn(
              "shrink-0",
              log.type === "user" ? "text-primary font-bold" : "text-zinc-600"
            )}>
              {log.type === "user" ? "user@nexus:~$" : "[sys]"}
            </span>
            <span className={cn(
              "break-all",
              log.type === "user" ? "text-white" : "text-zinc-400"
            )}>
              {log.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Line */}
      <div className="p-3 bg-black/40 border-t border-white/10">
        <form onSubmit={execute} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-white font-mono placeholder:text-zinc-700"
            placeholder="Command input..."
          />
        </form>
      </div>

      <style jsx global>{`
        .drag { -webkit-app-region: drag; }
        .no-drag { -webkit-app-region: no-drag; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
