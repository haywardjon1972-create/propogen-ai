/**
 * Shared Propogen support replies for Instagram + Facebook Messenger.
 * Natural chat tone. FAQ first, then Grok.
 */

export const SITE_URL = "https://propogen-ai.vercel.app";
export const SITE_HOST = "propogen-ai.vercel.app";
const MAX_LEN = 900;

export type SupportChannel = "facebook" | "instagram";

export type SupportReplyResult =
  | { action: "skip"; reason: string }
  | {
      action: "reply";
      text: string;
      kind: "welcome" | "faq" | "ai" | "default";
    };

const WELCOME = `Hey! 👋 Thanks for messaging Propogen AI.

Yes! You can create structured proposal drafts for free — no card required.

Visit ${SITE_URL} to get started.

Pro is completely optional. If you ever want live AI assistance, it’s a one-time $19 upgrade.

If you have questions about pricing, Pro features, or proposals, just ask!`;

const PRICING = `Yes! You can create structured proposal drafts for free — no card required.

Visit ${SITE_URL} to get started.

Pro is completely optional. If you ever want live AI assistance, it’s a one-time $19 upgrade (not a monthly subscription).

Questions about free vs Pro? Just ask!`;

const FREE_VS_PRO = `Happy to explain.

On free, you get structured proposal drafts, templates, a sample brief, and Word export — no card needed.

Pro is completely optional. If you ever want live AI assistance with Grok, it’s a one-time $19 upgrade for more tailored writing.

Most people start free here: ${SITE_URL}`;

const FEATURES = `Propogen helps you draft professional proposals without the blank-page stress.

You can pick a template, add your brief (or try the sample), generate a draft, tweak it, and export to Word.

Free covers all of that. Pro is completely optional — if you ever want live AI assistance, it’s a one-time $19 upgrade.

Have a look: ${SITE_URL}

Anything specific you’re wondering about?`;

const HOW_IT_WORKS = `It’s pretty straightforward!

Open ${SITE_URL}, pick a template (or hit Try sample), add your company, client and topic, then generate. You can refine the draft and export to Word.

Free gives you a solid structured draft. Pro is completely optional — live AI assistance is a one-time $19 upgrade if you want it later.

Give it a try, and just ask if you get stuck!`;

const LINK = `Here’s the site:

${SITE_URL}

You can try a free sample draft right on the page — no card required.

Pro is completely optional. If you ever want live AI assistance, it’s a one-time $19 upgrade.

Questions? Just ask!`;

const THANKS = `You’re very welcome!

Whenever you’re ready: ${SITE_URL}

Happy drafting ✨`;

const DEFAULT = `Thanks for your message!

Yes! You can create structured proposal drafts for free — no card required.

Visit ${SITE_URL} to get started.

Pro is completely optional. If you ever want live AI assistance, it’s a one-time $19 upgrade.

If you have questions about pricing, Pro features, or proposals, just ask!`;
type FaqRow = { name: string; match: RegExp; reply: string };

const FAQ: FaqRow[] = [
  {
    name: "welcome",
    match:
      /GET_STARTED|get_started|^START$|^\s*(hi|hello|hey|yo|hiya|good\s*(morning|afternoon|evening))\b/i,
    reply: WELCOME,
  },
  {
    name: "free_vs_pro",
    match:
      /\b(free\s*vs\s*pro|pro\s*vs\s*free|difference|what.?s\s+the\s+difference|upgrade|worth\s+it)\b/i,
    reply: FREE_VS_PRO,
  },
  {
    name: "pricing",
    match:
      /\b(price|pricing|cost|how\s+much|\$|£|payment|pay|subscription|monthly|fee|charge|is\s+it\s+free|free\??)\b/i,
    reply: PRICING,
  },
  {
    name: "features",
    match:
      /\b(feature|features|what\s+can|what\s+do\s+you|capabilities|docx|word|export|template|templates|sample)\b/i,
    reply: FEATURES,
  },
  {
    name: "how",
    match:
      /\b(how\s+(does\s+it\s+)?work|what\s+is\s+(this|propogen)|explain|demo|tutorial|get\s+started)\b/i,
    reply: HOW_IT_WORKS,
  },
  {
    name: "link",
    match:
      /\b(link|website|url|site|where\s+(do\s+i|can\s+i)|web\s*address)\b/i,
    reply: LINK,
  },
  {
    name: "thanks",
    match: /\b(thanks|thank\s+you|thx|ty)\b/i,
    reply: THANKS,
  },
];

