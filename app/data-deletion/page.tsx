import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion — Propogen AI",
  description:
    "How to request deletion of your data from Propogen AI and related Meta integrations.",
};

export default function DataDeletionPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Back to Propogen AI
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Data deletion instructions
      </h1>
      <p className="mt-2 text-sm text-muted">
        For Propogen AI users and Meta / Instagram app users
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Website & generator data
          </h2>
          <p className="mt-2">
            Propogen AI processes text you enter to generate documents. Draft
            text is used to fulfil your request and is not used to build a
            public profile of you.
          </p>
          <p className="mt-2">
            To request deletion of data associated with your use of the site
            (including Pro access cookies where applicable):
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Clear site cookies/storage for propogen-ai.vercel.app in your browser</li>
            <li>
              Email a deletion request from the address you used with Stripe
              (if you purchased Pro), or any contact email linked to your use
            </li>
            <li>
              Subject line: <strong className="text-foreground">Propogen data deletion request</strong>
            </li>
          </ol>
          <p className="mt-2">
            Contact via the business email on our Stripe merchant profile /
            Meta business profile for Propogen AI, or write to us through{" "}
            <a
              href="https://propogen-ai.vercel.app"
              className="text-primary underline-offset-2 hover:underline"
            >
              propogen-ai.vercel.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Instagram / Facebook (Meta) app data
          </h2>
          <p className="mt-2">
            If you interacted with Propogen via Instagram or Facebook (for
            example comments or messages), Meta may send us a data deletion
            request when you remove the app or request deletion in your Meta
            settings.
          </p>
          <p className="mt-2">
            Our automated callback URL for Meta is:
          </p>
          <p className="mt-2 break-all rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-foreground">
            https://propogen-ai.vercel.app/api/social/instagram/data-deletion
          </p>
          <p className="mt-2">
            When we receive a valid request, we delete or de-identify related
            logs and stored identifiers associated with that request on our
            systems (to the extent we hold any), and return a confirmation
            status URL as required by Meta.
          </p>
          <p className="mt-2">
            You can also request deletion manually using the same email process
            in section 1, mentioning your Instagram username.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Payments (Stripe)
          </h2>
          <p className="mt-2">
            Payment records are retained by Stripe as required for accounting
            and legal purposes. Card details are handled by Stripe, not stored
            in full on Propogen servers. For payment data rights, you may also
            contact Stripe or us with your receipt/email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Timing
          </h2>
          <p className="mt-2">
            We aim to complete deletion requests within 30 days, unless a
            longer period is required by law (for example tax or fraud
            prevention records).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Related policy
          </h2>
          <p className="mt-2">
            See our{" "}
            <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>{" "}
            for full details on how we collect and use information.
          </p>
        </section>
      </div>
    </div>
  );
}
