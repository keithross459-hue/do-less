"use client";

import { useEffect, useState } from "react";
import { Activity, Zap, DollarSign, Cpu, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveTelemetry() {
  const [metrics, setMetrics] = useState({
    tokensPerSec: 142,
    activeAgents: 8,
    costToday: 1.24,
    latency: 450,
    throughput: 12.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        tokensPerSec: Math.floor(120 + Math.random() * 50),
        activeAgents: prev.activeAgents,
        costToday: parseFloat((prev.costToday + Math.random() * 0.01).toFixed(2)),
        latency: Math.floor(400 + Math.random() * 100),
        throughput: parseFloat((10 + Math.random() * 5).toFixed(1)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <TelemetryCard label="Tokens / Sec" value={metrics.tokensPerSec} icon={Cpu} color="text-primary" />
      <TelemetryCard label="Active Agents" value={metrics.activeAgents} icon={Activity} color="text-secondary" />
      <TelemetryCard label="Cost (24h)" value={`$${metrics.costToday}`} icon={DollarSign} color="text-green-400" />
      <TelemetryCard label="Avg Latency" value={`${metrics.latency}ms`} icon={Zap} color="text-amber-400" />
      <TelemetryCard label="Throughput" value={`${metrics.throughput} req/m`} icon={Globe} color="text-cyan-400" />
    </div>
  );
}

function TelemetryCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-2 group hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <Icon className={cn("w-4 h-4", color)} />
        <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</p>
        <p className="text-xl font-display font-bold text-white tabular-nums">{value}</p>
      </div>
    </div>
  );
}
