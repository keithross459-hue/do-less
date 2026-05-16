import { Shield, Search, Filter, FileText, Bot, Zap, Info, AlertTriangle, Fingerprint, Download, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const workspace = await prisma.workspace.findFirst();
  
  // Create some mock logs for the demo if none exist
  let logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  if (logs.length === 0 && workspace) {
    // Seed some mock audit data
    const mockActions = [
      { action: "ai_decision", entity: "Agent", description: "Nexus-7 evaluated lead quality for 'BigTech Corp'", severity: "info", agentId: "nexus" },
      { action: "security_handshake", entity: "System", description: "Kernel verified API integrity for OpenAI-v4", severity: "info" },
      { action: "workflow_run", entity: "Workflow", description: "Sales Pipeline executed 4/4 nodes successfully", severity: "info" },
      { action: "ai_decision", entity: "Agent", description: "CEO Clone flagged high-risk transaction in Workspace", severity: "warn" },
      { action: "critical_event", entity: "System", description: "Rate limit reached for Anthropic API. Automatic fallback triggered.", severity: "critical" },
    ];

    for (let i = 0; i < 15; i++) {
      const template = mockActions[Math.floor(Math.random() * mockActions.length)];
      await prisma.auditLog.create({
        data: {
          workspaceId: workspace.id,
          ...template,
          createdAt: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
        }
      });
    }

    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warn": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getIcon = (action: string, severity: string) => {
    if (severity === "critical" || severity === "warn") return <AlertTriangle className="w-4 h-4" />;
    if (action === "ai_decision") return <Bot className="w-4 h-4" />;
    if (action === "workflow_run") return <Zap className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Decision Ledger
          </h1>
          <p className="text-zinc-400 mt-1">Immutable audit logs of all AI operations and kernel events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="px-4 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-xl font-bold hover:bg-primary/30 transition-all flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            Verify Integrity
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 p-4 glass-panel border-white/5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            placeholder="Search decisions, descriptions, or IDs..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center gap-2 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter By Severity
          </button>
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center gap-2 hover:text-white transition-all">
            <Clock className="w-3.5 h-3.5" />
            Date Range
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="glass-panel overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                <th className="px-6 py-5">Event ID</th>
                <th className="px-6 py-5">Entity</th>
                <th className="px-6 py-5">Action & Description</th>
                <th className="px-6 py-5">Severity</th>
                <th className="px-6 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-6 py-5 font-mono text-[10px] text-zinc-600 group-hover:text-primary transition-colors">
                    {log.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-400">
                        {log.entity === 'Agent' ? <Bot className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      </span>
                      <span className="text-sm font-semibold text-white">{log.entity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-md">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">{log.action.replace('_', ' ')}</p>
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">{log.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center w-fit gap-1.5", getSeverityStyles(log.severity))}>
                      {getIcon(log.action, log.severity)}
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xs text-zinc-500">
                    {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
