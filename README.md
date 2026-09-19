# Eureka

An in-browser study engine that takes your notes and turns them into something worth remembering.

Upload a PDF, paste some text, or drop in a markdown file — Eureka extracts key topics, builds a deck of 3D flashcards, generates a practice quiz, and tracks where your understanding actually breaks down. No server. No login. No data leaves your browser.

Built in 24 hours for the **E2 Hackathon 2026**.

---

## What it does

| Feature | What you get |
|---|---|
| Document upload | PDF, TXT, or Markdown — including scanned pages via vision OCR |
| Topic extraction | Key concepts organized into a structured hierarchy by the AI |
| 3D flashcards | Spring-animated flip cards with keyboard navigation |
| Practice quiz | Multiple-choice with instant explanations and accuracy dials |
| Progress tracking | Per-topic scores, daily streaks, and automatic weak-spot flags |

---

## Quick start

```bash
# Clone the repo
git clone https://github.com/gorlock777/AiLearner.git
cd AiLearner

# Install
npm install

# Add your API key
cp .env.example .env
# Open .env and set VITE_OPENROUTER_API_KEY=your-key-here

# Run locally
npm run dev
```

### Getting an OpenRouter API key

1. Head to [openrouter.ai](https://openrouter.ai) and create a free account
2. Go to **API Keys** → **Create Key**
3. Paste it into your `.env` file

The free tier gives you around 50 requests a day — more than enough for a demo or hackathon session.

---

## Tech stack

- **React 19** + **Vite** + **TypeScript**
- **TailwindCSS v4** with a custom dark design system
- **Framer Motion** for 3D card physics and scroll animations
- **Lenis** for smooth momentum scrolling
- **Zustand** — state persisted to `localStorage`, nothing goes to a server
- **OpenRouter API** — free model router with structured JSON schema outputs and vision fallback
- **PDF.js** — client-side PDF parsing and canvas-based OCR for scanned pages
- **React Router v7**

---

## Project structure

```
src/
├── lib/
│   ├── openrouter.ts    # API client and model routing
│   ├── prompts.ts       # Extraction and quiz prompt templates
│   ├── parser.ts        # PDF / TXT / MD parser
│   └── utils.ts         # Shared helpers
├── store/
│   └── useAppStore.ts   # Zustand global state
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # Sidebar layout
│   │   └── SmoothScroll.tsx   # Lenis provider
│   └── ui/
│       ├── floating-navbar.tsx     # Dynamic Island navigation
│       ├── cosmic-aurora-hero.tsx  # Landing hero section
│       ├── spotlight-cards.tsx     # Feature card grid
│       ├── live-preview-bento.tsx  # Interactive demo widget
│       └── card-flip.tsx           # 3D spring flashcard
└── pages/
    ├── LandingPage.tsx  # Marketing / hero page
    ├── Home.tsx         # Upload and extraction
    ├── Study.tsx        # Flashcard study mode
    ├── Quiz.tsx         # Practice quiz
    └── Progress.tsx     # Analytics and streaks
```

---

## Architecture notes

Everything runs in the browser. There is no backend, no database, and no user account system. The AI calls go directly from the client to OpenRouter using your API key stored in the environment.

State is managed by Zustand and persisted to `localStorage` — your flashcard decks and quiz history survive page refreshes without any server round-trips.

---

## Deploy

Connect the repo to [Vercel](https://vercel.com) for automatic deployments on push, or run:

```bash
npm i -g vercel
vercel --prod
```

Add `VITE_OPENROUTER_API_KEY` as an environment variable in your Vercel project settings.

---

## Team

Built by **gorlock777** — E2 Hackathon 2026

---

MIT License
