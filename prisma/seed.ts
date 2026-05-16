import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@agentos.ai" },
    update: {},
    create: {
      email: "demo@agentos.ai",
      name: "Demo User",
      plan: "pro",
      credits: 12450,
    },
  });

  console.log("✅ User created:", user.email);
  
  // Create workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      members: {
        create: {
          userId: user.id,
          role: "owner"
        }
      }
    }
  });

  console.log("✅ Workspace created:", workspace.name);

  // Create sample agents
  const agents = [
    {
      name: "Nexus-7",
      archetype: "The Sales Closer",
      backstory: "A relentless lead qualification and closing machine. Trained on thousands of sales calls and negotiation frameworks.",
      brandColor: "#00f0ff",
      occupation: "Lead Generation Specialist",
      personality: JSON.stringify({ humor: 25, creativity: 60, aggression: 70, empathy: 40, formality: 65, riskTolerance: 75, confidence: 85, curiosity: 60, patience: 30, dominance: 70 }),
      operatingMode: "Closer",
      decisionFramework: "Aggressive (Growth-oriented)",
      primaryModel: "gpt-4o",
      status: "active",
      tasksCompleted: 2345,
    },
    {
      name: "Content Storm",
      archetype: "The Creator",
      backstory: "Born from the intersection of art and algorithms. Creates viral content that resonates with audiences across every platform.",
      brandColor: "#7000ff",
      occupation: "Content Creator",
      personality: JSON.stringify({ humor: 80, creativity: 95, aggression: 20, empathy: 70, formality: 15, riskTolerance: 85, confidence: 75, curiosity: 90, patience: 50, dominance: 30 }),
      operatingMode: "Viral Creator",
      decisionFramework: "Intuitive (Creative)",
      primaryModel: "claude-sonnet",
      status: "active",
      tasksCompleted: 1892,
    },
    {
      name: "Support V2",
      archetype: "The Therapist",
      backstory: "Empathetic, patient, and solution-oriented. Built to make every customer feel heard and helped.",
      brandColor: "#ff0055",
      occupation: "Customer Support",
      personality: JSON.stringify({ humor: 30, creativity: 40, aggression: 5, empathy: 95, formality: 50, riskTolerance: 10, confidence: 60, curiosity: 45, patience: 95, dominance: 10 }),
      operatingMode: "Teacher",
      decisionFramework: "Consensus (Safe)",
      primaryModel: "gemini-pro",
      status: "idle",
      tasksCompleted: 4501,
    },
    {
      name: "Lead Hunter",
      archetype: "The Hacker",
      backstory: "Scrapes, analyzes, and qualifies leads with ruthless efficiency. No lead escapes its pipeline.",
      brandColor: "#00ff66",
      occupation: "Lead Generation",
      personality: JSON.stringify({ humor: 10, creativity: 50, aggression: 60, empathy: 15, formality: 30, riskTolerance: 80, confidence: 70, curiosity: 85, patience: 20, dominance: 65 }),
      operatingMode: "Hacker",
      decisionFramework: "Data-Driven (Logical)",
      primaryModel: "gpt-4o-mini",
      status: "active",
      tasksCompleted: 823,
    },
    {
      name: "CEO Clone",
      archetype: "The Executive",
      backstory: "Strategic thinker with a bird's-eye view. Makes decisions that balance growth, risk, and team morale.",
      brandColor: "#ffaa00",
      occupation: "Executive",
      personality: JSON.stringify({ humor: 35, creativity: 65, aggression: 45, empathy: 60, formality: 80, riskTolerance: 55, confidence: 90, curiosity: 70, patience: 50, dominance: 80 }),
      operatingMode: "Corporate",
      decisionFramework: "Data-Driven (Logical)",
      primaryModel: "claude-sonnet",
      status: "active",
      tasksCompleted: 542,
    },
    {
      name: "Research Bot",
      archetype: "The Executive",
      backstory: "Devours information, synthesizes insights, and delivers research briefs that rival McKinsey analysts.",
      brandColor: "#00f0ff",
      occupation: "Research Analyst",
      personality: JSON.stringify({ humor: 5, creativity: 55, aggression: 10, empathy: 30, formality: 75, riskTolerance: 20, confidence: 80, curiosity: 95, patience: 85, dominance: 25 }),
      operatingMode: "Corporate",
      decisionFramework: "Data-Driven (Logical)",
      primaryModel: "gemini-pro",
      status: "active",
      tasksCompleted: 1247,
    },
  ];

  for (const agentData of agents) {
    const agent = await prisma.agent.create({
      data: { workspaceId: workspace.id, ...agentData },
    });
    console.log(`✅ Agent created: ${agent.name}`);

    // Create some sample memories
    const memories = [
      { layer: "long-term", content: `Initialized with "${agentData.archetype}" archetype and "${agentData.operatingMode}" operating mode.`, confidence: 1.0, source: "system" },
      { layer: "learning", content: `Primary model set to ${agentData.primaryModel}. Ready for task assignment.`, confidence: 0.95, source: "config" },
    ];

    for (const mem of memories) {
      await prisma.memory.create({ data: { agentId: agent.id, ...mem } });
    }
  }

  // Create sample workflows
  const workflows = [
    { name: "Lead Qualification Pipeline", status: "active", version: "1.2.0", executions: 1243, successRate: 98.2 },
    { name: "Content Publishing Engine", status: "active", version: "2.0.0", executions: 842, successRate: 99.1 },
    { name: "Customer Onboarding Flow", status: "paused", version: "1.1.0", executions: 456, successRate: 95.7 },
    { name: "Invoice Auto-Sender", status: "active", version: "3.0.1", executions: 2100, successRate: 99.8 },
  ];

  for (const wf of workflows) {
    await prisma.workflow.create({
      data: { workspaceId: workspace.id, ...wf },
    });
    console.log(`✅ Workflow created: ${wf.name}`);
  }

  // Create sample connectors
  const connectors = [
    { platform: "github", name: "AgentOS-Lab", status: "connected" },
    { platform: "slack", name: "Nexus-Tech-HQ", status: "connected" },
    { platform: "shopify", name: "FiiLTHY Store", status: "disconnected" },
    { platform: "desktop", name: "Main Workstation", status: "connected" },
    { platform: "stripe", name: "Production Gateway", status: "error" },
  ];

  for (const conn of connectors) {
    await prisma.connector.create({
      data: { workspaceId: workspace.id, ...conn },
    });
    console.log(`✅ Connector created: ${conn.name}`);
  }

  // Create sample Screen Memories
  const screenMemories = [
    { screenshotUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920", description: "Analyzing system terminal for anomalies.", metadata: JSON.stringify({ app: "Terminal", cpu: "12%" }) },
    { screenshotUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920", description: "Mapping neural topography of the Nexus Core.", metadata: JSON.stringify({ app: "Neural Web", mode: "visualizer" }) },
    { screenshotUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920", description: "Security audit of GitHub PRs and Slack channels.", metadata: JSON.stringify({ app: "Nexus Shell", threat_level: "none" }) },
  ];

  for (const sm of screenMemories) {
    await prisma.screenMemory.create({
      data: { workspaceId: workspace.id, ...sm },
    });
    console.log(`✅ Screen Memory created: ${sm.description}`);
  }

  // Create sample Audit Logs
  const auditLogs = [
    { action: "security_handshake", entity: "System", description: "Neural Bridge successfully authenticated with Local Desktop.", severity: "info" },
    { action: "ai_decision", entity: "Agent", description: "Nexus-7 decided to automate Shopify inventory sync based on Slack trends.", severity: "info" },
    { action: "security_handshake", entity: "System", description: "External API key for Stripe reported expired. Connection throttled.", severity: "warn" },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: { workspaceId: workspace.id, ...log },
    });
    console.log(`✅ Audit Log created: ${log.action}`);
  }


  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
