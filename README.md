# React + TypeScript + Vite
# AiLearner 🧠⚡

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
> **Turn your notes into active learning** — AI-powered flashcards, quizzes, topic maps, and weak-spot tracking.

Currently, two official plugins are available:
Built for the **E2 Hackathon** in 24 hours. Powered by [OpenRouter](https://openrouter.ai) free LLM models.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
---

## React Compiler
## ✨ Features

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
| Feature | Description |
|---|---|
| 📄 **Document Upload** | Upload PDF, TXT, or MD notes |
| 🗺️ **Topic Extraction** | AI identifies and organizes key topics |
| 🃏 **Flashcard Deck** | 3D-flip cards with keyboard navigation |
| 🧪 **Practice Quiz** | MCQ quiz with instant feedback & explanations |
| 📊 **Progress Dashboard** | Per-topic scores, streak tracking, weak-spot detection |
| 🔥 **Weak Topic Tracking** | Automatic flagging of topics scoring below 60% |

## Expanding the Oxlint configuration
---

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:
## 🚀 Quick Start

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
git clone https://github.com/gorlock777/AiLearner.git
cd AiLearner

# 2. Install dependencies
npm install

# 3. Set up your API key
cp .env.example .env
# Edit .env and add your OpenRouter API key:
# VITE_OPENROUTER_API_KEY=your-key-here

# 4. Run locally
npm run dev
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
---

## 🔑 Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Create a free account
3. Navigate to **API Keys** → **Create Key**
4. Copy the key into your `.env` file

**Free tier**: ~50 requests/day (enough for a hackathon demo)

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: TailwindCSS v4 + custom design system
- **Animations**: Framer Motion
- **State**: Zustand (persisted to localStorage)
- **AI**: OpenRouter API (`openrouter/free` model router)
- **File Parsing**: pdfjs-dist (browser-side, no server needed)
- **Routing**: React Router v7

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── openrouter.ts    # AI API client
│   ├── prompts.ts       # AI prompt templates
│   ├── parser.ts        # PDF/TXT file parser
│   └── utils.ts         # Shared utilities
├── store/
│   └── useAppStore.ts   # Zustand global state
├── components/
│   └── layout/
│       └── AppShell.tsx # Main layout + sidebar
└── pages/
    ├── Home.tsx         # Upload + topic extraction
    ├── Study.tsx        # Flashcard study mode
    ├── Quiz.tsx         # Practice quiz
    └── Progress.tsx     # Analytics dashboard
```

---

## 🏗️ Architecture

- **Zero backend** — everything runs in the browser
- **AI model**: `openrouter/free` auto-selects the best available free model
- **Persistence**: localStorage via Zustand persist middleware

---

## 🚢 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

> Add `VITE_OPENROUTER_API_KEY` as an **Environment Variable** in your Vercel project settings.

---

## 👥 Team

Built by **gorlock777** @ E2 Hackathon 2026

---

## 📄 License

MIT
