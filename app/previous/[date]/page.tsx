"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.date) {
      const decodedDate = decodeURIComponent(params.date as string);
      setDate(decodedDate);

      // Fetch entry from localStorage
      const storedEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "{}"
      );

      const entryText = storedEntries[decodedDate];
      if (entryText) {
        setEntry(entryText);
      }
      setLoading(false);
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
        <p>{entry}</p>
      </div>
    </main>
  );
}
