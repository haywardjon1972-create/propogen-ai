import { NextRequest, NextResponse } from "next/server";
import {
  generateCaptionWithAi,
  getInstagramConfig,
  isInstagramConfigured,
  publishImagePost,
} from "@/lib/instagram";
import { AdminAuthError, assertSocialAdmin } from "@/lib/socialAuth";

type Body = {
  caption?: string;
  imageUrl?: string;
  topic?: string;
  generateCaption?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    assertSocialAdmin(req);
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  if (!isInstagramConfigured()) {
    return NextResponse.json(
      {
        error:
          "Instagram not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim() || process.env.INSTAGRAM_DEFAULT_IMAGE_URL?.trim();
  if (!imageUrl) {
    return NextResponse.json(
      {
        error:
          "imageUrl required (public https image). Or set INSTAGRAM_DEFAULT_IMAGE_URL.",
      },
      { status: 400 },
    );
  }

  try {
    let caption = body.caption?.trim() || "";
    if (body.generateCaption || !caption) {
      caption = await generateCaptionWithAi(body.topic);
    }

    const config = getInstagramConfig()!;
    const result = await publishImagePost(config, { imageUrl, caption });

    return NextResponse.json({
      ok: true,
      ...result,
      caption,
      imageUrl,
    });
  } catch (err) {
    console.error("Instagram publish error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed" },
      { status: 502 },
    );
  }
}
