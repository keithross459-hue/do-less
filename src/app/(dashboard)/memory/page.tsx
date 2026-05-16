"use client";

import { useState, useEffect } from "react";
import { 
  History, Search, Calendar, Filter, Clock, 
  ChevronRight, ExternalLink, Trash2, Brain,
  Layers, Maximize2, Sparkles, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MemoryVaultPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<any>(null);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const res = await fetch("/api/nexus/memory");
        const data = await res.json();
        setMemories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMemories();
  }, []);

  const filteredMemories = memories.filter(m => 
    m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.metadata?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Nexus Memory Vault
          </h1>
          <p className="text-zinc-400 mt-1">A unified visual timeline of every pixel processed by the Nexus Neural Bridge.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Brain className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{memories.length} Visual Indexes</span>
          </div>
        </div>
      </div>

      {/* Search & Stats HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visual history (e.g. 'terminal error', 'shopify trends', 'github code')..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            Date
          </button>
          <button className="flex-1 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Filter className="w-4 h-4" />
            Apps
          </button>
        </div>
      </div>

      {/* Memory Timeline Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[300px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((memory) => (
              <motion.div 
                layout
                key={memory.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedMemory(memory)}
                className="glass-panel group cursor-pointer hover:border-primary/30 transition-all overflow-hidden flex flex-col"
              >
                {/* Image Preview */}
                <div className="relative aspect-video overflow-hidden bg-black/40 border-b border-white/5">
                  <img 
                    src={memory.screenshotUrl} 
                    alt="Memory Snapshot" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-1">
                    <div className="p-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/40 text-[8px] font-bold text-primary uppercase">
                      Visual Index
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
                      <Clock className="w-3 h-3" />
                      {new Date(memory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">
                      #{memory.id.slice(0, 8)}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {memory.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3 text-secondary" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Perceptual Layer</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMemories.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Eye className="w-10 h-10 text-zinc-700" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">No Memories Found</h3>
          <p className="text-zinc-500 max-w-md">The Memory Vault is empty or your search returned no results. Use the Neural Bridge to start indexing your workspace.</p>
        </div>
      )}

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedMemory(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/50 border border-white/10 text-zinc-400 hover:text-white z-20 transition-all"
              >
                <Maximize2 className="w-5 h-5 rotate-45" />
              </button>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Full Image */}
                <div className="flex-[2] bg-black/40 flex items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                  <img 
                    src={selectedMemory.screenshotUrl} 
                    alt="Full Memory" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-white/5"
                  />
                </div>

                {/* Info Panel */}
                <div className="flex-1 p-8 overflow-y-auto bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Memory Analysis</p>
                      <p className="text-xs text-white font-mono">{new Date(selectedMemory.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">AI Interpretation</h4>
                      <p className="text-white text-lg leading-relaxed font-display">
                        {selectedMemory.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Metadata Payload</h4>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-primary/80 break-all">
                        {selectedMemory.metadata}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                      <button className="w-full py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Restore This Workspace State
                      </button>
                      <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Purge Memory Index
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
