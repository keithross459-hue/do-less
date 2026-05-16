"use client";

import { Bell, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 glass shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search agents, workflows..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        </button>
        <div className="h-6 w-px bg-white/10"></div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">Credits:</span>
          <span className="text-primary font-mono font-bold">12,450</span>
        </div>
      </div>
    </header>
  );
}
