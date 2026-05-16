"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  LayoutDashboard, 
  Network, 
  Store, 
  Settings, 
  Database,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Agents", href: "/agents", icon: Bot },
  { name: "Workflows", href: "/workflows", icon: Network },
  { name: "Memory base", href: "/memory", icon: Database },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 glass flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-primary neon-text font-display font-bold text-xl tracking-wider">
          <Bot className="w-6 h-6" />
          <span>AGENT.OS</span>
        </div>
      </div>
      
      <div className="p-4">
        <Link href="/create" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-all font-medium neon-border">
          <PlusCircle className="w-5 h-5" />
          Create Agent
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px]">
            <div className="w-full h-full bg-background rounded-full border border-white/10 flex items-center justify-center text-xs font-bold">
              U
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">User</span>
            <span className="text-xs text-zinc-500">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
