import { NextRequest, NextResponse } from "next/server";
import { getInstagramConfig } from "@/lib/instagram";
import {
  alreadyReplied,
  craftAutoReply,
  markReplied,
  replyToComment,
  replyToDm,
} from "@/lib/instagramReplies";

export const dynamic = "force-dynamic";

/**
 * Meta webhook verification (GET) + event receiver (POST).
 * Callback URL: https://propogen-ai.vercel.app/api/social/instagram/webhook
 * Verify token: INSTAGRAM_WEBHOOK_VERIFY_TOKEN
 *
 * Subscribe (App Dashboard → Webhooks → Instagram) to:
 * - comments
 * - messages
 * Then enable the subscription for @propogen.ai
 */

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN?.trim();

  if (mode === "subscribe" && expected && token === expected && challenge) {
    console.log("[ig-webhook] verified");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  // Always 200 quickly so Meta doesn't disable the webhook on processing delays
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Process async-style but await within request (Vercel serverless)
  try {
    await handleWebhook(body);
  } catch (err) {
    console.error("[ig-webhook] handler error:", err);
  }

  return NextResponse.json({ ok: true });
}

type WebhookBody = {
  object?: string;
  entry?: WebhookEntry[];
};

type WebhookEntry = {
  id?: string;
  time?: number;
  changes?: {
    field?: string;
    value?: Record<string, unknown>;
  }[];
  messaging?: {
    sender?: { id?: string };
    recipient?: { id?: string };
    timestamp?: number;
    message?: {
      mid?: string;
      text?: string;
      is_echo?: boolean;
    };
  }[];
};

async function handleWebhook(raw: unknown) {
  const body = raw as WebhookBody;
  if (!body || body.object !== "instagram" || !Array.isArray(body.entry)) {
    return;
  }

  const config = getInstagramConfig();
  if (!config) {
    console.warn("[ig-webhook] Instagram not configured");
    return;
  }

  const ourId = config.igUserId;

  for (const entry of body.entry) {
    // Comments
    if (Array.isArray(entry.changes)) {
      for (const change of entry.changes) {
        if (change.field === "comments" && change.value) {
          await handleComment(config.accessToken, ourId, change.value);
        }
      }
    }

    // DMs
    if (Array.isArray(entry.messaging)) {
      for (const msg of entry.messaging) {
        await handleMessage(config.accessToken, ourId, msg);
      }
    }
  }
}

async function handleComment(
  accessToken: string,
  ourId: string,
  value: Record<string, unknown>,
) {
  const commentId = String(value.id || "");
  const text = String(value.text || "");
  const from = value.from as { id?: string; username?: string } | undefined;
  const fromId = from?.id ? String(from.id) : "";

  if (!commentId) return;
  if (fromId && fromId === ourId) {
    console.log("[ig-webhook] skip own comment");
    return;
  }

  const key = `c:${commentId}`;
  if (alreadyReplied(key)) {
    console.log("[ig-webhook] skip already replied comment", commentId);
    return;
  }

  // Mark early to reduce double-fire races
  markReplied(key);

  const decision = await craftAutoReply(text, { allowAi: true });
  if (decision.action === "skip") {
    console.log("[ig-webhook] skip comment:", decision.reason);
    return;
  }

  try {
    await replyToComment(accessToken, commentId, decision.text);
    console.log(
      "[ig-webhook] replied to comment",
      commentId,
      "kind=",
      decision.kind,
    );
  } catch (err) {
    console.error("[ig-webhook] comment reply failed:", err);
    // allow retry later
    // (Map still has key — acceptable to avoid spam loops on hard failures)
  }
}

async function handleMessage(
  accessToken: string,
  ourId: string,
  msg: {
    sender?: { id?: string };
    recipient?: { id?: string };
    message?: { mid?: string; text?: string; is_echo?: boolean };
  },
) {
  if (msg.message?.is_echo) return;

  const senderId = msg.sender?.id ? String(msg.sender.id) : "";
  const text = msg.message?.text ? String(msg.message.text) : "";
  const mid = msg.message?.mid ? String(msg.message.mid) : "";

  if (!senderId || !text) return;
  if (senderId === ourId) return;

  const key = mid ? `m:${mid}` : `m:${senderId}:${text.slice(0, 40)}`;
  if (alreadyReplied(key)) return;
  markReplied(key);

  const decision = await craftAutoReply(text, { allowAi: true });
  if (decision.action === "skip") return;

  try {
    await replyToDm(accessToken, senderId, decision.text);
    console.log("[ig-webhook] replied to DM from", senderId, decision.kind);
  } catch (err) {
    console.error("[ig-webhook] DM reply failed:", err);
  }
}
