"use client";

import { Check, X, Zap } from "lucide-react";
import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, isAnnual }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Scale your <span className="text-primary neon-text">AI Workforce</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
          Choose the perfect plan to unleash the full potential of your autonomous agents. 
          Upgrade now to access premium models, unlimited memory, and custom tool integrations.
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!isAnnual ? "text-white font-medium" : "text-zinc-500"}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-white/10 rounded-full relative transition-colors focus:outline-none"
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary),0.8)] ${isAnnual ? "left-8" : "left-1"}`}></div>
          </button>
          <span className={`text-sm ${isAnnual ? "text-white font-medium" : "text-zinc-500"}`}>Annually <span className="text-accent text-xs ml-1 font-bold">Save 20%</span></span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col h-full relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <p className="text-zinc-400 text-sm h-10">Perfect for exploring agent capabilities.</p>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-4xl font-bold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold text-zinc-500">/mo</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>Up to 3 basic agents</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>100 workflow executions/mo</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-zinc-500" />
              <span>Standard context window (8k)</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-500">
              <X className="w-5 h-5" />
              <span>Custom tools integration</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-500">
              <X className="w-5 h-5" />
              <span>Premium models (GPT-4, Claude 3 Opus)</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass p-8 rounded-3xl border border-primary/50 flex flex-col h-full relative overflow-hidden group hover:border-primary transition-all transform md:-translate-y-4 shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:shadow-[0_0_50px_rgba(var(--primary),0.3)]">
          <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-background text-xs font-bold rounded-bl-lg">
            MOST POPULAR
          </div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-primary neon-text mb-2 flex items-center gap-2">
              Pro <Zap className="w-5 h-5" />
            </h3>
            <p className="text-zinc-400 text-sm h-10">For professionals building serious automation.</p>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-4xl font-bold tracking-tight">${isAnnual ? "49" : "59"}</span>
              <span className="ml-1 text-xl font-semibold text-zinc-500">/mo</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-center gap-3 text-sm text-zinc-200">
              <Check className="w-5 h-5 text-primary" />
              <span>Unlimited advanced agents</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-200">
              <Check className="w-5 h-5 text-primary" />
              <span>10,000 workflow executions/mo</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-200">
              <Check className="w-5 h-5 text-primary" />
              <span>Extended context window (128k)</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-200">
              <Check className="w-5 h-5 text-primary" />
              <span>Custom tools & API integration</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-200">
              <Check className="w-5 h-5 text-primary" />
              <span>Premium models access</span>
            </li>
          </ul>
          <button 
            onClick={() => handleCheckout("pro")}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(var(--primary),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary),0.8)] relative z-10 disabled:opacity-70"
          >
            {isLoading ? "Processing..." : "Upgrade to Pro"}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col h-full relative overflow-hidden group hover:border-secondary/50 transition-all">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-zinc-400 text-sm h-10">Custom deployment for large organizations.</p>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-4xl font-bold tracking-tight">Custom</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-secondary" />
              <span>Everything in Pro</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-secondary" />
              <span>Unlimited workflow executions</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-secondary" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-secondary" />
              <span>On-premise deployment options</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-300">
              <Check className="w-5 h-5 text-secondary" />
              <span>SLA guarantees</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 rounded-xl border border-secondary/50 text-secondary font-medium hover:bg-secondary/10 transition-all">
            Contact Sales
          </button>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-sm text-zinc-500 mb-4">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
          {/* Faux logos */}
          <div className="font-display font-bold text-xl tracking-widest text-white">NEXUS</div>
          <div className="font-display font-bold text-xl tracking-widest text-white italic">SYNERGY</div>
          <div className="font-display font-bold text-xl tracking-widest text-white uppercase">Aether</div>
          <div className="font-display font-bold text-xl tracking-widest text-white font-mono">QUANTUM</div>
        </div>
      </div>
    </div>
  );
}
