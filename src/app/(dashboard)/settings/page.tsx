"use client";

import { Settings, User, CreditCard, Shield, Bell, Palette, Key, Users, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "team", label: "Team", icon: Users },
  { id: "integrations", label: "Integrations", icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("billing");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-zinc-400 mt-1">Manage your account, billing, integrations, and team.</p>
      </div>

      <div className="flex gap-6 min-h-[600px]">
        {/* Settings Nav */}
        <div className="w-56 shrink-0 space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border",
                  isActive
                    ? "bg-white/10 text-white border-primary/50"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border-transparent"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-panel p-8">
          {activeSection === "billing" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-display font-semibold text-white border-b border-white/10 pb-4">Billing & Plans</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Starter", price: "$0", features: ["3 Agents", "100 tasks/mo", "Community support"], current: false },
                  { name: "Pro", price: "$49", features: ["Unlimited Agents", "10K tasks/mo", "Priority support", "Marketplace access"], current: true },
                  { name: "Enterprise", price: "$199", features: ["Everything in Pro", "Unlimited tasks", "Custom SLA", "White-label", "Dedicated CSM"], current: false },
                ].map((plan) => (
                  <div key={plan.name} className={cn("p-6 rounded-2xl border transition-all", plan.current ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]" : "border-white/10 bg-white/[0.02]")}>
                    {plan.current && <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 block">Current Plan</span>}
                    <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
                    <p className="text-3xl font-display font-bold text-white mt-2">{plan.price}<span className="text-sm text-zinc-500 font-normal">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm text-zinc-400 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={cn("w-full mt-6 py-2.5 rounded-xl text-sm font-medium transition-all", plan.current ? "bg-white/10 text-zinc-400 cursor-default" : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20")}>
                      {plan.current ? "Active" : "Upgrade"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-6 mt-6">
                <h3 className="text-sm font-semibold text-white mb-3">Usage This Month</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Tasks Used</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary w-[67%] rounded-full" /></div>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">6,700 / 10,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Storage</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-secondary w-[34%] rounded-full" /></div>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">3.4 GB / 10 GB</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">API Calls</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-[82%] rounded-full" /></div>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">82K / 100K</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== "billing" && (
            <div className="flex items-center justify-center h-full text-zinc-600">
              <p className="font-mono text-sm">Section "{activeSection}" — Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
