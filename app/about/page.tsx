"use client";

import Link from "next/link";

export default function AboutPage() {
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
      
      <div className="about-content">
        <h1>About Daily Journal</h1>
        
        <p>
          Daily Journal is a mindful journaling app designed to help you journal, without having to subscribe to a journal service. 
          Each day you'll be given a new prompt to help guide your journaling, and you will have 15 minutes to write whatever comes to mind. Don't hold back.
        </p>
        
        <p>
          When the timer starts, begin writing. When it ends, your entry is automatically saved. No need to worry about accidentally refreshing, if that happens your
          writing will be saved. 
        </p>
        
        <p>
          Your writing is private and saved securely. You can revisit your previous entries to see how your thoughts have 
          grown over time. 
        </p>
        
        <p>
          This was built because I wanted to journal, but I never took the time to take out a notebook and start writing. Also,
          I sometimes didn't know what to write about, and I also didn't want to subscribe to a journaling service. 
        </p>

        <p>
          Created by Ethan McHugh
        </p>
      </div>
    </main>
  );
}
