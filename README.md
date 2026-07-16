# Propogen AI

**AI-Powered Proposal & Document Generator**

An intelligent Next.js application that uses AI to generate professional business proposals, documents, reports, and more — saving you hours of writing time.

---

## ✨ Features

- **AI-Powered Generation** — Create high-quality proposals and documents instantly
- **Professional Templates** — Multiple industry-standard formats
- **Customizable Output** — Tailor tone, length, and style to your needs
- **Modern UI** — Built with Next.js, TypeScript, and Tailwind CSS
- **Fast & Responsive** — Optimized for both desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/haywardjon1972-create/propogen-ai.git
cd propogen-ai

# Install dependencies
npm install

# Set up environment variables (optional — demo templates work without AI)
cp .env.example .env.local
```

Add your xAI key to `.env.local` for live AI generation:

```env
XAI_API_KEY=your_key_here
```

Get a key at [https://console.x.ai](https://console.x.ai).

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## 🌐 Live site

After deploying to Vercel: [https://propogen-ai.vercel.app](https://propogen-ai.vercel.app)

Set `XAI_API_KEY` in the Vercel project **Environment Variables** for live AI generation.

## 📄 License

Private project.
