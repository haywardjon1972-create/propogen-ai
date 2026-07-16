import { NextRequest, NextResponse } from "next/server";
import {
  createProToken,
  getStripe,
  isStripeConfigured,
  proCookieOptions,
  verifyProToken,
  PRO_COOKIE,
} from "@/lib/stripe";
import { cookies } from "next/headers";

/** Check if the current visitor already has Pro access. */
export async function GET() {
  const jar = await cookies();
  const isPro = verifyProToken(jar.get(PRO_COOKIE)?.value);
  return NextResponse.json({
    isPro,
    stripeConfigured: isStripeConfigured(),
  });
}

/** After Checkout, verify the session and set the Pro cookie. */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 },
    );
  }

  let sessionId: string;
  try {
    const body = (await req.json()) as { session_id?: string };
    sessionId = body.session_id?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { error: "Missing or invalid session_id" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";
    const complete = session.status === "complete";

    if (!paid || !complete) {
      return NextResponse.json(
        {
          error: "Payment not completed yet.",
          payment_status: session.payment_status,
          status: session.status,
        },
        { status: 402 },
      );
    }

    const id =
      (typeof session.customer === "string"
        ? session.customer
        : session.customer?.id) || session.id;

    const token = createProToken(id);
    const res = NextResponse.json({
      ok: true,
      isPro: true,
      email: session.customer_details?.email ?? session.customer_email,
    });
    res.cookies.set(proCookieOptions(token));
    return res;
  } catch (err) {
    console.error("Stripe verify error:", err);
    const message =
      err instanceof Error ? err.message : "Could not verify payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
