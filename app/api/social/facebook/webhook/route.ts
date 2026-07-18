import { NextRequest, NextResponse } from "next/server";
import {
  alreadyHandled,
  craftMessengerReply,
  getFacebookConfig,
  markHandled,
  sendMessengerText,
} from "@/lib/facebookMessenger";

export const dynamic = "force-dynamic";

/**
 * Facebook Messenger webhook for Propogen AI Page.
 *
 * Callback URL (production):
 *   https://propogen-ai.vercel.app/api/social/facebook/webhook
 *
 * Verify token env:
 *   FACEBOOK_WEBHOOK_VERIFY_TOKEN
 *
 * Page send token env:
 *   FACEBOOK_PAGE_ACCESS_TOKEN
 *
 * Subscribe Page fields in Meta:
 *   messages, messaging_postbacks
 */

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");
  const expected = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN?.trim();

  if (mode === "subscribe" && expected && token === expected && challenge) {
    console.log("[fb-webhook] verified");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    await handleMessengerWebhook(body);
  } catch (err) {
    console.error("[fb-webhook] handler error:", err);
  }

  // Always ack so Meta does not disable the subscription
  return NextResponse.json({ ok: true });
}

type MessagingEvent = {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
    app_id?: number;
  };
  postback?: {
    title?: string;
    payload?: string;
    mid?: string;
  };
};

type WebhookBody = {
  object?: string;
  entry?: {
    id?: string;
    time?: number;
    messaging?: MessagingEvent[];
  }[];
};

async function handleMessengerWebhook(raw: unknown) {
  const body = raw as WebhookBody;
  // Messenger Platform uses object: "page"
  if (!body || body.object !== "page" || !Array.isArray(body.entry)) {
    console.log("[fb-webhook] ignore non-page object", body?.object);
    return;
  }

  const config = getFacebookConfig();
  if (!config) {
    console.warn("[fb-webhook] FACEBOOK_PAGE_ACCESS_TOKEN not set");
    return;
  }

  for (const entry of body.entry) {
    if (!Array.isArray(entry.messaging)) continue;

    for (const event of entry.messaging) {
      await handleMessagingEvent(config.pageAccessToken, event);
    }
  }
}

async function handleMessagingEvent(
  pageAccessToken: string,
  event: MessagingEvent,
) {
  const senderId = event.sender?.id ? String(event.sender.id) : "";
  if (!senderId) return;

  // Ignore echoes / page's own outbound messages
  if (event.message?.is_echo) {
    console.log("[fb-webhook] skip echo");
    return;
  }

  // --- messaging_postbacks ---
  if (event.postback) {
    const payload = String(event.postback.payload || event.postback.title || "");
    const mid = event.postback.mid
      ? String(event.postback.mid)
      : `pb:${senderId}:${payload}`;
    const key = `fb:pb:${mid}`;
    if (alreadyHandled(key)) return;
    markHandled(key);

    const text = craftMessengerReply("", payload);
    try {
      await sendMessengerText(pageAccessToken, senderId, text);
      console.log("[fb-webhook] replied to postback from", senderId);
    } catch (err) {
      console.error("[fb-webhook] postback reply failed:", err);
    }
    return;
  }

  // --- messages ---
  if (event.message) {
    const text = event.message.text ? String(event.message.text) : "";
    if (!text.trim()) {
      console.log("[fb-webhook] skip non-text message");
      return;
    }

    const mid = event.message.mid
      ? String(event.message.mid)
      : `m:${senderId}:${text.slice(0, 40)}`;
    const key = `fb:m:${mid}`;
    if (alreadyHandled(key)) return;
    markHandled(key);

    const reply = craftMessengerReply(text);
    try {
      await sendMessengerText(pageAccessToken, senderId, reply);
      console.log("[fb-webhook] replied to message from", senderId);
    } catch (err) {
      console.error("[fb-webhook] message reply failed:", err);
    }
  }
}
