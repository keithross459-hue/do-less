import { Bot, Network, Zap, Activity } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { LiveTelemetry } from "@/components/dashboard/LiveTelemetry";
import { GlobalExecutionFeed } from "@/components/dashboard/GlobalExecutionFeed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const agentsCount = await prisma.agent.count({ where: { status: "active" } });
  const workflowsCount = await prisma.workflow.count({ where: { status: "active" } });
  
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
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Welcome to <span className="text-primary neon-text">Agent OS</span></h1>
        <p className="text-zinc-400">Real-time status of your autonomous AI workforce.</p>
      </div>

      <LiveTelemetry />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[450px]">
          <GlobalExecutionFeed />
        </div>

        <div className="glass-panel p-6 h-[450px] flex flex-col">
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Recent Agents
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
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

