/**
 * Instagram publishing via Meta Graph.
 * Supports:
 * - Instagram API with Instagram Login → graph.instagram.com (tokens often start with IG…)
 * - Instagram API with Facebook Login → graph.facebook.com (Page tokens, often EAA…)
 */

function graphBase(): string {
  const explicit = process.env.INSTAGRAM_GRAPH_BASE?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim() || "";
  // Instagram Login user tokens commonly start with IG
  if (token.startsWith("IG")) {
    return "https://graph.instagram.com/v21.0";
  }
  return "https://graph.facebook.com/v21.0";
}

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

type GraphError = {
  error?: { message?: string; type?: string; code?: number };
};

async function graphGet<T>(
  path: string,
  token: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${graphBase()}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Graph GET failed: ${res.status}`);
  }
  return data;
}

async function graphPost<T>(
  path: string,
  token: string,
  body: Record<string, string>,
): Promise<T> {
  const url = new URL(`${graphBase()}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("access_token", token);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Graph POST failed: ${res.status}`);
  }
  return data;
}

export async function verifyInstagramConnection(config: IgConfig) {
  // Instagram Login: /me works; also try direct id
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

  const container = await graphPost<{ id: string }>(
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

  const published = await graphPost<{ id: string }>(
    `/${config.igUserId}/media_publish`,
    config.accessToken,
    { creation_id: container.id },
  );

  if (!published.id) {
    throw new Error("No media id returned after publish");
  }

  return { containerId: container.id, mediaId: published.id };
}

async function waitForContainer(
  config: IgConfig,
  creationId: string,
  attempts = 10,
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
    await new Promise((r) => setTimeout(r, 2000));
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
