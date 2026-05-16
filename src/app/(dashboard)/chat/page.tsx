"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, AtSign, RefreshCw, Plus, LayoutPanelLeft, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  agentName?: string;
  agentColor?: string;
  content: string;
  time: string;
}

export default function MultiAgentChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", agentName: "System", agentColor: "#71717a", content: "Welcome to the Team Workspace. You can mention agents with @ to trigger specific behaviors.", time: "10:00 AM" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const agents = [
    { id: "nexus-7", name: "Nexus-7", color: "#00f0ff", icon: "🤖" },
    { id: "content-storm", name: "Content Storm", color: "#7000ff", icon: "⚡" },
    { id: "ceo-clone", name: "CEO Clone", color: "#ffaa00", icon: "🧠" },
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage("");
    setIsThinking(true);

    // Parse mentions
    const mentionedAgents = agents.filter(a => message.toLowerCase().includes(`@${a.name.toLowerCase().replace(' ', '-')}`));
    const targets = mentionedAgents.length > 0 ? mentionedAgents : [agents[0]];

    // Simulate multi-agent response
    for (const agent of targets) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        agentName: agent.name,
        agentColor: agent.color,
        content: `I noticed you mentioned me! Analyzing your request from the perspective of ${agent.name}... [Simulated Intelligence Response]`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    }

    setIsThinking(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-700">
      
      {/* Sidebar: Agents & Context */}
      <div className="w-80 flex flex-col gap-4 shrink-0 overflow-hidden">
        <div className="glass-panel p-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Users className="w-3 h-3 text-primary" />
              Active Workspace Agents
            </h2>
            <button className="p-1 hover:bg-white/5 rounded-md transition-colors">
              <Plus className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto pr-2">
            {agents.map((agent) => (
              <div key={agent.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-sm" style={{ color: agent.color }}>
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{agent.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <AtSign className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Tip</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Use <span className="text-white font-mono bg-white/10 px-1 rounded">@agent-name</span> to target a specific agent, or leave it blank to broadcast to the default handler.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-panel overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
        
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md relative z-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white">Multi-Agent Workspace</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Swarms & Collaborative Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
              <LayoutPanelLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col max-w-[80%] animate-in slide-in-from-bottom-2 duration-300", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
              {msg.agentName && (
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Bot className="w-3 h-3" style={{ color: msg.agentColor }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: msg.agentColor }}>{msg.agentName}</span>
                </div>
              )}
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed transition-all",
                msg.role === "user" 
                  ? "bg-primary/20 border border-primary/30 text-white rounded-tr-sm" 
                  : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm glass whitespace-pre-wrap shadow-lg"
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          
          {isThinking && (
            <div className="mr-auto flex flex-col items-start gap-2 animate-in fade-in duration-300">
               <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Bot className="w-3 h-3 text-zinc-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agents are coordinating...</span>
                </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm glass flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
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
              placeholder="Send a message or mention an agent with @..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600 resize-none h-12 max-h-32"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim() || isThinking}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
