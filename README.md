# Propogen AI

**AI-Powered Proposal & Document Generator**

Generate professional business proposals, documents, and reports with free templates or **Pro** live AI (SpaceXAI) after Stripe checkout.

---

## ✨ Features

- **Free demo generator** — Instant professional template drafts
- **Pro AI generation** — Live AI after Stripe payment unlock
- **Stripe Checkout** — Secure $19 one-time Pro upgrade (or your own Price ID)
- **Professional templates** — Business, sales, project, RFP, and reports
- **Copy & download** — Export drafts instantly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/haywardjon1972-create/propogen-ai.git
cd propogen-ai
npm install
cp .env.example .env.local
```

### Environment variables

Edit `.env.local` (never commit this file):

```env
XAI_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `XAI_API_KEY` | For live AI | SpaceXAI / xAI key from [console.x.ai](https://console.x.ai) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Publishable key (reserved for future Elements UI) |
| `STRIPE_PRICE_ID` | Optional | Use a Stripe Price for subscription mode; if empty, $19 one-time payment |
| `STRIPE_WEBHOOK_SECRET` | Optional | Webhook signature verification |
| `NEXT_PUBLIC_APP_URL` | Production | Your public URL, e.g. `https://propogen-ai-y8qb.vercel.app` |
| `PRO_ACCESS_BYPASS` | Local only | Set `true` to skip Stripe and always treat as Pro |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test Stripe checkout

1. Use **test** keys (`sk_test_…` / `pk_test_…`)
2. Click **Upgrade with Stripe** on the Pricing section
3. Card: `4242 4242 4242 4242`, any future expiry, any CVC
4. After success you land on `/success` and Pro unlocks (httpOnly cookie)

Confirm payments in [Stripe Dashboard → Payments](https://dashboard.stripe.com/test/payments) (test mode).

### Build

```bash
npm run build
npm start
```

## 🌐 Vercel deploy

1. Push to GitHub (auto-deploys if linked)
2. Project → **Settings → Environment Variables** — add:

   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `XAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` = `https://propogen-ai-y8qb.vercel.app` (your real domain)

3. **Redeploy**
4. (Optional) Stripe → **Developers → Webhooks** → endpoint  
   `https://YOUR_DOMAIN/api/stripe/webhook`  
   Events: `checkout.session.completed`  
   Set `STRIPE_WEBHOOK_SECRET`

### How Pro access works

1. User pays via Stripe Checkout  
2. Redirect to `/success?session_id=…`  
3. Server verifies the session with Stripe and sets a signed **Pro** cookie  
4. `/api/generate` uses live AI only when that cookie is valid  

Free users still get demo templates without paying.

## 📄 License

Private project.
