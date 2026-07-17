import { graphPostForm, graphPostJson } from "./instagramGraph";

const SITE = "propogen-ai.vercel.app";
const MAX_REPLY_LEN = 400;

/** In-memory dedupe (best-effort on serverless; good enough to stop double-replies in a burst). */
const replied = new Map<string, number>();
const REPLY_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function pruneReplied() {
  const now = Date.now();
  for (const [k, t] of replied) {
    if (now - t > REPLY_TTL_MS) replied.delete(k);
  }
}

export function alreadyReplied(key: string): boolean {
  pruneReplied();
  return replied.has(key);
}

export function markReplied(key: string) {
  pruneReplied();
  replied.set(key, Date.now());
}

export type AutoReplyResult =
  | { action: "skip"; reason: string }
  | { action: "reply"; text: string; kind: "faq" | "ai" | "default" };

const FAQ: { match: RegExp; reply: string }[] = [
  {
    match: /\b(free|cost|price|pricing|how much|\$|£|pay|payment|pro)\b/i,
    reply: `Free structured proposal drafts on the web — no card needed to try.\nPro is optional live AI ($19 one-time).\nType: ${SITE}`,
  },
  {
    match: /\b(link|website|url|site|where|demo|try)\b/i,
    reply: `Here’s the site (type it in your browser):\n${SITE}\nFree sample draft available on the generator page.`,
  },
  {
    match: /\b(how (does it )?work|what is (this|propogen)|explain)\b/i,
    reply: `Propogen turns a short brief into a structured business proposal draft.\nFree templates + export. Pro unlocks live AI writing.\nTry it: ${SITE}`,
  },
  {
    match: /\b(hello|hi|hey|thanks|thank you)\b/i,
    reply: `Hey — thanks for reaching out ✦\nFree proposal drafts: ${SITE}\nQuestions about free vs Pro? Just ask.`,
  },
];

function isSkippableText(text: string): string | null {
  const t = text.trim();
  if (!t) return "empty";
  if (t.length < 2) return "too_short";
  if (t.length > 500) return "too_long_spam";
  // emoji-only / pure spam
  if (/^(🔥|😂|❤️|💯|👏|🙌|\.|…)+$/u.test(t)) return "emoji_only";
  return null;
}

/**
 * Choose a safe auto-reply. Prefer FAQ; optional Grok for unclear questions.
 */
export async function craftAutoReply(
  text: string,
  opts?: { allowAi?: boolean },
): Promise<AutoReplyResult> {
  const skip = isSkippableText(text);
  if (skip) return { action: "skip", reason: skip };

  for (const row of FAQ) {
    if (row.match.test(text)) {
      return { action: "reply", text: row.reply.slice(0, MAX_REPLY_LEN), kind: "faq" };
    }
  }

  if (opts?.allowAi !== false && process.env.XAI_API_KEY) {
    try {
      const ai = await craftWithGrok(text);
      if (ai) {
        return {
          action: "reply",
          text: ai.slice(0, MAX_REPLY_LEN),
          kind: "ai",
        };
      }
    } catch (err) {
      console.error("Grok reply failed:", err);
    }
  }

  return {
    action: "reply",
    text: `Thanks for the message ✦ Free proposal drafts on the web: ${SITE} — happy to help with free vs Pro or how it works.`,
    kind: "default",
  };
}

async function craftWithGrok(userText: string): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `You reply as Propogen AI support on Instagram. Be short (1-3 sentences), friendly, professional. No hard sell. Free drafts at ${SITE}. Pro is optional $19 one-time for live AI. Never ask for passwords, cards, or personal banking. Never invent features. Plain text only.`,
        },
        { role: "user", content: userText },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function replyToComment(
  accessToken: string,
  commentId: string,
  message: string,
): Promise<void> {
  await graphPostForm(`/${commentId}/replies`, accessToken, { message });
}

export async function replyToDm(
  accessToken: string,
  recipientId: string,
  message: string,
): Promise<void> {
  // Instagram Messaging API (Instagram Login)
  await graphPostJson(`/me/messages`, accessToken, {
    recipient: { id: recipientId },
    message: { text: message },
  });
}
