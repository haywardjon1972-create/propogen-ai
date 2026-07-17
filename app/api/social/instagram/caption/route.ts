import { NextRequest, NextResponse } from "next/server";
import { generateCaptionWithAi } from "@/lib/instagram";
import { AdminAuthError, assertSocialAdmin } from "@/lib/socialAuth";

export async function POST(req: NextRequest) {
  try {
    assertSocialAdmin(req);
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  let topic: string | undefined;
  try {
    const body = (await req.json()) as { topic?: string };
    topic = body.topic;
  } catch {
    // optional body
  }

  try {
    const caption = await generateCaptionWithAi(topic);
    return NextResponse.json({ ok: true, caption });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Caption failed" },
      { status: 502 },
    );
  }
}
