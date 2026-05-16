import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AgentProfileClient from "@/components/AgentProfileClient";

export const dynamic = "force-dynamic";

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      memories: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (!agent) {
    notFound();
  }

  return <AgentProfileClient agent={agent} />;
}
