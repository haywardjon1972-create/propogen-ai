/** Shared low-level Graph helpers for Instagram Login / Facebook Graph. */

export function graphBase(): string {
  const explicit = process.env.INSTAGRAM_GRAPH_BASE?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim() || "";
  if (token.startsWith("IG")) {
    return "https://graph.instagram.com/v21.0";
  }
  return "https://graph.facebook.com/v21.0";
}

type GraphError = {
  error?: { message?: string; type?: string; code?: number };
};

export async function graphGet<T>(
  path: string,
  token: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(
    `${graphBase()}${path.startsWith("/") ? path : `/${path}`}`,
  );
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

export async function graphPostForm<T>(
  path: string,
  token: string,
  body: Record<string, string>,
): Promise<T> {
  const url = new URL(
    `${graphBase()}${path.startsWith("/") ? path : `/${path}`}`,
  );
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

export async function graphPostJson<T>(
  path: string,
  token: string,
  body: unknown,
): Promise<T> {
  const url = new URL(
    `${graphBase()}${path.startsWith("/") ? path : `/${path}`}`,
  );
  url.searchParams.set("access_token", token);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Graph POST JSON failed: ${res.status}`);
  }
  return data;
}
