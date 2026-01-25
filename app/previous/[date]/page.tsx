"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getOrCreateUserId } from "@/lib/userId";
import { decryptText } from "@/lib/encryption";

interface JournalEntry {
  text: string;
  prompt?: string;
}

export default function EntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntry = async () => {
      if (!params.date) {
        setLoading(false);
        return;
      }
      
      try {
        const decodedDate = decodeURIComponent(params.date as string);
        setDate(decodedDate);
        
        const userId = getOrCreateUserId();
        
        if (!userId) {
          setLoading(false);
          return;
        }
        
        const { data, error: supabaseError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .eq('date', decodedDate)
          .single();
        
        if (supabaseError) {
          // PGRST116 means no rows returned - not a real error
          if (supabaseError.code === 'PGRST116') {
            setEntry(null);
          } else {
            throw supabaseError;
          }
        } else if (data) {
          let decryptedText = data.text;
          try {
            decryptedText = await decryptText(data.text, userId);
          } catch {
            // Entry may not be encrypted, use original text
          }
          setEntry({
            text: decryptedText,
            prompt: data.prompt
          });
        }
      } catch (err) {
        console.error("Error loading journal entry from Supabase:", err);
        setError("Failed to load entry. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadEntry();
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

  if (error) {
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
        <div className="error-message" style={{ 
          color: '#ff6b6b', 
          textAlign: 'center', 
          padding: '20px',
          marginTop: '32px',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/previous" className="nav-link">
            Go back to Previous Writings
          </Link>
        </div>
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
