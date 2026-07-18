/**
 * Instagram publishing via Meta Graph.
 * Supports Instagram Login (graph.instagram.com) and Facebook Login (graph.facebook.com).
 */

import { graphGet, graphPostForm } from "./instagramGraph";

export type IgConfig = {
  accessToken: string;
  igUserId: string;
};

export function getInstagramConfig(): IgConfig | null {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  if (!accessToken || !igUserId) return null;
  return { accessToken, igUserId };
}

export function isInstagramConfigured(): boolean {
  return getInstagramConfig() !== null;
}

export async function verifyInstagramConnection(config: IgConfig) {
  try {
    const me = await graphGet<{
      id?: string;
      user_id?: string;
      username?: string;
      name?: string;
      account_type?: string;
    }>(`/me`, config.accessToken, {
      fields: "user_id,username,id,account_type,name",
    });
    return {
      id: me.user_id || me.id || config.igUserId,
      username: me.username,
      name: me.name,
      account_type: me.account_type,
    };
  } catch {
    const direct = await graphGet<{
      id?: string;
      username?: string;
      name?: string;
    }>(`/${config.igUserId}`, config.accessToken, {
      fields: "id,username,name",
    });
    return {
      id: direct.id || config.igUserId,
      username: direct.username,
      name: direct.name,
    };
  }
}

/**
 * Publish a single image feed post.
 * imageUrl must be a public HTTPS URL Instagram can download.
 */
export async function publishImagePost(
  config: IgConfig,
  opts: { imageUrl: string; caption: string },
): Promise<{ containerId: string; mediaId: string }> {
  const imageUrl = opts.imageUrl.trim();
  const caption = opts.caption.trim();

  if (!imageUrl.startsWith("https://")) {
    throw new Error("imageUrl must be a public https:// URL");
  }
  if (!caption) {
    throw new Error("caption is required");
  }

  const container = await graphPostForm<{ id: string }>(
    `/${config.igUserId}/media`,
    config.accessToken,
    {
      image_url: imageUrl,
      caption,
    },
  );

  if (!container.id) {
    throw new Error("No container id returned from Instagram");
  }

  await waitForContainer(config, container.id);

  const published = await graphPostForm<{ id: string }>(
    `/${config.igUserId}/media_publish`,
    config.accessToken,
    { creation_id: container.id },
  );

  if (!published.id) {
    throw new Error("No media id returned after publish");
  }

  return { containerId: container.id, mediaId: published.id };
}

/**
 * Publish a Reel (or VIDEO) from a public HTTPS video URL.
 * videoUrl must be downloadable by Instagram's servers.
 */
export async function publishVideoPost(
  config: IgConfig,
  opts: {
    videoUrl: string;
    caption: string;
    mediaType?: "REELS" | "VIDEO";
  },
): Promise<{ containerId: string; mediaId: string }> {
  const videoUrl = opts.videoUrl.trim();
  const caption = opts.caption.trim();
  const mediaType = opts.mediaType ?? "REELS";

  if (!videoUrl.startsWith("https://")) {
    throw new Error("videoUrl must be a public https:// URL");
  }
  if (!caption) {
    throw new Error("caption is required");
  }

  const container = await graphPostForm<{ id: string }>(
    `/${config.igUserId}/media`,
    config.accessToken,
    {
      media_type: mediaType,
      video_url: videoUrl,
      caption,
      share_to_feed: "true",
    },
  );

  if (!container.id) {
    throw new Error("No container id returned from Instagram video create");
  }

  // Video processing often needs longer than images
  await waitForContainer(config, container.id, 40, 3000);

  const published = await graphPostForm<{ id: string }>(
    `/${config.igUserId}/media_publish`,
    config.accessToken,
    { creation_id: container.id },
  );

  if (!published.id) {
    throw new Error("No media id returned after video publish");
  }

  return { containerId: container.id, mediaId: published.id };
}

async function waitForContainer(
  config: IgConfig,
  creationId: string,
  attempts = 10,
  delayMs = 2000,
): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      const status = await graphGet<{
        status_code?: string;
        status?: string;
      }>(`/${creationId}`, config.accessToken, {
        fields: "status_code,status",
      });

      const code = (status.status_code || status.status || "").toUpperCase();
      if (code === "FINISHED" || code === "PUBLISHED") return;
      if (code === "ERROR" || code === "EXPIRED") {
        throw new Error(`Instagram media container failed: ${code}`);
      }
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

export async function generateCaptionWithAi(topic?: string): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY not set — cannot generate caption with AI");
  }

  const prompt = `You write Instagram captions for Propogen AI (@propogen.ai).
Propogen is a free proposal/document generator for freelancers & consultants.
Website: propogen-ai.vercel.app (tell people to type it; avoid hard "pay now" language).
Tone: clear, helpful, professional. Short paragraphs. 8-12 hashtags at the end.
${topic ? `Topic focus: ${topic}` : "Topic: useful proposal tip or product awareness."}
Return ONLY the caption text, no quotes or markdown.`;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages: [
        {
          role: "system",
          content: "You are a social media manager for Propogen AI.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    throw new Error(`xAI caption error: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty caption from AI");
  return text;
}
