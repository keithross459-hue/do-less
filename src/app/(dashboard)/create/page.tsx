"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Sparkles, Brain, Sliders, Zap, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function CreateAgentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("identity");
  const [isDeploying, setIsDeploying] = useState(false);

  // Form State
  const [agentName, setAgentName] = useState("");
  const [backstory, setBackstory] = useState("");
  const [archetype, setArchetype] = useState("The Executive");
  const [brandColor, setBrandColor] = useState("#00f0ff");
  
  const [personality, setPersonality] = useState({
    humor: 30,
    creativity: 70,
    aggression: 50,
    empathy: 80,
    formality: 40,
    riskTolerance: 60
  });

  const [operatingMode, setOperatingMode] = useState("Corporate");
  const [decisionFramework, setDecisionFramework] = useState("Data-Driven (Logical)");

  const handleDeploy = async () => {
    if (!agentName) {
      alert("Agent name is required");
      return;
    }

    // MONETIZATION: Paywall for premium features
    const premiumArchetypes = ["The Sales Closer (Pro)", "The Hacker (Pro)"];
    if (premiumArchetypes.includes(archetype)) {
      if (confirm("The " + archetype.replace(" (Pro)", "") + " archetype requires a Pro Plan. Upgrade now?")) {
        router.push("/pricing");
      }
      return;
    }

    setIsDeploying(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: agentName,
          backstory,
          archetype,
          brandColor,
          personality,
          operatingMode,
          decisionFramework,
          primaryModel: "gpt-4o",
        }),
      });

      if (res.ok) {
        const newAgent = await res.json();
        router.push(`/agents/${newAgent.id}`);
      } else {
        alert("Failed to deploy agent");
        setIsDeploying(false);
      }
    } catch (error) {
      console.error(error);
      setIsDeploying(false);
    }
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: Bot },
    { id: "personality", label: "Personality", icon: Brain },
    { id: "behavior", label: "Behavior", icon: Sliders },
    { id: "knowledge", label: "Knowledge", icon: Zap },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            Agent Creator
          </h1>
          <p className="text-zinc-400 mt-1">Design your custom AI worker with deep personality controls.</p>
        </div>
        <button 
          onClick={handleDeploy}
          disabled={isDeploying}
          className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isDeploying ? "Deploying..." : "Deploy Agent"}
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar Tabs */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all border",
                  isActive
                    ? "bg-white/10 border-primary/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Area */}
        <div className="flex-1 glass-panel p-8 overflow-y-auto relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {activeTab === "identity" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative z-10">
              <h2 className="text-2xl font-display font-semibold border-b border-white/10 pb-4">Agent Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Agent Name</label>
                  <input 
                    type="text" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Nexus, SalesBot 9000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Backstory / Lore</label>
                  <textarea 
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-32 resize-none"
                    placeholder="Describe who this agent is, where they come from, and their ultimate purpose..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Archetype</label>
                    <select 
                      value={archetype}
                      onChange={(e) => setArchetype(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option>The Executive</option>
                      <option>The Creator</option>
                      <option>The Hacker (Pro)</option>
                      <option>The Therapist</option>
                      <option>The Sales Closer (Pro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Brand Color</label>
                    <div className="flex gap-2">
                      {['#00f0ff', '#7000ff', '#ff0055', '#00ff66', '#ffaa00'].map((color) => (
                        <button 
                          key={color} 
                          onClick={() => setBrandColor(color)}
                          className={cn("w-10 h-10 rounded-full border-2 transition-all cursor-pointer", brandColor === color ? "border-white" : "border-transparent hover:border-white/50")} 
                          style={{ backgroundColor: color }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personality" && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative z-10">
              <h2 className="text-2xl font-display font-semibold border-b border-white/10 pb-4">Personality Engine</h2>
              <p className="text-zinc-400 text-sm">Fine-tune the cognitive defaults of your agent.</p>
              
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-8">
                <SliderControl label="Humor Level" min="Serious" max="Chaotic" value={personality.humor} onChange={(v) => setPersonality(p => ({...p, humor: v}))} />
                <SliderControl label="Creativity" min="Strict" max="Wild" value={personality.creativity} onChange={(v) => setPersonality(p => ({...p, creativity: v}))} />
                <SliderControl label="Aggression" min="Passive" max="Dominant" value={personality.aggression} onChange={(v) => setPersonality(p => ({...p, aggression: v}))} />
                <SliderControl label="Empathy" min="Cold" max="Nurturing" value={personality.empathy} onChange={(v) => setPersonality(p => ({...p, empathy: v}))} />
                <SliderControl label="Formality" min="Slang" max="Corporate" value={personality.formality} onChange={(v) => setPersonality(p => ({...p, formality: v}))} />
                <SliderControl label="Risk Tolerance" min="Safe" max="Reckless" value={personality.riskTolerance} onChange={(v) => setPersonality(p => ({...p, riskTolerance: v}))} />
              </div>
            </div>
          )}

          {activeTab === "behavior" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative z-10">
              <h2 className="text-2xl font-display font-semibold border-b border-white/10 pb-4">Behavior Controls</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Operating Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Corporate', 'Viral Creator', 'Hacker', 'Therapist', 'Closer', 'Teacher'].map(mode => (
                      <button 
                        key={mode} 
                        onClick={() => setOperatingMode(mode)}
                        className={cn(
                          "px-4 py-3 rounded-lg border transition-all text-sm font-medium text-left",
                          operatingMode === mode ? "bg-primary/20 border-primary/50 text-white" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-zinc-300"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Decision Framework</label>
                  <select 
                    value={decisionFramework}
                    onChange={(e) => setDecisionFramework(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option>Data-Driven (Logical)</option>
                    <option>Intuitive (Creative)</option>
                    <option>Consensus (Safe)</option>
                    <option>Aggressive (Growth-oriented)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "knowledge" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 relative z-10">
              <h2 className="text-2xl font-display font-semibold border-b border-white/10 pb-4">Knowledge Base</h2>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-black/20 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Upload Source Material</h3>
                <p className="text-zinc-500 text-sm max-w-sm">Drag and drop PDFs, websites, or datasets. The agent will instantly vectorize and memorize the content.</p>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview / Avatar */}
        <div className="w-80 shrink-0 glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent" style={{ '--tw-gradient-to': `${brandColor}10` } as any}></div>
          <h3 className="absolute top-6 left-6 font-display font-semibold text-zinc-400 uppercase tracking-widest text-xs">Live Preview</h3>
          
          <div className="relative mb-8 mt-12">
            <div className="absolute inset-0 blur-2xl rounded-full animate-pulse opacity-50" style={{ backgroundColor: brandColor }}></div>
            <div className="w-32 h-32 rounded-full border-2 flex items-center justify-center bg-black/50 backdrop-blur-md relative z-10" style={{ borderColor: `${brandColor}80` }}>
              <Bot className="w-16 h-16 text-white" style={{ filter: `drop-shadow(0 0 10px ${brandColor}80)` }} />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2 text-center break-words w-full">{agentName || "Unnamed Agent"}</h2>
          <p className="text-zinc-400 text-sm mb-6 text-center">{operatingMode} • {archetype}</p>

          <div className="w-full space-y-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 font-mono flex items-center justify-between">
              <span>Status</span>
              <span className="flex items-center gap-2" style={{ color: brandColor }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brandColor }}></span>
                Ready
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 font-mono flex items-center justify-between">
              <span>Core Temp</span>
              <span className="text-white">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, min, max, value, onChange }: { label: string, min: string, max: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-white">{label}</span>
        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">{value}%</span>
      </div>
      <Slider value={[value]} max={100} step={1} onValueChange={(vals) => onChange(vals[0])} />
      <div className="flex justify-between items-center text-xs text-zinc-500 font-medium uppercase tracking-wider">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
