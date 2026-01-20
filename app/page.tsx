"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Aurora from "./components/Aurora";


export default function Home() {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(.3*60);
  const [hasStarted, setHasStarted] = useState(false); 
  const SESSION_LENGTH = .3 * 60 * 1000;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
  if (!hasStarted || timeLeft ===0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);

        const today = new Date().toDateString();
        localStorage.setItem("completedDate", today);
        localStorage.removeItem("sessionStartTime");

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
      const today = new Date().toDateString();
      const existingEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "{}"
      );
      
      existingEntries[today] = text;
      localStorage.setItem("journalEntries", JSON.stringify(existingEntries));
    }
  }, [timeLeft, hasStarted, text]);

  const handleWriteAgain = () => {
    localStorage.removeItem("completedDate");
    localStorage.removeItem("sessionStartTime");
    
    setTimeLeft(.3*60);
    setHasStarted(false);
    setText("");
  };

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
        <p>15 Minutes Each Day.</p>
      </header>
      <p>
        Time left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>
      {timeLeft === 0 && (
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button 
            onClick={handleWriteAgain}
            className="write-again-btn"
          >
            Write Again (Testing)
          </button>
        </div>
      )}
      <div className="textarea-card">
        <textarea 
          placeholder="Start writing here..."
          value={text}
          disabled = {timeLeft == 0}
          onChange = {(e) => {
            setText(e.target.value);
            if(!hasStarted) {
              setHasStarted(true);
              localStorage.setItem("sessionStartTime", Date.now().toString());
            }
          }}
        />
      </div>
      </div>
    </main>
  );
}