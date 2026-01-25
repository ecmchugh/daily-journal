"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Aurora from "./components/Aurora";
import { supabase } from "@/lib/supabase";
import { getOrCreateUserId } from "@/lib/userId";
import { encryptText } from "@/lib/encryption";

export default function Home() {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(15*60);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const SESSION_LENGTH = 15 * 60 * 1000;

  // Get today's prompt from API based on days since first use
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        let firstDate = localStorage.getItem("firstJournalDate");
        
        if (!firstDate) {
          firstDate = new Date().toDateString();
          localStorage.setItem("firstJournalDate", firstDate);
        }
        
        const start = new Date(firstDate);
        const today = new Date();
        const diffTime = today.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Call Prompts API
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ daysSinceStart: diffDays })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompt');
        }
        
        const data = await response.json();
        setCurrentPrompt(data.prompt);
      } catch (err) {
        console.error("Error fetching prompt from API:", err);
        setError("Failed to load today's prompt. Please refresh the page.");
        // Fallback prompt
        setCurrentPrompt("What is one good thing that happened today?");
      }
    };
    
    fetchPrompt();
  }, []);

  // Restore draft text from localStorage on mount
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const draftKey = `draft_${today}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        setText(savedDraft);
      }
    } catch (err) {
      console.error("Error loading draft from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const completedDate = localStorage.getItem("completedDate");
      const today = new Date().toDateString();

      if (completedDate == today){
        setTimeLeft(0);
        setHasStarted(true);
        return;
      }
      
      const savedStart = localStorage.getItem("sessionStartTime");
      if(savedStart){
        const startTime = Number(savedStart);
        const elapsed = Date.now() - startTime;
        const remaining = SESSION_LENGTH - elapsed;

        if (remaining <= 0){
          localStorage.setItem("completedDate", today);
          setTimeLeft(0);
          setHasStarted(true);
        }else{
          setTimeLeft(Math.floor(remaining / 1000));
          setHasStarted(true);
        }
      }
    } catch (err) {
      console.error("Error accessing localStorage for session:", err);
    }
  }, []);

  useEffect(() => {
  if (!hasStarted || timeLeft ===0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);

        try {
          const today = new Date().toDateString();
          localStorage.setItem("completedDate", today);
          localStorage.removeItem("sessionStartTime");
        } catch (err) {
          console.error("Error updating localStorage when timer ends:", err);
        }

        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [hasStarted]);

  // Save entry to Supabase when timer ends
  useEffect(() => {
    if (timeLeft === 0 && hasStarted && text.trim() && !isSaving) {
      const saveEntry = async () => {
        setIsSaving(true);
        setError(null);
        
        try {
          const today = new Date().toDateString();
          const userId = getOrCreateUserId();
          
          if (!userId) {
            throw new Error('Failed to get user ID');
          }
          
          const encryptedText = await encryptText(text, userId);
          
          const { error: supabaseError } = await supabase
            .from('journal_entries')
            .upsert({
              user_id: userId,
              date: today,
              text: encryptedText,
              prompt: currentPrompt,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,date'
            });
          
          if (supabaseError) {
            throw supabaseError;
          }
          
          console.log('Entry saved successfully!');
          
          // Clear draft from localStorage after successful save
          try {
            const draftKey = `draft_${today}`;
            localStorage.removeItem(draftKey);
          } catch (err) {
            console.error("Error clearing draft:", err);
          }
          
          // Hide "Saving..." message after 2 seconds
          setTimeout(() => {
            setIsSaving(false);
          }, 2000);
        } catch (err) {
          console.error("Error saving journal entry to Supabase:", err);
          setError("Failed to save your entry. Please try again.");
          setIsSaving(false);
        }
      };
      
      saveEntry();
    }
  }, [timeLeft, hasStarted, text, currentPrompt]);

  return (
    <main>
      <Aurora
        colorStops={["#2e2d2d", "#ffffff", "#2e2d2d"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
      <div className="content-wrapper">
        <nav className = "nav">
        <div className = "nav-left">
          <span className = "nav-title">
            Daily
          </span>
        </div>
        <div className = "nav-right">
          <Link href="/about" className="nav-link" style={{ marginRight: '12px' }}>
            About
          </Link>
          <Link href="/previous" className="nav-link">
            Previous Writings
          </Link>
        </div>
      </nav>
      <header>
        <h1>Daily Journal</h1>
        <p className="prompt-text">{currentPrompt}</p>
      </header>
      
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
      
      <div className="textarea-container">
        <div className="textarea-header">
          <span className="time-left">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
          {isSaving && (
            <span style={{ marginLeft: '10px', opacity: 0.7 }}>Saving...</span>
          )}
        </div>
        <div className="textarea-card">
          <textarea 
            placeholder="Start writing here..."
            value={text}
            disabled = {timeLeft == 0}
            onChange = {(e) => {
              const newText = e.target.value;
              setText(newText);
              
              // Save to localStorage immediately on every keystroke
              try {
                const today = new Date().toDateString();
                const draftKey = `draft_${today}`;
                localStorage.setItem(draftKey, newText);
              } catch (err) {
                console.error("Error saving draft:", err);
              }
              
              if(!hasStarted) {
                setHasStarted(true);
                try {
                  localStorage.setItem("sessionStartTime", Date.now().toString());
                } catch (err) {
                  console.error("Error saving session start time:", err);
                }
              }
            }}
          />
        </div>
      </div>
      </div>
    </main>
  );
}
