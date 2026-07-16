import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import type Stripe from "stripe";

/**
 * Optional webhook for subscription lifecycle / logging.
 * Pro access for Checkout is primarily granted via /api/stripe/verify + cookie.
 *
 * In Stripe Dashboard → Developers → Webhooks, point to:
 *   https://YOUR_DOMAIN/api/stripe/webhook
 * Events: checkout.session.completed, customer.subscription.deleted
 * Set STRIPE_WEBHOOK_SECRET from the webhook signing secret.
 */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Local/dev fallback without signature (not for production)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        "[stripe] checkout.session.completed",
        session.id,
        session.customer_email ?? session.customer_details?.email,
      );
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log("[stripe] subscription.deleted", sub.id, sub.customer);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
