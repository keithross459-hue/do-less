"use client";

import { useState } from "react";
import { Bot, Activity, BrainCircuit, MessageSquare, Send, Settings2, PlayCircle, StopCircle, RefreshCw, Globe, DollarSign, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentProfileClient({ agent }: { agent: any }) {
  const [isRunning, setIsRunning] = useState(agent.status === "active");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "agent", text: `System online. Neural pathways initialized. I am ${agent.name}. How can I assist you today?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Marketplace Publish State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishPrice, setPublishPrice] = useState(agent.price?.toString() || "29");
  const [publishDesc, setPublishDesc] = useState(agent.marketplaceDescription || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/agents/${agent.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: true,
          price: publishPrice,
          marketplaceDescription: publishDesc
        }),
      });
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => {
          setShowPublishModal(false);
          setPublishSuccess(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setChatHistory(prev => [...prev, { role: "user", text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage("");
    setIsThinking(true);
    
    try {
      const res = await fetch(`/api/agents/${agent.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, conversationId }),
      });
      
      const data = await res.json();
      
      if (data.conversationId) setConversationId(data.conversationId);
      
      setChatHistory(prev => [...prev, { 
        role: "agent", 
        text: data.reply || "Error: No response.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: "agent", 
        text: "Error connecting to AI engine.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const personality = typeof agent.personality === "string" ? JSON.parse(agent.personality) : agent.personality || {};

  return (
    <div className="h-full flex gap-6 animate-in fade-in duration-700 min-h-0">
      
      {/* Agent Stats & Controls */}
      <div className="w-1/3 flex flex-col gap-6 shrink-0 min-h-0 overflow-y-auto">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${agent.brandColor}20` }}></div>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn("absolute inset-0 rounded-full blur-md", isRunning ? "animate-pulse" : "bg-zinc-500/20")} style={{ backgroundColor: isRunning ? `${agent.brandColor}80` : undefined }} />
                <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-sm">
                  <Bot className={cn("w-8 h-8", isRunning ? `drop-shadow-[0_0_8px_${agent.brandColor}]` : "text-zinc-500")} style={{ color: isRunning ? agent.brandColor : undefined }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">{agent.name}</h1>
                <p className="text-zinc-400 text-sm">{agent.occupation || agent.archetype}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPublishModal(true)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                title="Publish to Marketplace"
              >
                <Globe className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  "p-3 rounded-xl flex items-center justify-center transition-all shadow-lg",
                  isRunning 
                    ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" 
                    : "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                )}
              >
                {isRunning ? <StopCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Status</p>
              <p className={cn("text-sm font-medium", isRunning ? "neon-text" : "text-zinc-400")} style={{ color: isRunning ? agent.brandColor : undefined }}>
                {isRunning ? "Autonomous Mode" : "Standby"}
              </p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> Model</p>
              <p className="text-sm font-medium text-white">{agent.primaryModel}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 flex-1">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-secondary" />
              Live Parameters
            </h2>
          </div>
          
          <div className="space-y-4">
             {Object.entries(personality).slice(0, 4).map(([key, value]) => (
               <ParameterBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={value as number} color={agent.brandColor} />
             ))}
             {Object.keys(personality).length === 0 && <p className="text-sm text-zinc-500">No custom parameters set.</p>}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Memory Logs</h3>
            <div className="space-y-2">
              {agent.memories?.slice(0, 3).map((mem: any) => (
                <div key={mem.id} className="text-xs p-2 rounded bg-white/5 border border-white/5 text-zinc-300 font-mono flex items-center gap-2 truncate">
                  <span className="text-primary shrink-0">{new Date(mem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> 
                  <span className="truncate">{mem.content}</span>
                </div>
              ))}
              {!agent.memories?.length && <p className="text-xs text-zinc-500">No memory logs yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Testing Chat */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md relative z-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-white">Sandbox Environment</h2>
          </div>
          <button 
            onClick={() => { setChatHistory([{ role: "agent", text: "Context reset. Ready for new input.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); setConversationId(null); }}
            className="text-xs px-3 py-1.5 rounded-md bg-white/10 text-zinc-300 hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Context
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {chatHistory.map((msg, i) => (
            <div key={i} className={cn("flex flex-col max-w-[80%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "user" 
                  ? "bg-primary/20 border border-primary/30 text-white rounded-tr-sm" 
                  : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm glass whitespace-pre-wrap"
              )}>
                {msg.text}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          
          {isThinking && (
            <div className="mr-auto flex items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm glass w-24">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        <div className="p-4 bg-black/50 border-t border-white/10 backdrop-blur-md relative z-10 shrink-0">
          <div className="relative flex items-end gap-2">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Test your agent's behavior..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600 resize-none h-12 max-h-32"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim() || isThinking}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 text-center">
            Sandbox mode using live AI model. Messages will be stored in this agent's conversational memory.
          </p>
        </div>
      </div>

      {/* Marketplace Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {publishSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Successfully Listed!</h3>
                <p className="text-zinc-400">Your agent is now live on the marketplace.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Publish to Marketplace</h3>
                    <p className="text-zinc-400 text-sm">Monetize your AI creation</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Listing Description</label>
                    <textarea 
                      value={publishDesc}
                      onChange={(e) => setPublishDesc(e.target.value)}
                      placeholder="Explain what this agent does for potential buyers..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-zinc-700 h-32 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Listing Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="number"
                        value={publishPrice}
                        onChange={(e) => setPublishPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    {isPublishing ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Publish Agent Listing"}
                  </button>
                  <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
                    You keep 80% of all sales earnings.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ParameterBar({ label, value, color }: { label: string, value: number, color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="h-full shadow-[0_0_10px_rgba(112,0,255,0.8)]" style={{ width: `${value}%`, backgroundColor: color || "#00f0ff" }}></div>
      </div>
    </div>
  );
}
