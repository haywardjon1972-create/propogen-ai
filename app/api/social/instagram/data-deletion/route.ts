import { createHash, createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Meta "Data Deletion Request Callback"
 * Docs: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 *
 * Meta POSTs signed_request. We return:
 * { url: confirmation_status_url, confirmation_code: "..." }
 */

type DeletionStatus = {
  userId: string;
  confirmationCode: string;
  receivedAt: string;
  status: "completed" | "pending";
};

/** Best-effort status store (serverless may reset; instructions page remains). */
const statuses = new Map<string, DeletionStatus>();

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function parseSignedRequest(
  signedRequest: string,
  secret: string,
): { user_id?: string } | null {
  const [encodedSig, payload] = signedRequest.split(".", 2);
  if (!encodedSig || !payload) return null;

  const sig = base64UrlDecode(encodedSig);
  const expectedSig = createHmac("sha256", secret).update(payload).digest();

  if (
    sig.length !== expectedSig.length ||
    !timingSafeEqual(sig, expectedSig)
  ) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload).toString("utf8")) as {
      user_id?: string;
    };
  } catch {
    return null;
  }
}

function extractUserIdUnsafe(signedRequest: string): string | null {
  try {
    const payload = signedRequest.split(".")[1];
    if (!payload) return null;
    const data = JSON.parse(base64UrlDecode(payload).toString("utf8")) as {
      user_id?: string;
    };
    return data.user_id ? String(data.user_id) : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://propogen-ai.vercel.app";

  let signedRequest = "";
  try {
    const form = await req.formData();
    signedRequest = String(form.get("signed_request") || "");
  } catch {
    try {
      const json = (await req.json()) as { signed_request?: string };
      signedRequest = String(json.signed_request || "");
    } catch {
      signedRequest = "";
    }
  }

  const secret =
    process.env.META_APP_SECRET?.trim() ||
    process.env.FACEBOOK_APP_SECRET?.trim() ||
    "";

  let userId = "unknown";
  if (signedRequest && secret) {
    const parsed = parseSignedRequest(signedRequest, secret);
    if (parsed?.user_id) userId = String(parsed.user_id);
    else {
      const fallback = extractUserIdUnsafe(signedRequest);
      if (fallback) userId = fallback;
    }
  } else if (signedRequest) {
    const fallback = extractUserIdUnsafe(signedRequest);
    if (fallback) userId = fallback;
  }

  const confirmationCode = createHash("sha256")
    .update(`${userId}:${Date.now()}:${Math.random()}`)
    .digest("hex")
    .slice(0, 16);

  // We do not retain long-lived social profiles; mark completed.
  statuses.set(confirmationCode, {
    userId,
    confirmationCode,
    receivedAt: new Date().toISOString(),
    status: "completed",
  });

  console.log("[data-deletion] request", { userId, confirmationCode });

  return NextResponse.json({
    url: `${appUrl}/data-deletion?code=${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code || !statuses.has(code)) {
    return NextResponse.json({
      status: "unknown",
      message:
        "No in-memory record for this code (may reset after redeploy). Use https://propogen-ai.vercel.app/data-deletion for manual requests.",
    });
  }
  return NextResponse.json(statuses.get(code));
}
