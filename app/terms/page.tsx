import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Propogen AI",
  description: "Terms of Service for Propogen AI.",
};

export default function TermsPage() {
  const updated = "18 July 2026";

  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Back to Propogen AI
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Agreement
          </h2>
          <p className="mt-2">
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of Propogen AI (the &quot;Service&quot;), including our website
            at{" "}
            <a
              href="https://propogen-ai.vercel.app"
              className="text-primary underline-offset-2 hover:underline"
            >
              https://propogen-ai.vercel.app
            </a>
            , related features, and optional paid offerings. By using the
            Service, you agree to these Terms. If you do not agree, please do
            not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. The Service
          </h2>
          <p className="mt-2">
            Propogen AI provides tools to help generate professional proposal
            and document drafts. Free features may include structured drafts,
            templates, and export options. Paid features (such as &quot;Pro&quot;)
            may unlock live AI generation and other capabilities as described
            on the site at the time of purchase.
          </p>
          <p className="mt-2">
            Outputs are drafts for your review. You are responsible for
            checking accuracy, legality, and suitability before using any
            document with clients or third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Accounts and access
          </h2>
          <p className="mt-2">
            Some features may work without an account. Pro access may be tied
            to payment confirmation and browser cookies or similar mechanisms.
            You are responsible for maintaining the security of your devices
            and any credentials associated with your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Payments
          </h2>
          <p className="mt-2">
            Paid plans are processed by Stripe or other payment providers we
            designate. Prices and plan details are shown at checkout. Unless
            required by law or stated otherwise at purchase, fees are
            non-refundable once access has been delivered. Taxes may apply.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Acceptable use
          </h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use the Service for unlawful, harmful, or fraudulent purposes</li>
            <li>
              Attempt to disrupt, reverse engineer, or abuse the Service or its
              infrastructure
            </li>
            <li>
              Overload the Service with automated scraping or excessive
              requests beyond normal use
            </li>
            <li>
              Submit content that infringes others&apos; rights or contains
              malware
            </li>
            <li>
              Misrepresent AI-generated drafts as independent professional
              advice without appropriate review
            </li>
          </ul>
          <p className="mt-2">
            We may suspend or terminate access if we reasonably believe these
            Terms have been violated.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Your content
          </h2>
          <p className="mt-2">
            You retain ownership of content you submit (such as briefs and
            business details). You grant us a limited licence to process that
            content solely to provide and improve the Service (for example, to
            generate a draft or operate support features). You represent that
            you have the rights needed to submit that content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Intellectual property
          </h2>
          <p className="mt-2">
            The Service, including its software, branding, design, and
            documentation, is owned by Propogen AI or its licensors. Except for
            the limited right to use the Service under these Terms, no rights
            are granted to you. You may use generated drafts for your own
            business purposes, subject to these Terms and applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. AI and third-party services
          </h2>
          <p className="mt-2">
            Some features use third-party providers (for example payment
            processing, hosting, and AI model providers such as xAI / Grok).
            Your use may also involve Meta platforms if you interact with our
            social features. Those services have their own terms and privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Disclaimers
          </h2>
          <p className="mt-2">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, AND NON-INFRINGEMENT. We do not warrant that drafts will
            be error-free, complete, or suitable for any specific engagement.
            AI outputs can be incorrect or incomplete.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            10. Limitation of liability
          </h2>
          <p className="mt-2">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROPOGEN AI AND ITS
            OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
            PROFITS, DATA, OR BUSINESS OPPORTUNITY, ARISING FROM YOUR USE OF
            THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE
            SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICE IN
            THE TWELVE (12) MONTHS BEFORE THE CLAIM (OR, IF GREATER, THE
            MINIMUM AMOUNT REQUIRED BY LAW).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            11. Indemnity
          </h2>
          <p className="mt-2">
            You agree to defend and indemnify Propogen AI and its operators
            against claims arising from your content, your use of generated
            drafts, or your breach of these Terms, to the extent permitted by
            law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            12. Changes
          </h2>
          <p className="mt-2">
            We may update the Service and these Terms from time to time. The
            &quot;Last updated&quot; date will change when we do. Continued use
            after changes means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            13. Contact
          </h2>
          <p className="mt-2">
            Questions about these Terms: contact us via the business email on
            our Stripe merchant profile or Meta business profile for Propogen
            AI, or through{" "}
            <a
              href="https://propogen-ai.vercel.app"
              className="text-primary underline-offset-2 hover:underline"
            >
              propogen-ai.vercel.app
            </a>
            .
          </p>
          <p className="mt-2">
            See also our{" "}
            <Link
              href="/privacy"
              className="text-primary underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/data-deletion"
              className="text-primary underline-offset-2 hover:underline"
            >
              Data deletion instructions
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