function isSkippable(text: string): string | null {
  const t = text.trim();
  if (!t) return "empty";
  if (t.length < 2) return "too_short";
  if (t.length > 800) return "too_long_spam";
  if (/^(🔥|😂|❤️|💯|👏|🙌|\.|…|ok|k|lol)+$/iu.test(t)) return "noise";
  return null;
}

function matchFaq(source: string): { name: string; reply: string } | null {
  for (const row of FAQ) {
    if (row.match.test(source)) {
      return { name: row.name, reply: row.reply };
    }
  }
  if (/^\s*free\??\s*$/i.test(source)) {
    return { name: "pricing", reply: PRICING };
  }
  if (/^\s*pro\??\s*$/i.test(source)) {
    return { name: "free_vs_pro", reply: FREE_VS_PRO };
  }
  return null;
}

const GROK_SYSTEM = `You are a friendly human-sounding support person for Propogen AI on Facebook Messenger / Instagram DMs.

Write like a real chat — short paragraphs, natural language. NOT bullet lists or brochure copy.

Product facts (don't invent):
- Site: ${SITE_URL}
- Free: structured proposal drafts, sample brief, export to Word (.docx), refine tools — no card.
- Pro: $19 one-time (not monthly). Live AI with Grok tailored to their brief.
- For freelancers, consultants, small businesses.

Style example (match this vibe exactly):
"Yes! You can create structured proposal drafts for free—no card required.

Visit ${SITE_URL} to get started.

Pro is completely optional. If you ever want live AI assistance, it's a one-time $19 upgrade.

If you have questions about pricing, Pro features, or proposals, just ask!"

Rules:
- 2–6 short lines. Warm, natural, conversational — like texting a helpful friend.
- Soften Pro: always "completely optional" / "if you ever want".
- Include the website when helpful.
- No hard sell, no fake urgency, no bullet-list brochures.
- Never ask for passwords, cards, or banking info.
- Plain text only.`;

async function craftWithGrok(
  userText: string,
  channel: SupportChannel,
): Promise<string | null> {
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
      temperature: 0.55,
      messages: [
        {
          role: "system",
          content: `${GROK_SYSTEM}\nChannel: ${channel}.`,
        },
        { role: "user", content: userText },
      ],
    }),
  });

  if (!res.ok) {
    console.error("[support] Grok error", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function craftSupportReply(
  text: string,
  opts?: {
    channel?: SupportChannel;
    postbackPayload?: string;
    allowAi?: boolean;
    maxLen?: number;
  },
): Promise<SupportReplyResult> {
  const channel = opts?.channel ?? "facebook";
  const maxLen = opts?.maxLen ?? MAX_LEN;
  const source = (opts?.postbackPayload || text || "").trim();

  if (!source) {
    return { action: "reply", text: WELCOME.slice(0, maxLen), kind: "welcome" };
  }

  if (/GET_STARTED|get_started|^START$/i.test(source)) {
    return { action: "reply", text: WELCOME.slice(0, maxLen), kind: "welcome" };
  }

  const skip = isSkippable(source);
  if (skip && !opts?.postbackPayload) {
    return { action: "skip", reason: skip };
  }

  const faq = matchFaq(source);
  if (faq) {
    const kind = faq.name === "welcome" ? "welcome" : "faq";
    return {
      action: "reply",
      text: faq.reply.slice(0, maxLen),
      kind,
    };
  }

  if (opts?.allowAi !== false && process.env.XAI_API_KEY) {
    try {
      const ai = await craftWithGrok(source, channel);
      if (ai) {
        return {
          action: "reply",
          text: ai.slice(0, maxLen),
          kind: "ai",
        };
      }
    } catch (err) {
      console.error("[support] Grok failed:", err);
    }
  }

  return {
    action: "reply",
    text: DEFAULT.slice(0, maxLen),
    kind: "default",
  };
}

export function craftWelcomeMessage(): string {
  return WELCOME;
}
