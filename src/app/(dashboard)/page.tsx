import { Bot, Network, Zap, Activity, Share2, History, Database } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LiveTelemetry } from "@/components/dashboard/LiveTelemetry";
import { GlobalExecutionFeed } from "@/components/dashboard/GlobalExecutionFeed";
import { AudioSwarm } from "@/components/AudioSwarm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const agentsCount = await prisma.agent.count({ where: { status: "active" } });
  const workflowsCount = await prisma.workflow.count({ where: { status: "active" } });
  const memoryCount = await prisma.screenMemory.count();
  
  const tasksAgg = await prisma.agent.aggregate({
    _sum: { tasksCompleted: true }
  });
  const totalTasks = tasksAgg._sum.tasksCompleted || 0;

  const recentAgents = await prisma.agent.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Nexus <span className="text-primary neon-text">Command Center</span></h1>
        <p className="text-zinc-400">Total operational control of your autonomous AI workforce.</p>
      </div>

      <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/30 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between shadow-[0_0_20px_rgba(var(--primary),0.1)]">
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Unlock Pro Capabilities
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl">
            You are currently using the Free tier. Upgrade to Pro to unlock advanced archetypes, unlimited workflows, and premium LLM models.
          </p>
        </div>
        <Link href="/pricing" className="relative z-10 px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(var(--primary),0.4)] whitespace-nowrap">
          Upgrade Now
        </Link>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      <LiveTelemetry />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <GlobalExecutionFeed />
        </div>
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 border-secondary/20 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-4 h-4 text-secondary" /> Memory Vault
                </h3>
                <Link href="/memory" className="text-[10px] text-zinc-600 hover:text-white transition-colors uppercase font-bold tracking-widest">History</Link>
             </div>
             <div>
                <p className="text-2xl font-display font-bold text-white">{memoryCount}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Total Screen Snapshots</p>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-3/4 shadow-[0_0_10px_rgba(112,0,255,0.8)]" />
             </div>
          </div>

          <div className="glass-panel p-6 border-primary/20 flex flex-col gap-4 group cursor-pointer hover:border-primary/40 transition-all">
             <Link href="/visualizer" className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Share2 className="w-4 h-4 text-primary" /> Neural Web Pulse
                </h3>
                <Zap className="w-4 h-4 text-primary animate-pulse" />
             </Link>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                   <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <p className="text-sm font-bold text-white">99.8% Efficiency</p>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">System Synchronized</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AudioSwarm />

        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Agent Roster
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {recentAgents.map((agent) => (
              <Link key={agent.id} href={`/agents/${agent.id}`} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${agent.brandColor}20`, borderColor: `${agent.brandColor}40` }}>
                    <Bot className="w-5 h-5" style={{ color: agent.brandColor }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-white group-hover:text-primary transition-colors">{agent.name}</h3>
                    <p className="text-xs text-zinc-500">{agent.occupation || agent.archetype}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : agent.status === 'idle' ? 'bg-zinc-500' : 'bg-secondary'}`}></span>
                  <span className="text-xs text-zinc-400 capitalize">{agent.status}</span>
                </div>
              </Link>
            ))}
            {recentAgents.length === 0 && <p className="text-sm text-zinc-500 text-center mt-10">No agents created yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}


