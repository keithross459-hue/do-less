import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

// Provider instances (initialized lazily based on available API keys)
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "missing" });
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "missing" });
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "missing" });

export interface ModelConfig {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "mock";
  model: string;
  description: string;
  strengths: string[];
  costTier: "low" | "medium" | "high";
  speedTier: "fast" | "medium" | "slow";
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    description: "Best all-rounder. Great at reasoning, coding, and creative tasks.",
    strengths: ["reasoning", "coding", "sales", "creativity"],
    costTier: "high",
    speedTier: "fast",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    model: "gpt-4o-mini",
    description: "Fast and affordable. Ideal for routine tasks.",
    strengths: ["speed", "cost", "summarization"],
    costTier: "low",
    speedTier: "fast",
  },
  {
    id: "claude-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    model: "claude-3-5-sonnet-latest",
    description: "Exceptional at nuanced writing, analysis, and emotional intelligence.",
    strengths: ["writing", "analysis", "emotional-intelligence", "safety"],
    costTier: "medium",
    speedTier: "medium",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.0 Flash",
    provider: "google",
    model: "gemini-2.0-flash",
    description: "Google's fast multimodal model. Great at research and factual queries.",
    strengths: ["research", "multimodal", "speed", "cost"],
    costTier: "low",
    speedTier: "fast",
  },
  {
    id: "mock",
    name: "Agent OS Built-in",
    provider: "mock",
    model: "mock",
    description: "Built-in AI for testing. No API key required.",
    strengths: ["testing", "speed"],
    costTier: "low",
    speedTier: "fast",
  },
];

/**
 * Returns the Vercel AI SDK LanguageModel for a given model ID.
 * Falls back to mock if the provider's API key is missing.
 */
export function getLanguageModel(modelId: string): { model: LanguageModel | null; config: ModelConfig; isMock: boolean } {
  const config = AVAILABLE_MODELS.find((m) => m.id === modelId) || AVAILABLE_MODELS[AVAILABLE_MODELS.length - 1];

  if (config.provider === "mock") {
    return { model: null, config, isMock: true };
  }

  // Check if API key is available
  const keyMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  };

  const apiKey = keyMap[config.provider];
  if (!apiKey) {
    // Fallback to mock
    const mockConfig = AVAILABLE_MODELS.find((m) => m.id === "mock")!;
    return { model: null, config: mockConfig, isMock: true };
  }

  // Create the model instance
  let model: LanguageModel;
  switch (config.provider) {
    case "openai":
      model = openai(config.model);
      break;
    case "anthropic":
      model = anthropic(config.model);
      break;
    case "google":
      model = google(config.model);
      break;
    default:
      return { model: null, config, isMock: true };
  }

  return { model, config, isMock: false };
}

/**
 * Build a system prompt from agent configuration
 */
export function buildSystemPrompt(agent: {
  name: string;
  archetype: string;
  backstory?: string | null;
  personality: string;
  operatingMode: string;
  decisionFramework: string;
  communicationStyle: string;
  systemPrompt?: string | null;
}): string {
  let personality: Record<string, number> = {};
  let commStyle: Record<string, number> = {};

  try { personality = JSON.parse(agent.personality); } catch {}
  try { commStyle = JSON.parse(agent.communicationStyle); } catch {}

  const parts: string[] = [
    `You are "${agent.name}", an AI agent with the "${agent.archetype}" archetype.`,
    `Operating Mode: ${agent.operatingMode}`,
    `Decision Framework: ${agent.decisionFramework}`,
  ];

  if (agent.backstory) {
    parts.push(`Backstory: ${agent.backstory}`);
  }

  // Translate personality sliders into behavioral instructions
  const personalityEntries = Object.entries(personality);
  if (personalityEntries.length > 0) {
    parts.push("\nPersonality Parameters:");
    for (const [trait, value] of personalityEntries) {
      const level = value > 75 ? "very high" : value > 50 ? "moderate-to-high" : value > 25 ? "moderate" : "low";
      parts.push(`- ${trait}: ${level} (${value}/100)`);
    }
  }

  const commEntries = Object.entries(commStyle);
  if (commEntries.length > 0) {
    parts.push("\nCommunication Style:");
    for (const [trait, value] of commEntries) {
      parts.push(`- ${trait}: ${value}/100`);
    }
  }

  if (agent.systemPrompt) {
    parts.push(`\nAdditional Instructions:\n${agent.systemPrompt}`);
  }

  parts.push("\nAlways stay in character. Be concise, helpful, and match your personality parameters.");

  return parts.join("\n");
}

/**
 * Generate a mock AI response (used when no API keys are configured)
 */
export function generateMockResponse(agentName: string, userMessage: string): string {
  const responses = [
    `I've analyzed your request and here's my assessment: ${userMessage.slice(0, 50)}... Based on my "${agentName}" framework, I recommend a strategic approach focusing on data-driven decision making and calculated risk-taking. Let me break this down into actionable steps.`,
    `Great question. As ${agentName}, I've processed this through my decision matrix. The key insight here is that we need to balance speed with precision. Here are my top 3 recommendations...`,
    `Understood. Running this through my operational parameters now. My analysis suggests a multi-pronged approach: 1) Validate assumptions, 2) Execute the primary strategy, 3) Monitor KPIs in real-time. Want me to elaborate on any of these?`,
    `I've cross-referenced this with my knowledge base. The optimal path forward involves leveraging existing data patterns while exploring new channels. My confidence level is high on this recommendation.`,
    `Processing... Based on my current configuration and the context of "${userMessage.slice(0, 30)}...", I suggest we focus on the highest-impact actions first. I can draft a detailed execution plan if needed.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
