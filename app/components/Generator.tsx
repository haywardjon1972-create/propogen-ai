"use client";

import { useEffect, useState } from "react";

const TEMPLATES = [
  { id: "business", label: "Business Proposal" },
  { id: "project", label: "Project Proposal" },
  { id: "sales", label: "Sales Proposal" },
  { id: "report", label: "Executive Report" },
  { id: "rfp", label: "RFP Response" },
] as const;

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "persuasive", label: "Persuasive" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
] as const;

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Detailed" },
] as const;

export default function Generator() {
  const [template, setTemplate] = useState<string>("business");
  const [tone, setTone] = useState<string>("professional");
  const [length, setLength] = useState<string>("medium");
  const [company, setCompany] = useState("");
  const [client, setClient] = useState("");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    void fetch("/api/stripe/verify")
      .then((r) => r.json())
      .then((data: { isPro?: boolean }) => setIsPro(Boolean(data.isPro)))
      .catch(() => {});
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOutput("");
    setSource(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          tone,
          length,
          company,
          client,
          topic,
          details,
        }),
      });

      const data = (await res.json()) as {
        document?: string;
        source?: string;
        error?: string;
        isPro?: boolean;
      };
      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }
      setOutput(data.document ?? "");
      setSource(data.source ?? null);
      if (typeof data.isPro === "boolean") setIsPro(data.isPro);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!output) return;
    void navigator.clipboard.writeText(output);
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `propogen-${template}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section id="generator" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Generator
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Create your document
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Choose a template, describe what you need, and generate a polished
            draft in seconds.
          </p>
          <p className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <span
              className={`h-1.5 w-1.5 rounded-full ${isPro ? "bg-success" : "bg-muted"}`}
            />
            {isPro ? (
              <span className="text-success">Pro · live AI unlocked</span>
            ) : (
              <span className="text-muted">
                Free plan ·{" "}
                <a href="#pricing" className="font-semibold text-primary underline-offset-2 hover:underline">
                  upgrade for AI
                </a>
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Your company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Consulting"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Client / audience
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Northwind Corp"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Topic / project title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Digital transformation engagement"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Key details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Goals, scope, timeline, budget range, differentiators…"
                  rows={5}
                  className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                  >
                    {TONES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                  >
                    {LENGTHS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating…
                  </>
                ) : (
                  "Generate document"
                )}
              </button>
            </div>
          </form>

          <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                Preview
              </h3>
              {output && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-background"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-background"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            {source && (
              <p className="mb-3 text-xs text-muted">
                Source:{" "}
                <span className="font-medium text-foreground">{source}</span>
              </p>
            )}

            <div className="flex-1 overflow-auto rounded-xl border border-border bg-background p-4">
              {loading && (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-muted">
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  <p className="text-sm">Drafting your document…</p>
                </div>
              )}
              {!loading && !output && (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-center text-muted">
                  <p className="text-sm font-medium text-foreground">
                    Your document will appear here
                  </p>
                  <p className="max-w-xs text-xs">
                    Fill in the form and hit Generate to create a professional
                    draft.
                  </p>
                </div>
              )}
              {!loading && output && (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
