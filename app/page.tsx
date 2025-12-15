"use client";

import { useState, useEffect } from "react";


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

  return (
    <main>
      <nav>
        <span> Daily</span>
      </nav>
      <header>
        <h1>Daily Journal</h1>
        <p>15 Minutes Each Day.</p>
      </header>
      <p>
        Time left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>
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
    </main>
  );
}