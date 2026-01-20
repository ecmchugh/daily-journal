"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface JournalEntry {
  text: string;
  prompt?: string;
}

type EntryValue = string | JournalEntry;

export default function PreviousPage() {
  const [entries, setEntries] = useState<[string, EntryValue][]>([]);

  useEffect(() => {
    try {
      const storedEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "{}"
      );

      // Convert object into array so we can render it
      const entryArray = Object.entries(storedEntries) as [string, EntryValue][];
      setEntries(entryArray);
    } catch (error) {
      console.error("Error loading journal entries from localStorage:", error);
      setEntries([]);
    }
  }, []);

  // Helper to get text from either old string or new object format
  const getEntryText = (entry: EntryValue): string => {
    if (typeof entry === "string") {
      return entry;
    }
    return entry.text;
  };

  return (
    <main>
      <nav className="nav">
        <div className="nav-left">
          <span className="nav-title">
            Daily
          </span>
        </div>
        <div className="nav-right">
          <Link href="/" className="nav-link">
            Home
          </Link>
        </div>
      </nav>
      <h1>Previous Writings</h1>

      <div className="entries-grid">
        {entries.length === 0 ? (
          <p style={{ width: "100%", textAlign: "center", opacity: 0.7 }}>
            No entries yet. Start writing to see your journal entries here.
          </p>
        ) : (
          entries.map(([date, entry]) => (
            <Link
              key={date}
              href={`/previous/${encodeURIComponent(date)}`}
              className="entry-card"
            >
              <p className="entry-preview">
                {getEntryText(entry).slice(0, 100)}...
              </p>
              <span className="entry-date">{date}</span>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
