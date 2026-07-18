/**
 * Shared Propogen support replies for Instagram + Facebook Messenger.
 * FAQ first (pricing / free vs Pro / features), then Grok for the rest.
 */

export const SITE_URL = "https://propogen-ai.vercel.app";
export const SITE_HOST = "propogen-ai.vercel.app";
const MAX_LEN = 900; // Messenger allows more than IG comments

export type SupportChannel = "facebook" | "instagram";

export type SupportReplyResult =
  | { action: "skip"; reason: string }
  | { action: "reply"; text: string; kind: "welcome" | "faq" | "ai" | "default" };

const WELCOME = `Welcome to Propogen AI ✦

We help freelancers & consultants turn a short brief into a professional proposal draft — fast.

FREE
• Structured proposal drafts (no card)
• One-click sample brief
• Copy / .txt / Word (.docx) export
• Regenerate, shorter, more formal

PRO — $19 one-time (not a subscription)
• Everything in Free
• Live AI writing powered by Grok, tailored to your brief

Try free here:
${SITE_URL}

Ask me anything: pricing, free vs Pro, features, or how it works.`;

const PRICING = `Pricing is simple:

FREE forever
• Structured proposal drafts
• Sample brief + export (.docx)
• No card required

PRO — $19 one-time
• Live AI (Grok) rewrites for your client, tone & length
• Not a monthly subscription

Start free: ${SITE_URL}`;

const FREE_VS_PRO = `Free vs Pro:

FREE
• Professional structured drafts (exec summary, approach, next steps)
• Templates, sample, copy & Word export
• Great for a solid starting point

PRO ($19 once)
• Same tools + live AI generation with Grok
• More custom, brief-aware writing

Most people try Free first: ${SITE_URL}`;

const FEATURES = `What Propogen does:

• Business / sales / project / RFP / report-style drafts
• Free structured generator + “Try sample”
• Export to Word (.docx)
• Refine: regenerate, make shorter, more formal
• Pro: Grok-powered live AI writing
• Built for freelancers, consultants & small businesses

Open the app: ${SITE_URL}`;

const HOW_IT_WORKS = `How it works (about 30 seconds):

1. Open ${SITE_URL}
2. Pick a template (or load the sample brief)
3. Add company, client, topic & details
4. Generate → refine → export Word

Free = structured draft. Pro = Grok AI rewrite.

Questions? Ask free vs Pro, pricing, or features.`;

const LINK = `Here’s Propogen AI:

${SITE_URL}

Tip: use “Try sample” on the generator if you want a one-click demo draft.`;

type FaqRow = { name: string; match: RegExp; reply: string };

/** Order matters: more specific rules first. */
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
      /\b(price|pricing|cost|how\s+much|\$|£|payment|pay|subscription|monthly|fee|charge)\b/i,
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
    match: /\b(link|website|url|site|where\s+(do\s+i|can\s+i)|web\s*address)\b/i,
    reply: LINK,
  },
  {
    name: "thanks",
    match: /\b(thanks|thank\s+you|thx|ty)\b/i,
    reply: `You’re welcome ✦\nWhenever you’re ready: ${SITE_URL}\nHappy drafting.`,
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
  // Bare "free?" / "pro?"
  if (/^\s*free\??\s*$/i.test(source)) {
    return { name: "pricing", reply: PRICING };
  }
  if (/^\s*pro\??\s*$/i.test(source)) {
    return { name: "free_vs_pro", reply: FREE_VS_PRO };
  }
  return null;
}

const GROK_SYSTEM = `You are the official support assistant for Propogen AI on social chat (Facebook Messenger / Instagram).

Product facts (never invent beyond this):
- Website: ${SITE_URL}
- Free: structured proposal drafts, templates, sample brief, copy/txt/docx export, regenerate/shorter/formal — no card required.
- Pro: $19 one-time (NOT monthly subscription). Live AI writing powered by Grok, tailored to brief/tone/length.
- Audience: freelancers, consultants, small businesses.
- Grok also helps run Propogen social content (interesting, but don't overclaim).

Style:
- Friendly, clear, professional. 2–5 short lines max.
- Prefer plain text. Light emoji OK (✦).
- Always include ${SITE_URL} when relevant.
- No hard sell, no fake urgency, no "DM for payment link".
- Never ask for passwords, card numbers, OTP, or banking details.
- If unsure, point them to free vs Pro and the website.

If they greet you, give a warm welcome + free/Pro snapshot + link.
If they ask pricing / free vs Pro / features, be precise.`;

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
      temperature: 0.45,
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
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

/**
 * Main entry: FAQ first, then Grok, then safe default.
 */
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
    text: `Thanks for messaging Propogen AI ✦

Free structured drafts (no card): ${SITE_URL}
Pro = $19 one-time for Grok live AI.

Ask about pricing, free vs Pro, or features anytime.`,
    kind: "default",
  };
}

/** Sync helper for simple Messenger postbacks when async isn't needed. */
export function craftWelcomeMessage(): string {
  return WELCOME;
}
