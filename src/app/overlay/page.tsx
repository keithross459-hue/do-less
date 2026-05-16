"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, Activity, Zap, Shield, Cpu, MessageSquare, ChevronRight, X, Maximize2, Terminal, Eye, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HologramCompanion } from "@/components/HologramCompanion";
import { VoiceController } from "@/lib/desktop-automation";

export default function DesktopOverlay() {
  const [isHologramActive, setIsHologramActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastVoiceCmd, setLastVoiceCmd] = useState("");
  const [activeAgents, setActiveAgents] = useState([
    { id: "nexus", name: "Nexus-7", status: "thinking", task: "Analyzing Slack context..." },
    { id: "ceo", name: "CEO Clone", status: "idle", task: "Monitoring market trends" }
  ]);
  
  const [telemetry, setTelemetry] = useState({
    cpu: 12,
    mem: 4.2,
    ops: 842,
    tokens: 12.4
  });

  // Handle Holographic Transformation
  const toggleHologram = useCallback(() => {
    setIsHologramActive(true);
    setTimeout(() => setIsHologramActive(false), 3000); 
  }, []);

  // Voice Control Integration
  useEffect(() => {
    const vc = new VoiceController();
    
    if (isListening) {
      vc.startListening((text) => {
        setLastVoiceCmd(text);
        toggleHologram(); // Trigger hologram on voice
      });
    }

    return () => vc.stopListening();
  }, [isListening, toggleHologram]);

  useEffect(() => {
    const handleGlobalClick = () => toggleHologram();
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [toggleHologram]);

  // Simulate live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        cpu: Math.floor(Math.random() * 20) + 5,
        mem: (4.2 + Math.random() * 0.1).toFixed(1) as any,
        ops: prev.ops + Math.floor(Math.random() * 10),
        tokens: (parseFloat(prev.tokens as any) + 0.1).toFixed(1) as any
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "h-screen w-full flex flex-col p-4 bg-transparent select-none transition-all duration-500 overflow-hidden",
      isHologramActive && "hologram-mode"
    )}>
      
      {/* THE CONTROLLER (Behind the scenes) */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="relative w-[800px] h-[800px]"
        >
          {/* Subtle Silhouette of the Controller Agent */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-[120px]" />
          <Bot className="w-full h-full text-primary/10" strokeWidth={0.1} />
        </motion.div>
      </div>

      {/* TINY HOLOGRAM AGENT */}
      <HologramCompanion isActive={isHologramActive} />

      {/* Main HUD Interface */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Assistant Status */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-4 flex items-center gap-4 border-primary/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-black/50 border border-primary/30 flex items-center justify-center relative z-10">
              <Bot className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-ping" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
               <h2 className="text-sm font-display font-bold text-white tracking-wider uppercase">Nexus Core</h2>
               <div className="px-1.5 py-0.5 rounded bg-primary/20 border border-primary/40 text-[8px] text-primary font-bold">MONITORING</div>
            </div>
            <p className="text-[10px] text-primary font-bold animate-pulse">
              {isListening ? (lastVoiceCmd || "Listening...") : "Controller Connected // Tracking User Intent"}
            </p>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsListening(!isListening); }}
              className={cn(
                "p-1.5 rounded-md transition-all",
                isListening ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-zinc-500"
              )}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Maximize2 className="w-3.5 h-3.5 text-zinc-500" /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><X className="w-3.5 h-3.5 text-zinc-500" /></button>
          </div>
        </motion.div>

        {/* Telemetry HUD */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="glass p-3 rounded-xl border-white/5 bg-black/40">
            <div className="flex items-center justify-between mb-1">
              <Cpu className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-600 uppercase">CPU</span>
            </div>
            <p className="text-sm font-mono text-white">{telemetry.cpu}%</p>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${telemetry.cpu}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
          <div className="glass p-3 rounded-xl border-white/5 bg-black/40">
            <div className="flex items-center justify-between mb-1">
              <Zap className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-bold text-zinc-600 uppercase">OPS</span>
            </div>
            <p className="text-sm font-mono text-white">{telemetry.ops}</p>
          </div>
        </div>

        {/* Active Agent Swarm */}
        <div className="mt-4 flex-1 overflow-hidden flex flex-col gap-2">
          <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Active Swarm</h3>
          <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
            {activeAgents.map(agent => (
              <motion.div 
                key={agent.id}
                layout
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 group hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <Activity className={cn("w-4 h-4", agent.status === "thinking" ? "text-primary animate-spin" : "text-zinc-600")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{agent.name}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{agent.task}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all shadow-lg">
              <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-primary" />
            </div>
            <span className="text-[8px] font-bold text-zinc-600 uppercase group-hover:text-primary">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all shadow-lg">
              <Terminal className="w-4 h-4 text-zinc-400 group-hover:text-primary" />
            </div>
            <span className="text-[8px] font-bold text-zinc-600 uppercase group-hover:text-primary">Cmd</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all shadow-lg">
              <Eye className="w-4 h-4 text-zinc-400 group-hover:text-primary" />
            </div>
            <span className="text-[8px] font-bold text-zinc-600 uppercase group-hover:text-primary">Monitor</span>
          </button>
        </div>
      </div>

      {/* HOLOGRAPHIC OVERLAY EFFECTS */}
      <AnimatePresence>
        {isHologramActive && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 bg-primary/10 mix-blend-overlay"
            />
            <motion.div 
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.02, 1], opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-[60] border-[10px] border-primary/20 blur-[2px]"
            />
            <div className="scanline z-[70] pointer-events-none" />
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .glass {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .hologram-mode {
          filter: hue-rotate(180deg) brightness(1.2) contrast(1.2) saturate(1.5);
          transition: filter 0.5s ease;
        }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0) 0%,
            rgba(0,212,255,0.05) 50%,
            rgba(255,255,255,0) 100%
          );
          background-size: 100% 4px;
          animation: scanline 10s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
