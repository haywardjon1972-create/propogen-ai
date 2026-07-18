import { createHash } from "crypto";
import { craftSupportReply, craftWelcomeMessage } from "./propogenSupportReplies";

const GRAPH = "https://graph.facebook.com/v21.0";

export type FbConfig = {
  pageAccessToken: string;
  pageId?: string;
};

export function getFacebookConfig(): FbConfig | null {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (!pageAccessToken) return null;
  return {
    pageAccessToken,
    pageId: process.env.FACEBOOK_PAGE_ID?.trim() || undefined,
  };
}

export function isFacebookConfigured(): boolean {
  return getFacebookConfig() !== null;
}

type GraphError = { error?: { message?: string } };

async function graphPostJson<T>(
  path: string,
  token: string,
  body: unknown,
): Promise<T> {
  const url = `${GRAPH}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(`${url}?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `FB Graph POST failed: ${res.status}`);
  }
  return data;
}

/** In-memory dedupe for Messenger mid / postback payloads. */
const replied = new Map<string, number>();
const TTL = 1000 * 60 * 60 * 24;

function prune() {
  const now = Date.now();
  for (const [k, t] of replied) {
    if (now - t > TTL) replied.delete(k);
  }
}

export function alreadyHandled(key: string): boolean {
  prune();
  return replied.has(key);
}

export function markHandled(key: string) {
  prune();
  replied.set(key, Date.now());
}

/** @deprecated use craftMessengerReplyAsync — kept for simple sync callers */
export function craftMessengerReply(
  text: string,
  postbackPayload?: string,
): string {
  const source = (postbackPayload || text || "").trim();
  if (!source || /GET_STARTED|get_started|^START$/i.test(source)) {
    return craftWelcomeMessage();
  }
  // Sync path: only FAQ-ish default (no await). Prefer async in webhook.
  return craftWelcomeMessage();
}

export async function craftMessengerReplyAsync(
  text: string,
  postbackPayload?: string,
): Promise<{ text: string; kind: string }> {
  const result = await craftSupportReply(text, {
    channel: "facebook",
    postbackPayload,
    allowAi: true,
    maxLen: 900,
  });
  if (result.action === "skip") {
    return { text: craftWelcomeMessage(), kind: "welcome" };
  }
  return { text: result.text, kind: result.kind };
}

/**
 * Messenger Send API — text reply to a PSID.
 * https://developers.facebook.com/docs/messenger-platform/send-messages
 */
export async function sendMessengerText(
  pageAccessToken: string,
  recipientPsid: string,
  text: string,
): Promise<{ message_id?: string; recipient_id?: string }> {
  const result = await graphPostJson<{
    message_id?: string;
    recipient_id?: string;
  }>("/me/messages", pageAccessToken, {
    recipient: { id: recipientPsid },
    messaging_type: "RESPONSE",
    message: { text: text.slice(0, 2000) },
  });
  console.log("[fb-send] Graph API response", result);
  return result;
}

export function makeConfirmationCode(seed: string): string {
  return createHash("sha256")
    .update(`${seed}:${Date.now()}`)
    .digest("hex")
    .slice(0, 12);
}
