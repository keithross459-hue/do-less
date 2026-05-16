"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, Search, Star, Download, TrendingUp, Filter, Bot, Network, Sparkles, Zap, Crown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Agents", "Workflows", "Templates", "Prompts", "Knowledge Packs"];

const featuredItems = [
  { id: 1, name: "Ultimate Sales Closer", type: "Agent", creator: "AgentForge", rating: 4.9, downloads: 12400, price: "$49", image: "🤖", color: "#00f0ff", featured: true },
  { id: 2, name: "Content Viral Engine", type: "Workflow", creator: "GrowthLab", rating: 4.8, downloads: 8900, price: "$29", image: "⚡", color: "#7000ff", featured: true },
  { id: 3, name: "CEO Decision Matrix", type: "Template", creator: "BizOps Pro", rating: 4.7, downloads: 5600, price: "Free", image: "🧠", color: "#ff0055", featured: false },
];

const trendingItems = [
  { id: 4, name: "Lead Magnet Builder", type: "Workflow", creator: "FunnelKing", rating: 4.6, downloads: 3200, price: "$19" },
  { id: 5, name: "Research Analyst v3", type: "Agent", creator: "DeepThink", rating: 4.9, downloads: 7800, price: "$39" },
  { id: 6, name: "Email Nurture Pack", type: "Template", creator: "MailFlow", rating: 4.5, downloads: 2100, price: "$15" },
  { id: 7, name: "Cold Outreach Bot", type: "Agent", creator: "SalesHQ", rating: 4.4, downloads: 4500, price: "$29" },
  { id: 8, name: "SEO Content Writer", type: "Agent", creator: "RankBot", rating: 4.8, downloads: 9200, price: "$59" },
  { id: 9, name: "Customer Support Pro", type: "Agent", creator: "HelpDesk AI", rating: 4.7, downloads: 6100, price: "Free" },
];

const typeIcons: Record<string, React.ElementType> = {
  Agent: Bot,
  Workflow: Network,
  Template: Sparkles,
  Prompt: Zap,
};

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successItem = searchParams.get("item");
  const isSuccess = searchParams.get("success") === "true";
  
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const handlePurchase = async (item: any) => {
    setPurchasing(item.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, name: item.name, price: item.price })
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      
      {isSuccess && (
        <div className="absolute top-0 right-0 z-50 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span>Successfully purchased <strong>{successItem}</strong>!</span>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Store className="w-8 h-8 text-primary" />
          Marketplace
        </h1>
        <p className="text-zinc-400 mt-1">Discover, buy, and sell AI agents, workflows, and templates.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search agents, workflows, templates..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
              i === 0
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-display font-semibold text-white">Featured</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredItems.map((item) => {
            const TypeIcon = typeIcons[item.type] || Sparkles;
            return (
              <div 
                key={item.id} 
                onClick={() => handlePurchase(item)}
                className={cn("glass-panel p-6 group hover:border-white/15 transition-all cursor-pointer relative overflow-hidden", purchasing === item.id && "opacity-50 pointer-events-none")}
              >
                {purchasing === item.id && <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: item.color }} />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="text-4xl">{item.image}</div>
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", item.price === "Free" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20")}>
                    {item.price}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-1 relative z-10">{item.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 relative z-10">
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>by {item.creator}</span>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white font-medium">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Download className="w-3.5 h-3.5" />
                    {item.downloads.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-display font-semibold text-white">Trending</h2>
        </div>
        <div className="space-y-2">
          {trendingItems.map((item, i) => {
            const TypeIcon = typeIcons[item.type] || Sparkles;
            return (
              <div 
                key={item.id} 
                onClick={() => handlePurchase(item)}
                className={cn("flex items-center justify-between p-4 glass-panel hover:border-white/15 transition-all cursor-pointer group relative overflow-hidden", purchasing === item.id && "opacity-50 pointer-events-none")}
              >
                {purchasing === item.id && <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-display font-bold text-zinc-600 w-8 text-center">#{i + 1}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-xs text-zinc-500">{item.type} by {item.creator}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-xs text-white">{item.rating}</span></div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500"><Download className="w-3.5 h-3.5" />{item.downloads.toLocaleString()}</div>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium", item.price === "Free" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-zinc-300")}>{item.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500 animate-pulse">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
