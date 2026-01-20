"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Aurora from "./components/Aurora";
import { prompts } from "./data/prompts";

export default function Home() {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(15*60);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const SESSION_LENGTH = 15 * 60 * 1000;

  // Get today's prompt based on days since first use
  useEffect(() => {
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
      const promptIndex = diffDays % prompts.length;
      
      setCurrentPrompt(prompts[promptIndex]);
    } catch (error) {
      console.error("Error accessing localStorage for prompt:", error);
      // Set a default prompt if localStorage fails
      setCurrentPrompt(prompts[0]);
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
    } catch (error) {
      console.error("Error accessing localStorage for session:", error);
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
        } catch (error) {
          console.error("Error updating localStorage when timer ends:", error);
        }

        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [hasStarted]);

  // Save entry to localStorage when timer ends
  useEffect(() => {
    if (timeLeft === 0 && hasStarted && text.trim()) {
      try {
        const today = new Date().toDateString();
        const existingEntries = JSON.parse(
          localStorage.getItem("journalEntries") || "{}"
        );
        
        // Save as object with text and prompt
        existingEntries[today] = {
          text: text,
          prompt: currentPrompt
        };
        localStorage.setItem("journalEntries", JSON.stringify(existingEntries));
      } catch (error) {
        console.error("Error saving journal entry to localStorage:", error);
      }
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
          <Link href="/previous" className="nav-link">
            Previous Writings
          </Link>
        </div>
      </nav>
      <header>
        <h1>Daily Journal</h1>
        <p className="prompt-text">{currentPrompt}</p>
      </header>
      
      <div className="textarea-container">
        <div className="textarea-header">
          <span className="time-left">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <div className="textarea-card">
          <textarea 
            placeholder="Start writing here..."
            value={text}
            disabled = {timeLeft == 0}
            onChange = {(e) => {
              setText(e.target.value);
              if(!hasStarted) {
                setHasStarted(true);
                try {
                  localStorage.setItem("sessionStartTime", Date.now().toString());
                } catch (error) {
                  console.error("Error saving session start time:", error);
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
