import { NextRequest, NextResponse } from "next/server";
import {
  generateCaptionWithAi,
  getInstagramConfig,
  isInstagramConfigured,
  publishImagePost,
  publishVideoPost,
} from "@/lib/instagram";
import { AdminAuthError, assertSocialAdmin } from "@/lib/socialAuth";

type Body = {
  caption?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: "REELS" | "VIDEO" | "IMAGE";
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

  const videoUrl = body.videoUrl?.trim();
  const imageUrl =
    body.imageUrl?.trim() || process.env.INSTAGRAM_DEFAULT_IMAGE_URL?.trim();

  if (!videoUrl && !imageUrl) {
    return NextResponse.json(
      {
        error:
          "imageUrl or videoUrl required (public https). Or set INSTAGRAM_DEFAULT_IMAGE_URL.",
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

    if (videoUrl) {
      const result = await publishVideoPost(config, {
        videoUrl,
        caption,
        mediaType: body.mediaType === "VIDEO" ? "VIDEO" : "REELS",
      });
      return NextResponse.json({
        ok: true,
        type: "video",
        ...result,
        caption,
        videoUrl,
      });
    }

    const result = await publishImagePost(config, {
      imageUrl: imageUrl!,
      caption,
    });

    return NextResponse.json({
      ok: true,
      type: "image",
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
