"use client";

import { useEffect, useState } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [stripeReady, setStripeReady] = useState(true);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    void fetch("/api/stripe/verify")
      .then((r) => r.json())
      .then((data: { isPro?: boolean; stripeConfigured?: boolean }) => {
        setIsPro(Boolean(data.isPro));
        setStripeReady(data.stripeConfigured !== false);
      })
      .catch(() => {});

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "cancelled") {
        setCancelled(true);
      }
    }
  }, []);

  async function startCheckout() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Start free. Upgrade only if you want AI.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Free always works — structured proposal drafts with no card. Pro is
            a one-time unlock for live AI rewrites on this browser.
          </p>
        </div>

        {cancelled && (
          <p className="mx-auto mb-6 max-w-lg rounded-xl border border-border bg-card px-4 py-3 text-center text-sm text-muted">
            Checkout was cancelled. You can try again anytime.
          </p>
        )}

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-muted">Free</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              $0
              <span className="text-base font-normal text-muted"> forever</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>✓ Structured proposal drafts (no card)</li>
              <li>✓ Sample brief + one-click try</li>
              <li>✓ Copy, .txt, and .docx export</li>
              <li>✓ Regenerate / shorter / more formal</li>
              <li className="text-muted/70">– Live AI writing</li>
            </ul>
            <a
              href="#generator"
              className="mt-8 flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-background"
            >
              Keep using free
            </a>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-md">
            <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
              Optional upgrade
            </span>
            <p className="text-sm font-semibold text-primary">Pro</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              $19
              <span className="text-base font-normal text-muted"> one-time</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>✓ Everything in Free</li>
              <li>✓ Live AI generation powered by Grok</li>
              <li>✓ Brief-aware custom drafts</li>
              <li>✓ Unlock on this browser after payment</li>
            </ul>

            {isPro ? (
              <div className="mt-8 rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
                Pro unlocked on this browser ✓
              </div>
            ) : (
              <button
                type="button"
                onClick={startCheckout}
                disabled={loading || !stripeReady}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Redirecting to Stripe…"
                  : !stripeReady
                    ? "Stripe not configured"
                    : "Upgrade with Stripe"}
              </button>
            )}

            {error && (
              <p className="mt-3 text-center text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {!stripeReady && (
              <p className="mt-3 text-center text-xs text-muted">
                Add STRIPE_SECRET_KEY on the server to enable checkout.
              </p>
            )}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted">
          Payments are processed securely by Stripe. Use test card{" "}
          <code className="rounded bg-card px-1 py-0.5">4242 4242 4242 4242</code>{" "}
          in test mode.
        </p>
      </div>
    </section>
  );
}
