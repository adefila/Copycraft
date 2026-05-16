# CopyCraft — AI-Powered UX Copywriting Platform

A premium AI copywriting platform that generates conversion-focused website copy, landing pages, app microcopy, and more — powered by Claude Sonnet.

## ✦ Features

- **Full website copy generation** — Hero to footer, all major sections
- **Section-by-section generation** — Hero, Features, FAQ, Pricing, CTAs, Onboarding, Microcopy
- **Rewrite system** — Shorter, more premium, more emotional, startup tone, etc.
- **Multiple variations** — 3–5 headline and CTA options per section
- **Tone matching** — Professional, Startup, Luxury, Playful, Technical, Gen Z, and more
- **Streaming output** — Real-time copy generation with streaming API
- **Copy scoring notes** — Strategic reasoning with every output
- **Export** — Download as .txt

## ✦ Tech Stack

- **Next.js 14** — App Router, Edge Runtime
- **TypeScript** — Fully typed
- **Tailwind CSS** — Custom design system
- **Claude Sonnet API** — Streaming AI generation
- **Vercel** — Deployment

## ✦ Design

Custom design language inspired by editorial luxury aesthetics:
- **Typography**: Cormorant Garamond (display) + DM Sans (body)
- **Color palette**: Warm ink tones with gold accent
- **Theme**: Light/dark CSS variable system

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/copycraft.git
cd copycraft
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com/)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy to Vercel

### Option A: One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/copycraft)

### Option B: Manual deploy

1. Push to GitHub
2. Connect repo to Vercel
3. Add `ANTHROPIC_API_KEY` as an environment variable in Vercel dashboard
4. Deploy

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Design system CSS
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # AI generation API (Edge)
│   ├── workspace/
│   │   └── page.tsx          # Main AI workspace
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard
│   └── pricing/
│       └── page.tsx          # Pricing page
└── ...
```

---

## ⚙️ Configuration

### API Route

The AI generation happens in `src/app/api/generate/route.ts` using Edge Runtime for minimal latency. It supports:

- `mode: 'full'` — Complete website copy
- `mode: 'hero'` — Hero section only
- `mode: 'features'` — Features section
- `mode: 'problem'` — Problem section
- `mode: 'cta'` — CTA variations
- `mode: 'faq'` — FAQ section
- `mode: 'pricing'` — Pricing copy
- `mode: 'onboarding'` — App onboarding flow
- `mode: 'microcopy'` — UI microcopy
- `mode: 'rewrite'` — Rewrite existing copy

### Customization

- **System prompt**: Edit `buildSystemPrompt()` in the API route to adjust AI behavior
- **Sections**: Add new section types in `SECTIONS` array in workspace
- **Tones**: Add tone options to the `TONES` array
- **Design**: CSS variables in `globals.css` control the entire design system

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key |
| `NEXT_PUBLIC_APP_URL` | No | Production URL |

---

## 📄 License

MIT — use freely for commercial and personal projects.

---

Built with ♥ using Claude Sonnet and Next.js
