import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_PRO_AMOUNT_CENTS,
  getAppUrl,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.",
      },
      { status: 503 },
    );
  }

  let email: string | undefined;
  try {
    const body = (await req.json()) as { email?: string };
    email = body.email?.trim() || undefined;
  } catch {
    // body optional
  }

  try {
    const stripe = getStripe();
    const appUrl = getAppUrl();
    const priceId = process.env.STRIPE_PRICE_ID?.trim();

    const session = await stripe.checkout.sessions.create({
      mode: priceId ? "subscription" : "payment",
      customer_email: email,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled#pricing`,
      metadata: {
        product: "propogen_pro",
      },
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: DEFAULT_PRO_AMOUNT_CENTS,
                product_data: {
                  name: "Propogen AI Pro",
                  description:
                    "Unlock live AI proposal generation and priority document quality.",
                },
              },
            },
          ],
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create Checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
