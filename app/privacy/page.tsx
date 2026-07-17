import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Propogen AI",
  description: "Privacy Policy for Propogen AI and related services.",
};

export default function PrivacyPage() {
  const updated = "18 July 2026";

  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Back to Propogen AI
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>

      <div className="prose-sm mt-8 space-y-6 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Who we are</h2>
          <p className="mt-2 text-muted">
            Propogen AI (&quot;Propogen&quot;, &quot;we&quot;, &quot;us&quot;) provides an online tool
            that helps users generate professional proposals and documents.
            Our website is available at{" "}
            <a
              className="text-primary underline-offset-2 hover:underline"
              href="https://propogen-ai.vercel.app"
            >
              https://propogen-ai.vercel.app
            </a>
            . You can contact us about privacy at the email associated with
            our Stripe / Meta business account for Propogen AI.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Information we collect
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>
              <strong className="text-foreground">Content you submit</strong>{" "}
              — text you enter into the generator (e.g. company, client, topic,
              details) to create a draft.
            </li>
            <li>
              <strong className="text-foreground">Payment data</strong> — if
              you purchase Pro, payments are processed by Stripe. We do not
              store full card numbers on our servers.
            </li>
            <li>
              <strong className="text-foreground">Technical data</strong> —
              standard server logs (IP address, browser type, timestamps) when
              you use the site.
            </li>
            <li>
              <strong className="text-foreground">Cookies</strong> — we may
              use a secure cookie to remember Pro access after a successful
              payment.
            </li>
            <li>
              <strong className="text-foreground">Social / Meta</strong> —
              if you interact with our Instagram or Facebook presence
              (@propogen.ai / Propogen AI Page), Meta provides us with data
              needed to operate those features (e.g. comments or messages you
              send us), according to Meta&apos;s policies and the permissions
              you grant.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. How we use information
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>To generate and show proposal drafts you request</li>
            <li>To process Pro purchases and unlock paid features</li>
            <li>To operate, secure, and improve the service</li>
            <li>
              To respond to comments or messages on our social channels (when
              those features are enabled)
            </li>
            <li>To comply with law and prevent abuse or fraud</li>
          </ul>
          <p className="mt-2 text-muted">
            Pro AI generation may use third-party AI providers (including xAI /
            Grok) to process the text you submit for that purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Sharing of information
          </h2>
          <p className="mt-2 text-muted">
            We share data only with service providers who help us run Propogen,
            for example:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>Hosting (e.g. Vercel)</li>
            <li>Payments (Stripe)</li>
            <li>AI processing for Pro generation (e.g. xAI)</li>
            <li>Meta platforms when you use Instagram/Facebook features</li>
          </ul>
          <p className="mt-2 text-muted">
            We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Retention</h2>
          <p className="mt-2 text-muted">
            We retain information only as long as needed to provide the
            service, meet legal obligations, resolve disputes, and enforce our
            agreements. Server logs are kept for a limited operational period.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Security</h2>
          <p className="mt-2 text-muted">
            We use reasonable technical and organisational measures to protect
            information (including HTTPS and restricted access to secrets).
            No method of transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Your choices
          </h2>
          <p className="mt-2 text-muted">
            You may stop using the service at any time. You can clear cookies
            in your browser. For questions or requests about your data (access,
            correction, or deletion where applicable), contact us using the
            business email linked to Propogen AI.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Children
          </h2>
          <p className="mt-2 text-muted">
            Propogen is not directed at children under 16. We do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. International users
          </h2>
          <p className="mt-2 text-muted">
            Our service may be hosted in different regions. By using Propogen
            you understand that information may be processed in countries where
            our providers operate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            10. Changes
          </h2>
          <p className="mt-2 text-muted">
            We may update this Privacy Policy from time to time. The &quot;Last
            updated&quot; date at the top will change when we do. Continued use
            of the service after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Contact</h2>
          <p className="mt-2 text-muted">
            Propogen AI — privacy enquiries via the contact email on our
            Stripe merchant / Meta business profile for Propogen AI, or through
            our public website at{" "}
            <a
              className="text-primary underline-offset-2 hover:underline"
              href="https://propogen-ai.vercel.app"
            >
              propogen-ai.vercel.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
