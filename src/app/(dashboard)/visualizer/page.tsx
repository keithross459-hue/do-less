"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Share2, Zap, Bot, Database, Link2, Activity, Shield, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for force-graph as it needs browser environment
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function NeuralVisualizerPage() {
  const [mounted, setMounted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    const nodes: any[] = [
      { id: "nexus", name: "Nexus Core", val: 30, color: "#00f0ff", type: "core" },
      // Agents
      { id: "agent-1", name: "Nexus-7", val: 15, color: "#7000ff", type: "agent" },
      { id: "agent-2", name: "CEO Clone", val: 15, color: "#7000ff", type: "agent" },
      { id: "agent-3", name: "Content Storm", val: 15, color: "#7000ff", type: "agent" },
      // Connectors
      { id: "conn-1", name: "GitHub", val: 10, color: "#ffffff", type: "connector" },
      { id: "conn-2", name: "Slack", val: 10, color: "#4a154b", type: "connector" },
      { id: "conn-3", name: "Shopify", val: 10, color: "#95bf47", type: "connector" },
      { id: "conn-4", name: "Desktop", val: 10, color: "#00f0ff", type: "connector" },
      // Memories
      { id: "mem-1", name: "Q3 Strategy", val: 5, color: "#3b82f6", type: "memory" },
      { id: "mem-2", name: "Code Review", val: 5, color: "#3b82f6", type: "memory" },
      { id: "mem-3", name: "Market Data", val: 5, color: "#3b82f6", type: "memory" },
    ];

    const links: any[] = [
      { source: "nexus", target: "agent-1" },
      { source: "nexus", target: "agent-2" },
      { source: "nexus", target: "agent-3" },
      { source: "nexus", target: "conn-1" },
      { source: "nexus", target: "conn-2" },
      { source: "nexus", target: "conn-3" },
      { source: "nexus", target: "conn-4" },
      { source: "agent-1", target: "mem-1" },
      { source: "agent-1", target: "mem-2" },
      { source: "agent-2", target: "mem-3" },
      { source: "agent-1", target: "conn-1" },
      { source: "agent-3", target: "conn-2" },
    ];

    return { nodes, links };
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "flex flex-col gap-6 animate-in fade-in duration-700 h-full",
      fullscreen && "fixed inset-0 z-[200] bg-black p-8"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Share2 className="w-8 h-8 text-primary" />
            Neural Web Visualizer
          </h1>
          <p className="text-zinc-400 mt-1">Real-time topographic mapping of the Nexus digital ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFullscreen(!fullscreen)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
          >
            {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <StatCard icon={Bot} label="Neural Nodes" value="12 Active" color="#7000ff" />
        <StatCard icon={Database} label="Synaptic Links" value="18 Verified" color="#00f0ff" />
        <StatCard icon={Zap} label="Pulse Rate" value="142ms" color="#ff0055" />
        <StatCard icon={Shield} label="Network Integrity" value="99.8%" color="#10b981" />
      </div>

      {/* Graph Container */}
      <div ref={containerRef} className="flex-1 glass-panel border-white/5 overflow-hidden relative bg-black/40">
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <LegendItem color="#00f0ff" label="Nexus Core" />
          <LegendItem color="#7000ff" label="Agent Node" />
          <LegendItem color="#3b82f6" label="Memory Index" />
          <LegendItem color="#ffffff" label="External Bridge" />
        </div>

        <div className="absolute top-6 right-6 z-10">
          <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Topography</span>
          </div>
        </div>

        <ForceGraph2D
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          nodeLabel="name"
          nodeColor={(node: any) => node.color}
          nodeRelSize={6}
          linkColor={() => "rgba(255,255,255,0.1)"}
          linkWidth={1}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={(link: any) => data.nodes.find(n => n.id === link.source)?.color || "#00f0ff"}
          width={containerRef.current?.clientWidth || 800}
          height={containerRef.current?.clientHeight || 600}
          onNodeClick={(node: any) => console.log("Focused Node:", node)}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-xl flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-white uppercase tracking-widest">Neural Optimization in Progress...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}
