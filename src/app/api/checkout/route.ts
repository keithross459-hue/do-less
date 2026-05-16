import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with a placeholder key for development if env var is missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_12345");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, isAnnual } = body;

    // Determine price ID based on plan (using placeholders for now)
    let priceId = "";
    if (plan === "pro") {
      priceId = isAnnual ? "price_pro_annual_placeholder" : "price_pro_monthly_placeholder";
    }

    // In a real app, you'd use actual Stripe Price IDs here
    // For demonstration, we create a mock checkout session response if no real key is set
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        url: "/pricing?success=true", // Redirect to a success state locally
        message: "Demo mode: Stripe key not found. Simulating checkout." 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // This would need to be a real price ID in production
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    });
  }
}
