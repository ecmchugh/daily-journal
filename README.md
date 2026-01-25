# Daily Journal

A mindful journaling app with timed 15-minute writing sessions and rotating daily prompts. Built with Next.js, React, Supabase, and beautiful WebGL aurora animations.

![Daily Journal](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-green)

## Features

- **15-Minute Timed Sessions** — Each writing session has a countdown timer that starts when you begin typing. The constraint encourages focused, unfiltered writing.
- **100 Rotating Prompts** — A new thoughtful prompt each day, delivered via REST API, cycling through topics like self-reflection, gratitude, relationships, growth, and more.
- **Automatic Saving** — Your entries are automatically saved to Supabase when the timer ends. Your writing persists securely in the cloud with RLS. 
- **Auto-Save on Refresh** — Never lose your work! Your writing is automatically saved as you type, so if you accidentally refresh the page, your text will be restored.
- **Previous Entries** — Browse and read all your past journal entries organized by date, loaded from Supabase.
- **One Entry Per Day** — The app tracks completion so you can only write once per day, encouraging a consistent daily practice.
- **About Page** — Learn more about the app and its purpose.

## How It Works

1. **Start Writing** — When you first visit the app, you'll see today's prompt (fetched from the API based on days since your first use). Begin typing to start the 15-minute countdown.
2. **Auto-Save as You Type** — Every keystroke is automatically saved to your browser's localStorage, so refreshing won't lose your work.
3. **Stay Focused** — The timer continues even if you leave and return. Your session persists across page refreshes.
4. **Auto-Save to Cloud** — When the timer reaches zero, your entry is automatically saved to Supabase with the prompt.
5. **Come Back Tomorrow** — After completing a session, the textarea is disabled until the next day.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A Supabase account (for production) or use environment variables for local development

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd daily-journal

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

For production deployment (e.g., Vercel), add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

Get these from your Supabase Dashboard → Project Settings → API.

## Project Structure

```
daily-journal/
├── app/
│   ├── about/
│   │   └── page.tsx        # About page
│   ├── api/
│   │   └── prompts/
│   │       └── route.ts    # REST API endpoint for prompts
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
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   └── userId.ts           # User ID generation utility
├── scripts/
│   ├── clear-data.js       # Script to generate data clearing tool
│   ├── clear-data-console.js  # Console script for clearing data
│   ├── clear-data.html     # Generated HTML for clearing data
│   └── README.md           # Data clearing instructions
├── public/                 # Static assets
└── package.json
```

## Prompts

Prompts cycle based on days since your first journal entry, so the sequence is consistent for each user. The prompt is fetched via a REST API endpoint (`/api/prompts`) that calculates which prompt to show based on your start date.

## Data Storage

### Supabase (Production)

Journal entries are stored securely in Supabase:

- **Table**: `journal_entries`
- **Fields**: `user_id`, `date`, `text`, `prompt`, `updated_at`
- **User Identification**: Anonymous user IDs are generated and stored in localStorage
- **Privacy**: Each user's entries are isolated by their unique user ID

### LocalStorage (Draft & Session Management)

The app uses localStorage for:

| Key | Description |
|-----|-------------|
| `draft_<date>` | Auto-saved draft text for the current day (saves on every keystroke) |
| `completedDate` | Tracks if today's session is complete |
| `sessionStartTime` | Timestamp for session persistence across refreshes |
| `firstJournalDate` | Used to calculate prompt rotation |
| `journalUserId` | Anonymous user ID for Supabase entries |

### Auto-Save Feature

- **Draft Saving**: Every keystroke automatically saves to localStorage with key `draft_<today's date>`
- **Draft Restoration**: On page load, the app checks for and restores any saved draft
- **Cloud Saving**: When the timer ends, entries are saved to Supabase and the draft is cleared

## API Routes

### GET/POST `/api/prompts`

Returns the prompt for a given day based on days since first use.

**POST Request Body:**
```json
{
  "daysSinceStart": 5
}
```

**Response:**
```json
{
  "prompt": "What surprised you today?",
  "index": 5,
  "totalPrompts": 100
}
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI**: [React 19](https://react.dev) with TypeScript
- **Database**: [Supabase](https://supabase.com) for cloud storage
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Fonts**: Google Sans

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clear-data` | Clear all journal data |

## Database Schema

### Supabase Table: `journal_entries`

```sql
CREATE TABLE journal_entries (
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  text TEXT NOT NULL,
  prompt TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);
```

## Deployment

The app is designed to be deployed on [Vercel](https://vercel.com) or similar platforms. Make sure to:

1. Set environment variables in your deployment platform
2. Ensure Supabase project is configured
3. Verify the database table exists with the correct schema

---

Built with intention for mindful daily reflection.
