"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getOrCreateUserId } from "@/lib/userId";

interface JournalEntry {
  text: string;
  prompt?: string;
}

export default function PreviousPage() {
  const [entries, setEntries] = useState<[string, JournalEntry][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const userId = getOrCreateUserId();
        
        if (!userId) {
          setEntries([]);
          setLoading(false);
          return;
        }
        
        const { data, error: supabaseError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
        
        if (supabaseError) {
          throw supabaseError;
        }
        
        // Convert Supabase array to format: [date, { text, prompt }]
        const entryArray: [string, JournalEntry][] = (data || []).map(entry => [
          entry.date,
          { text: entry.text, prompt: entry.prompt }
        ]);
        
        setEntries(entryArray);
      } catch (err) {
        console.error("Error loading journal entries from Supabase:", err);
        setError("Failed to load entries. Please try again.");
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadEntries();
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
          <Link href="/about" className="nav-link" style={{ marginRight: '12px' }}>
            About
          </Link>
          <Link href="/" className="nav-link">
            Home
          </Link>
        </div>
      </nav>
      <h1>Previous Writings</h1>

      {error && (
        <div className="error-message" style={{ 
          color: '#ff6b6b', 
          textAlign: 'center', 
          padding: '10px',
          marginBottom: '16px',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      <div className="entries-grid">
        {loading ? (
          <p style={{ width: "100%", textAlign: "center", opacity: 0.7 }}>
            Loading entries...
          </p>
        ) : entries.length === 0 ? (
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
                {entry.text.slice(0, 100)}...
              </p>
              <span className="entry-date">{date}</span>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
