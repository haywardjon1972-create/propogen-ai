import Generator from "./components/Generator";
import Pricing from "./components/Pricing";
import { SAMPLE_EXCERPT } from "@/lib/sample";

const FEATURES = [
  {
    title: "Free structured drafts",
    description:
      "Get a full proposal skeleton with executive summary, scope, timeline, and next steps — no card required.",
    icon: "1",
  },
  {
    title: "Pro live AI",
    description:
      "Upgrade once and generate AI-written proposals tailored to your brief, tone, and length — powered by Grok.",
    icon: "2",
  },
  {
    title: "Export that ships",
    description:
      "Copy, download .txt, or export a real .docx you can open in Word or Google Docs.",
    icon: "3",
  },
  {
    title: "Run by Grok",
    description:
      "Grok helps write Pro proposals and even runs our social content engine — AI that ships with you.",
    icon: "✦",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
              P
            </span>
            Propogen AI
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
            <a href="#example" className="transition hover:text-foreground">
              Example
            </a>
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a href="#generator" className="transition hover:text-foreground">
              Generator
            </a>
            <a href="#pricing" className="transition hover:text-foreground">
              Pricing
            </a>
          </nav>
          <a
            href="#generator"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Try free
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Powered by Grok · Free to try · Pro when you need AI
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Proposals that write{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                themselves
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Start with a free structured draft. Upgrade to Pro for live AI
              written with{" "}
              <span className="font-semibold text-foreground">Grok</span> —
              tailored to your client, scope, and tone — then export to Word.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#generator"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover"
              >
                Try free generator
              </a>
              <a
                href="#example"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-background"
              >
                See sample output
              </a>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-xs text-muted">
              Free = solid template draft · Pro = Grok-powered rewrite · No card
              required to try
            </p>
            <p className="mx-auto mt-3 max-w-xl rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs text-muted sm:text-sm">
              <span className="font-semibold text-foreground">Built different:</span>{" "}
              Grok powers Pro proposal writing and helps run our content engine
              (including Instagram) — so you get AI that actually ships.
            </p>
          </div>
        </section>

        {/* Sample output */}
        <section
          id="example"
          className="scroll-mt-24 border-b border-border bg-card/40 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Example
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                What a free draft looks like
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                Sample brief: retail omnichannel program. Free builds this kind
                of structure instantly; Pro rewrites it with live AI.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Sample brief
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-muted">Company</dt>
                    <dd className="font-medium">Northbridge Consulting</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Client</dt>
                    <dd className="font-medium">Harborview Retail Group</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Topic</dt>
                    <dd className="font-medium">
                      Omnichannel customer experience program
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Goals</dt>
                    <dd className="text-foreground/90">
                      +15% online conversion, shared inventory, 6-month program
                      (~$80–120k)
                    </dd>
                  </div>
                </dl>
                <a
                  href="#generator"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  Open generator & try this
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:col-span-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Free draft excerpt
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Structured sections
                  </span>
                </div>
                <pre className="max-h-[340px] overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/90 sm:text-sm">
                  {SAMPLE_EXCERPT}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Features
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for getting to a shippable draft
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-24 border-b border-border bg-card/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Three steps to a draft
              </h2>
            </div>
            <ol className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Try the sample or add your brief",
                  body: "One click loads a realistic retail proposal brief — or type your own.",
                },
                {
                  step: "2",
                  title: "Generate free (or Pro AI)",
                  body: "Free builds a structured template draft. Pro uses live AI on your details.",
                },
                {
                  step: "3",
                  title: "Refine & export",
                  body: "Regenerate, shorten, formalize, then copy or download as .docx.",
                },
              ].map((item) => (
                <li key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Generator />
        <Pricing />
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Propogen AI</p>
          <p className="text-center sm:text-right">
            Free drafts · Pro AI powered by{" "}
            <span className="font-medium text-foreground">Grok</span> · Payments
            by Stripe
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-6xl px-4 text-center text-xs text-muted sm:px-6">
          Grok helps write Pro proposals and runs our social content engine —
          including @propogen.ai on Instagram.{" "}
          <a href="/privacy" className="text-primary underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          {" · "}
          <a
            href="/data-deletion"
            className="text-primary underline-offset-2 hover:underline"
          >
            Data deletion
          </a>
        </p>
      </footer>
    </div>
  );
}
