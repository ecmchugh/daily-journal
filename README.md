# Daily Journal

A mindful journaling app with timed 15-minute writing sessions and rotating daily prompts. Built with Next.js, React, and beautiful WebGL aurora animations.

![Daily Journal](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **15-Minute Timed Sessions** — Each writing session has a countdown timer that starts when you begin typing. The constraint encourages focused, unfiltered writing.
- **100 Rotating Prompts** — A new thoughtful prompt each day, cycling through topics like self-reflection, gratitude, relationships, growth, and more.
- **Automatic Saving** — Your entries are automatically saved to localStorage when the timer ends.
- **Previous Entries** — Browse and read all your past journal entries organized by date.
- **One Entry Per Day** — The app tracks completion so you can only write once per day, encouraging a consistent daily practice.
- **Aurora Background** — A subtle, animated WebGL aurora effect creates a calm, focused writing environment.

## How It Works

1. **Start Writing** — When you first visit the app, you'll see today's prompt. Begin typing to start the 15-minute countdown.
2. **Stay Focused** — The timer continues even if you leave and return. Your session persists across page refreshes.
3. **Auto-Save** — When the timer reaches zero, your entry is automatically saved with the prompt.
4. **Come Back Tomorrow** — After completing a session, the textarea is disabled until the next day.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd daily-journal

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
daily-journal/
├── app/
│   ├── components/
│   │   ├── Aurora.tsx      # WebGL aurora background animation
│   │   └── Aurora.css      # Aurora styling
│   ├── data/
│   │   └── prompts.ts      # 100 daily writing prompts
│   ├── previous/
│   │   ├── page.tsx        # Previous entries list
│   │   └── [date]/
│   │       └── page.tsx    # Individual entry view
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Main journal page
├── scripts/
│   ├── clear-data.js       # Script to generate data clearing tool
│   ├── clear-data-console.js  # Console script for clearing data
│   ├── clear-data.html     # Generated HTML for clearing data
│   └── README.md           # Data clearing instructions
├── public/                 # Static assets
└── package.json
```

## Prompts

The app includes 100 thoughtfully curated prompts organized into categories:

| Category | Prompts | Example |
|----------|---------|---------|
| Daily Reflection | 1-10 | "What emotion did you feel most strongly today, and why?" |
| Growth & Learning | 11-20 | "What mistake did you make today, and what can it teach you?" |
| Emotions & Mental Health | 21-30 | "What do you need more of right now?" |
| Relationships | 31-40 | "Who are you grateful for today, and why?" |
| Habits & Productivity | 41-50 | "Did your actions today align with your goals?" |
| Gratitude & Positivity | 51-60 | "What ordinary moment felt special today?" |
| Self-Reflection | 61-70 | "Did your actions today reflect who you want to be?" |
| Looking Forward | 71-80 | "What intention do you want to carry into tomorrow?" |
| End-of-Day Closure | 81-90 | "What part of today do you want to remember?" |
| Open-Ended | 91-100 | "If you could give yourself one piece of advice tonight, what would it be?" |

Prompts cycle based on days since your first journal entry, so the sequence is consistent for each user.

## Data Storage

All data is stored locally in your browser's localStorage:

| Key | Description |
|-----|-------------|
| `journalEntries` | Object containing all entries keyed by date |
| `completedDate` | Tracks if today's session is complete |
| `sessionStartTime` | Timestamp for session persistence |
| `firstJournalDate` | Used to calculate prompt rotation |

### Clearing Data

To reset all data and start fresh:

```bash
npm run clear-data
```

This opens a simple HTML page where you can clear all localStorage data. See `scripts/README.md` for more options.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI**: [React 19](https://react.dev) with TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Graphics**: [OGL](https://github.com/oframe/ogl) for WebGL aurora effect
- **Fonts**: Geist (via next/font)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clear-data` | Clear all journal data |


---

Built with intention for mindful daily reflection.
