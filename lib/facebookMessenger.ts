import { createHash } from "crypto";

const GRAPH = "https://graph.facebook.com/v21.0";
const SITE = "propogen-ai.vercel.app";

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

const FAQ: { match: RegExp; reply: string }[] = [
  {
    match: /\b(free|cost|price|pricing|how much|\$|£|pay|payment|pro)\b/i,
    reply: `Free structured proposal drafts on the web — no card needed to try.\nPro is optional live AI ($19 one-time).\nWebsite: https://${SITE}`,
  },
  {
    match: /\b(link|website|url|site|where|demo|try)\b/i,
    reply: `Here’s Propogen AI:\nhttps://${SITE}\nFree sample draft available on the generator page.`,
  },
  {
    match: /\b(how (does it )?work|what is (this|propogen)|explain)\b/i,
    reply: `Propogen turns a short brief into a structured business proposal draft.\nFree templates + export. Pro unlocks live AI writing with Grok.\nTry it: https://${SITE}`,
  },
  {
    match: /\b(hello|hi|hey|thanks|thank you)\b/i,
    reply: `Hey — thanks for messaging Propogen AI ✦\nFree proposal drafts: https://${SITE}\nAsk about free vs Pro anytime.`,
  },
];

export function craftMessengerReply(
  text: string,
  postbackPayload?: string,
): string {
  const source = (postbackPayload || text || "").trim();
  if (!source) {
    return `Thanks for reaching out ✦ Free proposal drafts: https://${SITE}`;
  }

  // Common postback payloads
  if (/GET_STARTED|get_started|START/i.test(source)) {
    return `Welcome to Propogen AI ✦\nGenerate free structured proposal drafts at https://${SITE}\nPro unlocks live AI writing (optional). How can we help?`;
  }

  for (const row of FAQ) {
    if (row.match.test(source)) return row.reply;
  }

  return `Thanks for your message ✦\nFree proposal drafts: https://${SITE}\nAsk about free vs Pro, or how it works.`;
}

/**
 * Messenger Send API — text reply to a PSID.
 * https://developers.facebook.com/docs/messenger-platform/send-messages
 */
export async function sendMessengerText(
  pageAccessToken: string,
  recipientPsid: string,
  text: string,
): Promise<{ message_id?: string }> {
  return graphPostJson("/me/messages", pageAccessToken, {
    recipient: { id: recipientPsid },
    messaging_type: "RESPONSE",
    message: { text: text.slice(0, 2000) },
  });
}

export function makeConfirmationCode(seed: string): string {
  return createHash("sha256")
    .update(`${seed}:${Date.now()}`)
    .digest("hex")
    .slice(0, 12);
}
