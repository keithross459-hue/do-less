import Link from "next/link";
import { Bot, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

const statusConfig: Record<string, { label: string; dotColor: string; textColor: string; bgColor: string }> = {
  active: { label: "Active", dotColor: "bg-green-500", textColor: "text-green-400", bgColor: "bg-green-500/10" },
  idle: { label: "Idle", dotColor: "bg-zinc-500", textColor: "text-zinc-400", bgColor: "bg-zinc-500/10" },
  learning: { label: "Learning", dotColor: "bg-secondary", textColor: "text-secondary", bgColor: "bg-secondary/10" },
};

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            My Agents
          </h1>
          <p className="text-zinc-400 mt-1">Your custom AI workforce. Create, manage, and deploy intelligent agents.</p>
        </div>
        <Link
          href="/create"
          className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-medium flex items-center gap-2 neon-border"
        >
          <PlusCircle className="w-5 h-5" />
          Create Agent
        </Link>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const status = statusConfig[agent.status];
          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="glass-panel p-6 group hover:border-white/15 transition-all relative overflow-hidden cursor-pointer"
            >
              {/* Subtle glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: agent.brandColor }} />

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 relative" style={{ backgroundColor: `${agent.brandColor}15` }}>
                    <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 12px ${agent.brandColor}20` }} />
                    <Bot className="w-6 h-6" style={{ color: agent.brandColor }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-primary transition-colors">{agent.name}</h3>
                    <p className="text-xs text-zinc-500">{agent.occupation || agent.archetype}</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10", status?.bgColor || statusConfig.idle.bgColor)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", status?.dotColor || statusConfig.idle.dotColor, agent.status === "active" && "animate-pulse")} />
                  <span className={cn("text-[10px] font-medium", status?.textColor || statusConfig.idle.textColor)}>{status?.label || "Idle"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="text-center p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                  <p className="text-base font-display font-bold text-white">{agent.tasksCompleted.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Tasks</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                  <p className="text-base font-display font-bold text-white">99.9%</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Uptime</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                  <p className="text-[10px] font-mono text-zinc-300 mt-1">{agent.primaryModel}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Model</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
