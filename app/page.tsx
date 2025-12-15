"use client";

import { useState, useEffect } from "react";


export default function Home() {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(10*60);
  const [hasStarted, setHasStarted] = useState(false); 

  useEffect(() => {
  if (!hasStarted) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
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
          }
        }}
      />
    </main>
  );
}