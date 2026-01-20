# Data Clearing Scripts

Scripts to help you clear all Daily Journal localStorage data.

## Option 1: Terminal Script (Recommended)

Run from the project root:

```bash
npm run clear-data
```

or

```bash
node scripts/clear-data.js
```

This will:
- Create a `clear-data.html` file
- Automatically open it in your browser (on macOS/Windows)
- You can then click the button to clear all data

## Option 2: Browser Console

1. Open your Daily Journal app in the browser
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to the Console tab
4. Copy and paste the contents of `scripts/clear-data-console.js`
5. Press Enter

## Option 3: Manual HTML File

1. Run `npm run clear-data` to generate `scripts/clear-data.html`
2. Open `scripts/clear-data.html` in your browser
3. Click "Clear All Data"

## What Gets Cleared

- `journalEntries` - All your journal entries
- `completedDate` - Completion tracking
- `sessionStartTime` - Current session timer
- `firstJournalDate` - Prompt cycle reset (will start from prompt 1 again)

## Note

This only clears data stored in localStorage. If you're using the app on multiple browsers/devices, you'll need to clear data in each one separately.
