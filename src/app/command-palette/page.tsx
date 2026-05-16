"use client";

import { useState, useEffect } from "react";
import { Search, Zap, Bot, FileText, Globe, Terminal, ArrowRight, History, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const suggestions = [
  { id: "s1", type: "cmd", text: "deploy latest build", icon: Zap, color: "#00f0ff" },
  { id: "s2", type: "cmd", text: "summarize Slack #general", icon: Bot, color: "#7000ff" },
  { id: "s3", type: "file", text: "Q3_Invoice_Draft.pdf", icon: FileText, color: "#9ca3af" },
  { id: "s4", type: "repo", text: "nexus-core-engine", icon: Globe, color: "#ffffff" },
];

export default function CommandPalette() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(suggestions);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!query) {
      setResults(suggestions);
      return;
    }
    // Simulate Nexus Search
    const filtered = suggestions.filter(s => s.text.toLowerCase().includes(query.toLowerCase()));
    setResults(filtered);
  }, [query]);

  return (
    <div className="h-screen w-full flex items-start justify-center pt-[10vh] bg-transparent">
      <motion.div 
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="w-[650px] glass-panel border-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.1)] overflow-hidden"
      >
        <div className="relative flex items-center p-5 border-b border-white/10">
          <Search className="w-6 h-6 text-primary mr-4" />
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the Nexus... (GitHub, Slack, Desktop, Agents)"
            className="w-full bg-transparent border-none outline-none text-xl text-white placeholder:text-zinc-600 font-display"
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-1 rounded border border-white/10 uppercase">ESC to close</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((item, i) => (
                <div 
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                    i === activeIndex ? "bg-primary/10 border border-primary/20" : "bg-transparent border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/10 shadow-inner">
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", i === activeIndex ? "text-primary" : "text-white")}>{item.text}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.type}</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {i === activeIndex && (
                      <motion.div 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        className="flex items-center gap-2 text-primary"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Execute</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4 animate-pulse" />
              <p className="text-zinc-500 text-sm">No exact matches found. Ask Nexus AI to find it for you?</p>
              <button className="mt-4 px-6 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-widest">
                Deep Neural Search
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-black/50 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase font-bold">
              <History className="w-3 h-3" />
              Recent
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">summarize repo</span>
              <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">check invoice</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-700 uppercase">Powered by</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Nexus Intelligence</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
