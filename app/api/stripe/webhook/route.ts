import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { logRaaS } from "@/lib/logger";
import { sendRaaSNotification, paymentConfirmedEmail } from "@/lib/resend";

// PRD 8: Stripe webhook – handles payment completion for RaaS outcomes
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("[Stripe Webhook Error]", err);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const outcomeId = session.metadata?.outcomeId;

    if (outcomeId) {
      // Update outcome to paid
      await supabaseAdmin
        .from("outcomes")
        .update({
          status: "paid",
          payment_triggered: true,
          stripe_session_id: session.id,
        })
        .eq("id", outcomeId);

      // Get outcome details for notification
      const { data: outcome } = await supabaseAdmin
        .from("outcomes")
        .select("*, users(email)")
        .eq("id", outcomeId)
        .single();

      if (outcome?.users?.email) {
        const amount = ((session.amount_total || 0) / 100).toFixed(2);
        await sendRaaSNotification(
          outcome.users.email,
          `Payment Confirmed – ${outcome.title}`,
          paymentConfirmedEmail(outcome.title, amount)
        );
      }

      logRaaS("payment_completed", {
        outcomeId,
        amount: session.amount_total,
        sessionId: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
