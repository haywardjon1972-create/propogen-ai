import Stripe from "stripe";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PRO_COOKIE = "propogen_pro";
const PRO_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year (one-time unlock)

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function signingSecret(): string {
  return (
    process.env.PRO_COOKIE_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "dev-only-insecure-secret"
  );
}

/** Create a signed pro-access token. */
export function createProToken(customerOrSessionId: string): string {
  const exp = Math.floor(Date.now() / 1000) + PRO_COOKIE_MAX_AGE;
  const payload = `pro:${customerOrSessionId}:${exp}`;
  const sig = createHmac("sha256", signingSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyProToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = raw.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = raw.slice(0, lastDot);
    const sig = raw.slice(lastDot + 1);
    const expected = createHmac("sha256", signingSecret())
      .update(payload)
      .digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const parts = payload.split(":");
    const exp = Number(parts[2]);
    if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return parts[0] === "pro";
  } catch {
    return false;
  }
}

export async function isProUser(): Promise<boolean> {
  // Allow local/dev bypass when explicitly enabled
  if (process.env.PRO_ACCESS_BYPASS === "true") return true;
  const jar = await cookies();
  return verifyProToken(jar.get(PRO_COOKIE)?.value);
}

export function proCookieOptions(token: string) {
  return {
    name: PRO_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: PRO_COOKIE_MAX_AGE,
  };
}

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

/** Amount in cents for one-time Pro unlock when STRIPE_PRICE_ID is not set. */
export const DEFAULT_PRO_AMOUNT_CENTS = 1900;
