"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing checkout session. Please return home and try again.");
      return;
    }

    void fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (res) => {
        const data = (await res.json()) as { error?: string; isPro?: boolean };
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        setStatus("ok");
        setMessage(
          "Payment confirmed. Pro is unlocked on this browser — you can generate with live AI.",
        );
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Could not verify payment",
        );
      });
  }, [sessionId]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
            status === "ok"
              ? "bg-success/15 text-success"
              : status === "error"
                ? "bg-red-500/15 text-red-500"
                : "bg-primary/15 text-primary"
          }`}
        >
          {status === "loading" ? "…" : status === "ok" ? "✓" : "!"}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {status === "ok"
            ? "Welcome to Pro"
            : status === "error"
              ? "Something went wrong"
              : "Almost there"}
        </h1>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/#generator"
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Open generator
          </Link>
          <Link
            href="/#pricing"
            className="rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-background"
          >
            Back to pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24 text-muted">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
