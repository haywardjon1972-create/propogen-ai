"use client";

import { useState } from "react";

export default function SocialAdminPage() {
  const [secret, setSecret] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [topic, setTopic] = useState("proposal writing tip for freelancers");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<string>("");

  const headers = () => ({
    "Content-Type": "application/json",
    "x-social-admin-secret": secret,
  });

  async function checkStatus() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/social/instagram/status", {
        headers: { "x-social-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status failed");
      if (!data.configured) {
        setProfile("Not configured — add tokens in Vercel env");
        setStatus(data.message || "Not configured");
      } else if (data.ok) {
        setProfile(
          `@${data.profile?.username || "?"} (id: ${data.profile?.id || "?"})`,
        );
        setStatus("Connected ✓");
      } else {
        setProfile("");
        setStatus(data.error || "Connection error");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function genCaption() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/social/instagram/caption", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Caption failed");
      setCaption(data.caption || "");
      setStatus("Caption generated");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    if (!confirm("Publish this post to Instagram @propogen.ai now?")) return;
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/social/instagram/publish", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          imageUrl: imageUrl || undefined,
          caption: caption || undefined,
          topic,
          generateCaption: !caption,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setStatus(`Published ✓ media id: ${data.mediaId}`);
      if (data.caption) setCaption(data.caption);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Propogen · IG Admin</h1>
      <p className="mt-2 text-sm text-muted">
        Official Meta Graph API poster for{" "}
        <span className="font-medium text-foreground">@propogen.ai</span>.
        Not a password login — uses access tokens from env.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Admin secret (SOCIAL_ADMIN_SECRET)
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="Your admin secret"
          />
        </div>

        <button
          type="button"
          onClick={() => void checkStatus()}
          disabled={loading || !secret}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Test connection
        </button>

        {profile && (
          <p className="text-sm">
            Profile: <span className="font-medium">{profile}</span>
          </p>
        )}

        <hr className="border-border" />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Public image URL (https)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="https://…/post-image.png"
          />
          <p className="mt-1 text-xs text-muted">
            Instagram must be able to download this URL. Host on your site,
            Imgur, Cloudinary, etc. Or set INSTAGRAM_DEFAULT_IMAGE_URL.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Topic (for AI caption)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="Leave empty to auto-generate with AI when publishing"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void genCaption()}
            disabled={loading || !secret}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Generate caption (AI)
          </button>
          <button
            type="button"
            onClick={() => void publish()}
            disabled={loading || !secret}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Publish to Instagram
          </button>
        </div>

        {status && (
          <p className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            {status}
          </p>
        )}
      </div>

      <p className="mt-6 text-xs text-muted">
        Setup guide:{" "}
        <code className="rounded bg-card px-1">marketing/instagram-auto-post-setup.md</code>
      </p>
    </div>
  );
}
