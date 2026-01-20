"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PreviousPage() {
  const [entries, setEntries] = useState<[string, string][]>([]);

  useEffect(() => {
    const storedEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "{}"
    );

    // Convert object into array so we can render it
    const entryArray = Object.entries(storedEntries);
    setEntries(entryArray);
  }, []);

  useEffect(() => {
    const existing = localStorage.getItem("journalEntries");

     if (!existing) {
        const demoEntries = {
            "Mon Dec 16 2025":
                "Today I started building my journal app. It felt confusing at first, but things are starting to click.",
            "Tue Dec 17 2025":
                "I worked on the previous writings page today. React state vs localStorage finally made sense.",
            "Wed Dec 18 2025":
                "This is a longer entry to test how previews are displayed in the UI. It should be long enough to wrap across multiple lines and show truncation correctly."
    };

    localStorage.setItem(
      "journalEntries",
      JSON.stringify(demoEntries)
    );
  }
}, []);


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
        {entries.map(([date, text]) => (
          <Link
            key={date}
            href={`/previous/${encodeURIComponent(date)}`}
            className="entry-card"
          >
            <p className="entry-preview">
              {text.slice(0, 100)}...
            </p>
            <span className="entry-date">{date}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
