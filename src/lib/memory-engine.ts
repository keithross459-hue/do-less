import prisma from "@/lib/prisma";

/**
 * Semantic memory search (Simplified for SQLite)
 * In production, this would use pgvector or Pinecone.
 */
export async function getRelevantMemories(agentId: string, query: string, limit: number = 5) {
  // We use a simple keyword match for the mock/SQLite implementation
  // A real implementation would generate an embedding for 'query' and do a vector search.
  
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  
  if (keywords.length === 0) {
    return await prisma.memory.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Find memories that contain any of the keywords
  const memories = await prisma.memory.findMany({
    where: {
      agentId,
      OR: keywords.map(k => ({
        content: { contains: k }
      }))
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  return memories;
}

export async function addMemory(agentId: string, content: string, metadata: any = {}) {
  return await prisma.memory.create({
    data: {
      agentId,
      content,
      type: "semantic",
      metadata: JSON.stringify(metadata)
    }
  });
}
