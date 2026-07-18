import { graphPostForm, graphPostJson } from "./instagramGraph";
import { craftSupportReply } from "./propogenSupportReplies";

const MAX_REPLY_LEN = 500; // IG comment replies should stay short

/** In-memory dedupe (best-effort on serverless). */
const replied = new Map<string, number>();
const REPLY_TTL_MS = 1000 * 60 * 60 * 24;

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
  | { action: "reply"; text: string; kind: "welcome" | "faq" | "ai" | "default" };

/**
 * Choose a safe auto-reply. Prefer FAQ; Grok for other questions.
 */
export async function craftAutoReply(
  text: string,
  opts?: { allowAi?: boolean },
): Promise<AutoReplyResult> {
  const result = await craftSupportReply(text, {
    channel: "instagram",
    allowAi: opts?.allowAi,
    maxLen: MAX_REPLY_LEN,
  });
  return result;
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
  await graphPostJson(`/me/messages`, accessToken, {
    recipient: { id: recipientId },
    message: { text: message },
  });
}
