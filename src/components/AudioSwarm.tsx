"use client";

import { useState, useEffect } from "react";
import { Mic, Volume2, Users, Radio, Activity, Sparkles, MessageSquare, AudioLines } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const agents = [
  { id: "nexus", name: "Nexus-7", color: "#00f0ff", role: "Primary Kernel" },
  { id: "ceo", name: "CEO Clone", color: "#7000ff", role: "Strategic Layer" },
  { id: "sentinel", name: "Sentinel", color: "#ff0055", role: "Security Bridge" }
];

export function AudioSwarm() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      setActiveAgent(randomAgent.id);
      
      const phrases = [
        "Analyzing current neural web topography...",
        "Identifying security handshake anomalies in Slack gateway.",
        "Optimizing data flow for Q3 strategy memory indexing.",
        "System stable. Neural pathways at 98% efficiency.",
        "Executing cross-platform script for Lead Qualification."
      ];
      setTranscription(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="glass-panel p-6 border-primary/20 bg-black/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <div className={cn(
          "px-2 py-1 rounded-md border flex items-center gap-2 transition-all",
          isLive ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-zinc-500"
        )}>
          <Radio className={cn("w-3 h-3", isLive && "animate-pulse")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{isLive ? "Live Swarm" : "Swarm Offline"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <AudioLines className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Neural Audio Swarm</h3>
          <p className="text-xs text-zinc-500">Real-time collaborative audio reasoning between agents.</p>
        </div>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        {agents.map((agent) => (
          <div key={agent.id} className="flex flex-col items-center gap-3">
            <div className="relative">
              <motion.div 
                animate={activeAgent === agent.id && isLive ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{ backgroundColor: agent.color }}
              />
              <div className={cn(
                "w-16 h-16 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-500",
                activeAgent === agent.id && isLive ? "bg-black/80 scale-110" : "bg-black/40 border-white/10 grayscale opacity-40"
              )} style={{ borderColor: activeAgent === agent.id && isLive ? agent.color : "transparent" }}>
                <Users className="w-6 h-6" style={{ color: activeAgent === agent.id && isLive ? agent.color : "#525252" }} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white">{agent.name}</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">{agent.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-[60px] p-4 rounded-xl bg-white/5 border border-white/5 relative">
        <div className="absolute top-2 right-2">
          <Sparkles className="w-3 h-3 text-primary/40" />
        </div>
        <AnimatePresence mode="wait">
          {isLive && activeAgent ? (
            <motion.p 
              key={transcription}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm font-medium text-zinc-300 italic text-center"
            >
              "{transcription}"
            </motion.p>
          ) : (
            <p className="text-sm text-zinc-600 text-center italic">Nexus: Swarm standby. Awaiting vocal trigger...</p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-3">
        <button 
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            isLive 
              ? "bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30" 
              : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          )}
        >
          {isLive ? "Disconnect Swarm" : "Initialize Audio Swarm"}
        </button>
        <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
