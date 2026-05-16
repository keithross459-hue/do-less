import { NextResponse } from "next/server";
import { AVAILABLE_MODELS } from "@/lib/ai-engine";

// GET /api/models - List available AI models
export async function GET() {
  // Mark which models have valid API keys
  const models = AVAILABLE_MODELS.map((m) => {
    let available = true;
    if (m.provider === "openai") available = !!process.env.OPENAI_API_KEY;
    else if (m.provider === "anthropic") available = !!process.env.ANTHROPIC_API_KEY;
    else if (m.provider === "google") available = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    else if (m.provider === "mock") available = true;

    return { ...m, available };
  });

  return NextResponse.json(models);
}
