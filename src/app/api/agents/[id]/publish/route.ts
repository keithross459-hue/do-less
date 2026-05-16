import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { isPublic, price, marketplaceDescription } = await req.json();

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        isPublic,
        price: parseFloat(price) || 0,
        marketplaceDescription
      }
    });

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to publish agent" }, { status: 500 });
  }
}
