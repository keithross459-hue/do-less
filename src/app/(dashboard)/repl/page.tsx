"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Terminal, Zap, Bot, Shield, Code, Cpu, 
  ArrowRight, RefreshCw, X, Play, Save, 
  Activity, ExternalLink, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const exampleScripts = [
  "nexus: deploy production build and notify slack #dev-ops",
  "nexus: find all q3 invoices in downloads and upload to aws s3",
  "nexus: scan screen for errors and fix them in the open terminal",
  "nexus: create a shopify product for the image currently on my screen"
];

export default function NeuralREPLPage() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<any[]>([
    { type: "system", content: "Nexus Neural REPL v2.4.0 Kernel Initialized...", time: "09:42:01" },
    { type: "system", content: "Waiting for neural command sequence...", time: "09:42:02" }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting) return;

    const cmd = input;
    setInput("");
    setIsExecuting(true);
    setLogs(prev => [...prev, { type: "user", content: cmd, time: new Date().toLocaleTimeString([], { hour12: false }) }]);

    // Simulate Agent Orchestration
    setLogs(prev => [...prev, { type: "agent", content: "Parsing intent and mapping across Nexus Connectors...", time: "09:42:05" }]);
    
    const steps = [
      "Authenticating with GitHub...",
      "Searching local file system...",
      "Initializing AI Vision Bridge...",
      "Executing cross-platform script..."
    ];

    for (const step of steps) {
      setCurrentSteps(prev => [...prev, step]);
      await new Promise(r => setTimeout(r, 1000));
    }

    setLogs(prev => [...prev, { 
      type: "success", 
      content: `Command executed successfully. Nexus agents have completed the task: "${cmd}"`, 
      time: new Date().toLocaleTimeString([], { hour12: false }) 
    }]);

    setIsExecuting(false);
    setCurrentSteps([]);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Neural Command REPL
          </h1>
          <p className="text-zinc-400 mt-1">Direct kernel access for cross-platform agent orchestration.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-widest animate-pulse">
            <Shield className="w-3 h-3" /> System Stable
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Terminal Area */}
        <div className="flex-[2] flex flex-col glass-panel border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-black/40 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              <span className="ml-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">NexusOS::NeuralREPL</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-600 font-mono">LATENCY: 14ms</span>
              <button className="text-zinc-500 hover:text-white transition-colors"><RefreshCw className="w-3 h-3" /></button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm custom-scrollbar bg-black/20">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                <span className={cn(
                  "font-medium",
                  log.type === "user" ? "text-primary" : 
                  log.type === "agent" ? "text-secondary" : 
                  log.type === "success" ? "text-green-400" :
                  "text-zinc-400"
                )}>
                  {log.type === "user" ? "> " : log.type === "agent" ? ":: " : log.type === "success" ? "✔ " : "# "}
                  {log.content}
                </span>
              </div>
            ))}
            
            {isExecuting && (
              <div className="space-y-2 pt-4">
                {currentSteps.map((step, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex items-center gap-3 text-zinc-500 text-xs pl-12"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    {step}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
            <form onSubmit={handleCommand} className="relative flex items-center">
              <span className="absolute left-4 text-primary font-mono font-bold">{">"}</span>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isExecuting ? "Executing neural command..." : "Type a cross-platform instruction..."}
                disabled={isExecuting}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-24 py-4 text-white font-mono focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
              />
              <button 
                type="submit"
                disabled={isExecuting || !input.trim()}
                className="absolute right-2 px-4 py-2 bg-primary text-black font-bold rounded-lg text-xs hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isExecuting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                RUN
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-1/3 flex flex-col gap-6 shrink-0">
          <div className="glass-panel p-6 border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Active Bridges
            </h3>
            <div className="space-y-3">
              <BridgeItem icon={Github} label="GitHub Core" status="Active" color="#ffffff" />
              <BridgeItem icon={Slack} label="Slack Gateway" status="Syncing" color="#4a154b" />
              <BridgeItem icon={Globe} label="Browser Engine" status="Ready" color="#00f0ff" />
              <BridgeItem icon={Terminal} label="Local Terminal" status="Privileged" color="#7000ff" />
            </div>
          </div>

          <div className="glass-panel p-6 border-white/5 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Code className="w-4 h-4 text-secondary" /> Example Intent Strings
            </h3>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {exampleScripts.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(s)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all group"
                >
                  <p className="text-[11px] text-zinc-500 font-mono group-hover:text-primary transition-colors">{s}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ops Rate</p>
                <p className="text-sm font-bold text-white">42 Cmds/hr</p>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
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

function BridgeItem({ icon: Icon, label, status, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-medium text-zinc-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{status}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
      </div>
    </div>
  );
}
