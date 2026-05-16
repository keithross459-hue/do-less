"use client";

import { Database, Search, PlusCircle, Brain, Clock, Users, Heart, BookOpen, Shield, Lightbulb, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const memoryLayers = [
  { name: "Short-Term", icon: Clock, count: 142, size: "24 MB", color: "primary", description: "Active conversation context and recent interactions" },
  { name: "Long-Term", icon: Brain, count: 1283, size: "512 MB", color: "secondary", description: "Persistent learned knowledge and experiences" },
  { name: "User Memory", icon: Users, count: 892, size: "198 MB", color: "accent", description: "Individual user preferences and interaction patterns" },
  { name: "Emotional", icon: Heart, count: 234, size: "45 MB", color: "pink-400", description: "Sentiment patterns and emotional context tracking" },
  { name: "Learning", icon: Lightbulb, count: 567, size: "340 MB", color: "amber-400", description: "Self-improvement insights and pattern recognition" },
  { name: "Team", icon: Users, count: 189, size: "67 MB", color: "green-400", description: "Shared organizational knowledge and protocols" },
];

const recentMemories = [
  { id: 1, content: "User prefers concise responses under 200 words", layer: "User Memory", agent: "Nexus-7", time: "2 min ago", confidence: 0.95 },
  { id: 2, content: "Indexed 'Q3_Strategy.pdf' — 42 pages, 18 key insights extracted", layer: "Learning", agent: "CEO Clone", time: "15 min ago", confidence: 0.88 },
  { id: 3, content: "Positive sentiment detected in last 5 interactions with lead #4521", layer: "Emotional", agent: "Sales Closer", time: "1 hour ago", confidence: 0.92 },
  { id: 4, content: "New CRM workflow pattern identified: Lead → Qualify → Score → Route", layer: "Long-Term", agent: "System", time: "2 hours ago", confidence: 0.97 },
  { id: 5, content: "Team standup summary: 3 blockers resolved, 2 new tasks assigned", layer: "Team", agent: "Support V2", time: "3 hours ago", confidence: 0.90 },
];

export default function MemoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Memory Engine
          </h1>
          <p className="text-zinc-400 mt-1">Layered memory system with semantic search, auto-learning, and privacy controls.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            Privacy Rules
          </button>
          <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all flex items-center gap-2 text-sm font-medium neon-border">
            <PlusCircle className="w-4 h-4" />
            Upload Knowledge
          </button>
        </div>
      </div>

      {/* Memory Layers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {memoryLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.name} className="glass-panel p-5 group hover:border-white/15 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10")}>
                    <Icon className={cn("w-5 h-5 text-zinc-400")} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{layer.name}</h3>
                    <p className="text-[10px] text-zinc-500">{layer.count} entries • {layer.size}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{layer.description}</p>
              <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full transition-all"
                  style={{ width: `${Math.min((layer.count / 1500) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Semantic Memory Search
        </h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search across all memory layers using natural language..."
            className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Recent Memories */}
      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          Recent Memory Activity
        </h2>
        <div className="space-y-2">
          {recentMemories.map((mem) => (
            <div key={mem.id} className="flex items-start gap-4 p-4 glass-panel hover:border-white/15 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 mb-1">{mem.content}</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span className="bg-white/5 px-2 py-0.5 rounded-full">{mem.layer}</span>
                  <span>Agent: {mem.agent}</span>
                  <span>{mem.time}</span>
                  <span className="text-primary font-mono">{(mem.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
