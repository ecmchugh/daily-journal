"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface JournalEntry {
  text: string;
  prompt?: string;
}

export default function EntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.date) {
      try {
        const decodedDate = decodeURIComponent(params.date as string);
        setDate(decodedDate);

        // Fetch entry from localStorage
        const storedEntries = JSON.parse(
          localStorage.getItem("journalEntries") || "{}"
        );

        const entryData = storedEntries[decodedDate];
        if (entryData) {
          // Handle both old (string) and new (object) formats
          if (typeof entryData === "string") {
            setEntry({ text: entryData });
          } else {
            setEntry(entryData);
          }
        }
      } catch (error) {
        console.error("Error loading journal entry from localStorage:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [params.date]);

  if (loading) {
    return (
      <main>
        <nav className="nav">
          <div className="nav-left">
            <Link href="/previous" className="nav-link">
              ← Back to Previous Writings
            </Link>
          </div>
          <div className="nav-right">
            <Link href="/" className="nav-link">
              Daily
            </Link>
          </div>
        </nav>
        <p>Loading...</p>
      </main>
    );
  }

  if (!entry) {
    return (
      <main>
        <nav className="nav">
          <div className="nav-left">
            <Link href="/previous" className="nav-link">
              ← Back to Previous Writings
            </Link>
          </div>
          <div className="nav-right">
            <Link href="/" className="nav-link">
              Daily
            </Link>
          </div>
        </nav>
        <header>
          <h1>Entry Not Found</h1>
          <p>No entry found for {date}</p>
        </header>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/previous" className="nav-link">
            Go back to Previous Writings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <nav className="nav">
        <div className="nav-left">
          <Link href="/previous" className="nav-link">
            ← Back to Previous Writings
          </Link>
        </div>
        <div className="nav-right">
          <Link href="/" className="nav-link">
            Daily
          </Link>
        </div>
      </nav>
      <header>
        <h1>{date}</h1>
      </header>
      <div className="entry-content">
        {entry.prompt && (
          <p className="entry-prompt">{entry.prompt}</p>
        )}
        <p>{entry.text}</p>
      </div>
    </main>
  );
}
