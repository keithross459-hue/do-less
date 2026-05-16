"use client";

import { useState } from "react";
import { 
  Link2, Search, Github, Slack, ShoppingCart, 
  Monitor, CreditCard, Cloud, Database, 
  ExternalLink, ShieldCheck, Zap, Plus,
  CheckCircle2, AlertCircle, X, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

const connectorCategories = ["All", "Developer", "Productivity", "Commerce", "System", "Cloud"];

const availableConnectors = [
  { id: "github", name: "GitHub", description: "Link repositories, automate PRs, and manage issues.", icon: Github, category: "Developer", status: "connected", account: "AgentOS-Lab" },
  { id: "slack", name: "Slack", description: "Connect to workspaces for channel-wide agent participation.", icon: Slack, category: "Productivity", status: "connected", account: "Nexus-Tech-HQ" },
  { id: "shopify", name: "Shopify", description: "Inventory management, order tracking, and store analytics.", icon: ShoppingCart, category: "Commerce", status: "disconnected" },
  { id: "desktop", name: "Local Machine", description: "Direct file system access and local terminal execution.", icon: Monitor, category: "System", status: "disconnected" },
  { id: "stripe", name: "Stripe", description: "Process payments, manage subscriptions, and tax automation.", icon: CreditCard, category: "Commerce", status: "error", error: "API Key Expired" },
  { id: "aws", name: "AWS S3", description: "Cloud storage for agent-generated assets and logs.", icon: Cloud, category: "Cloud", status: "disconnected" },
  { id: "postgres", name: "PostgreSQL", description: "Direct query access to your production databases.", icon: Database, category: "Developer", status: "disconnected" },
];

export default function NexusConnectorsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Link2 className="w-8 h-8 text-primary" />
            The Nexus Core
          </h1>
          <p className="text-zinc-400 mt-1">Connect your agents to any platform, device, or API across your entire ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-xl font-bold hover:bg-primary/30 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Custom API
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 p-4 glass-panel border-white/5">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            placeholder="Search connectors, platforms, or linked accounts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {connectorCategories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border",
                filter === cat ? "bg-primary/10 text-primary border-primary/30" : "bg-white/5 text-zinc-500 border-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Global Status HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Links</p>
            <p className="text-xl font-display font-bold text-white">12 Platforms</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Flow</p>
            <p className="text-xl font-display font-bold text-white">2.4 GB/hr</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sync Errors</p>
            <p className="text-xl font-display font-bold text-white">1 Warning</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System API</p>
            <p className="text-xl font-display font-bold text-white">Online</p>
          </div>
        </div>
      </div>

      {/* Connector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableConnectors
          .filter(c => filter === "All" || c.category === filter)
          .map((connector) => (
          <div key={connector.id} className={cn(
            "glass-panel group transition-all relative overflow-hidden flex flex-col",
            connector.status === "connected" ? "border-primary/20" : "border-white/5"
          )}>
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors",
                  connector.status === "connected" ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-zinc-400"
                )}>
                  <connector.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    connector.status === "connected" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                    connector.status === "error" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    "bg-white/5 text-zinc-500 border-white/10"
                  )}>
                    {connector.status}
                  </span>
                  {connector.account && <span className="text-[10px] text-zinc-500 font-mono">{connector.account}</span>}
                </div>
              </div>
              
              <h3 className="text-lg font-display font-bold text-white mb-2">{connector.name}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">{connector.description}</p>
              
              {connector.error && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  {connector.error}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <button className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
                Auth Profile
              </button>
              <button className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                connector.status === "connected" 
                  ? "bg-white/10 text-white hover:bg-white/20" 
                  : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              )}>
                {connector.status === "connected" ? "Configure" : "Link Platform"}
              </button>
            </div>
          </div>
        ))}

        {/* Custom API / Webhook Card */}
        <div className="glass-panel border-dashed border-white/20 hover:border-primary/50 transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <Plus className="w-8 h-8 text-zinc-500 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-white font-display font-bold text-lg mb-1">Custom Link</h3>
          <p className="text-zinc-500 text-sm">Create a secure tunnel to your private API, Database, or Home Server.</p>
        </div>
      </div>

      {/* Security Footer */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold">Encrypted Nexus Protocol</h4>
            <p className="text-xs text-zinc-400">All external platform links are secured with AES-256 encryption and managed via hardware-level secure enclaves.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all whitespace-nowrap shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          Audit Security Log
        </button>
      </div>
    </div>
  );
}
