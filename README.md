# React + TypeScript + Vite
# Eureka

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
> **Turn your notes into active learning** — AI-powered flashcards, quizzes, topic maps, and weak-spot tracking.
An in-browser study engine that takes your notes and turns them into something worth remembering.

Currently, two official plugins are available:
Built for the **E2 Hackathon** in 24 hours. Powered by [OpenRouter](https://openrouter.ai) free LLM models.
Upload a PDF, paste some text, or drop in a markdown file — Eureka extracts key topics, builds a deck of 3D flashcards, generates a practice quiz, and tracks where your understanding actually breaks down. No server. No login. No data leaves your browser.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
Built in 24 hours for the **E2 Hackathon 2026**.

---

## React Compiler
##  Features
## What it does

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
| Feature | Description |
| Feature | What you get |
|---|---|
|  **Document Upload** | Upload PDF, TXT, or MD notes |
|  **Topic Extraction** | AI identifies and organizes key topics |
|  **Flashcard Deck** | 3D-flip cards with keyboard navigation |
|  **Practice Quiz** | MCQ quiz with instant feedback & explanations |
|  **Progress Dashboard** | Per-topic scores, streak tracking, weak-spot detection |
|  **Weak Topic Tracking** | Automatic flagging of topics scoring below 60% |
| Document upload | PDF, TXT, or Markdown — including scanned pages via vision OCR |
| Topic extraction | Key concepts organized into a structured hierarchy by the AI |
| 3D flashcards | Spring-animated flip cards with keyboard navigation |
| Practice quiz | Multiple-choice with instant explanations and accuracy dials |
| Progress tracking | Per-topic scores, daily streaks, and automatic weak-spot flags |

## Expanding the Oxlint configuration
---

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:
##  Quick Start
## Quick start

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```bash
# 1. Clone
# Clone the repo
git clone https://github.com/gorlock777/AiLearner.git
cd AiLearner

# 2. Install dependencies
# Install
npm install

# 3. Set up your API key
# Add your API key
cp .env.example .env
# Edit .env and add your OpenRouter API key:
# VITE_OPENROUTER_API_KEY=your-key-here
# Open .env and set VITE_OPENROUTER_API_KEY=your-key-here

# 4. Run locally
# Run locally
npm run dev
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
---
### Getting an OpenRouter API key

##  Getting an OpenRouter API Key
1. Head to [openrouter.ai](https://openrouter.ai) and create a free account
2. Go to **API Keys** → **Create Key**
3. Paste it into your `.env` file

1. Go to [openrouter.ai](https://openrouter.ai)
2. Create a free account
3. Navigate to **API Keys** → **Create Key**
4. Copy the key into your `.env` file
The free tier gives you around 50 requests a day — more than enough for a demo or hackathon session.

**Free tier**: ~50 requests/day (enough for a hackathon demo)

---

##  Tech Stack
## Tech stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: TailwindCSS v4 + custom design system
- **Animations**: Framer Motion
- **State**: Zustand (persisted to localStorage)
- **AI**: OpenRouter API (`openrouter/free` model router)
- **File Parsing**: pdfjs-dist (browser-side, no server needed)
- **Routing**: React Router v7
- **React 19** + **Vite** + **TypeScript**
- **TailwindCSS v4** with a custom dark design system
- **Framer Motion** for 3D card physics and scroll animations
- **Lenis** for smooth momentum scrolling
- **Zustand** — state persisted to `localStorage`, nothing goes to a server
- **OpenRouter API** — free model router with structured JSON schema outputs and vision fallback
- **PDF.js** — client-side PDF parsing and canvas-based OCR for scanned pages
- **React Router v7**

---

##  Project Structure
## Project structure

```
src/
├── lib/
│   ├── openrouter.ts    # AI API client
│   ├── prompts.ts       # AI prompt templates
│   ├── parser.ts        # PDF/TXT file parser
│   └── utils.ts         # Shared utilities
│   ├── openrouter.ts    # API client and model routing
│   ├── prompts.ts       # Extraction and quiz prompt templates
│   ├── parser.ts        # PDF / TXT / MD parser
│   └── utils.ts         # Shared helpers
├── store/
│   └── useAppStore.ts   # Zustand global state
├── components/
│   └── layout/
│       └── AppShell.tsx # Main layout + sidebar
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
    ├── Home.tsx         # Upload + topic extraction
    ├── LandingPage.tsx  # Marketing / hero page
    ├── Home.tsx         # Upload and extraction
    ├── Study.tsx        # Flashcard study mode
    ├── Quiz.tsx         # Practice quiz
    └── Progress.tsx     # Analytics dashboard
    └── Progress.tsx     # Analytics and streaks
```

---

## Architecture
## Architecture notes

- **Zero backend** — everything runs in the browser
- **AI model**: `openrouter/free` auto-selects the best available free model
- **Persistence**: localStorage via Zustand persist middleware
Everything runs in the browser. There is no backend, no database, and no user account system. The AI calls go directly from the client to OpenRouter using your API key stored in the environment.

State is managed by Zustand and persisted to `localStorage` — your flashcard decks and quiz history survive page refreshes without any server round-trips.

---

##  Deploy to Vercel
## Deploy

Connect the repo to [Vercel](https://vercel.com) for automatic deployments on push, or run:

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.
Add `VITE_OPENROUTER_API_KEY` as an environment variable in your Vercel project settings.

> Add `VITE_OPENROUTER_API_KEY` as an **Environment Variable** in your Vercel project settings.

---
##  License

MIT
MIT License
