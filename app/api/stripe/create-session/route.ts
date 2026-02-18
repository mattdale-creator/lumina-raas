import { NextRequest, NextResponse } from "next/server";
import { createPayPerResultSession } from "@/lib/stripe";

// PRD 8: Create Stripe checkout session for pay-per-result
export async function POST(req: NextRequest) {
  try {
    const { outcomeId, amountCents, userEmail } = await req.json();

    if (!outcomeId || !amountCents || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await createPayPerResultSession(
      outcomeId,
      amountCents,
      userEmail
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("[Stripe Session Error]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
