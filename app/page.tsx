import Generator from "./components/Generator";

const FEATURES = [
  {
    title: "AI-powered generation",
    description:
      "Create high-quality proposals and documents in seconds — not hours of blank-page writing.",
    icon: "✦",
  },
  {
    title: "Professional templates",
    description:
      "Business, sales, project, RFP, and report formats structured the way clients expect.",
    icon: "☰",
  },
  {
    title: "Customizable output",
    description:
      "Tune tone, length, and details so every draft matches your brand and audience.",
    icon: "◎",
  },
  {
    title: "Copy & download",
    description:
      "Export your draft instantly, refine in your editor, and ship with confidence.",
    icon: "↓",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
              P
            </span>
            Propogen AI
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a href="#generator" className="transition hover:text-foreground">
              Generator
            </a>
            <a href="#how" className="transition hover:text-foreground">
              How it works
            </a>
          </nav>
          <a
            href="#generator"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Get started
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              AI-powered document writing
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Proposals that write{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                themselves
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Propogen AI turns your brief into professional business proposals,
              reports, and documents — so you can focus on winning the work.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#generator"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover"
              >
                Generate a proposal
              </a>
              <a
                href="#features"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-background"
              >
                See features
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Features
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to ship faster
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
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

        {/* How it works */}
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
                  title: "Pick a template",
                  body: "Choose business, sales, project, RFP, or executive report.",
                },
                {
                  step: "2",
                  title: "Add your details",
                  body: "Company, client, topic, and the key facts that matter.",
                },
                {
                  step: "3",
                  title: "Generate & refine",
                  body: "Get a polished draft, copy or download, then ship it.",
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
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Propogen AI</p>
          <p>AI-powered proposal & document generator</p>
        </div>
      </footer>
    </div>
  );
}
