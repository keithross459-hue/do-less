import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { itemId, name, price } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    // Simulate Stripe Checkout Session creation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real implementation, we would call:
    // const session = await stripe.checkout.sessions.create({ ... })
    // return NextResponse.json({ url: session.url });

    // For the UI, we return a mock success
    return NextResponse.json({
      success: true,
      url: `/marketplace?success=true&item=${encodeURIComponent(name)}`
    });

  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
