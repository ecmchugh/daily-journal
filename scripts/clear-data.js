#!/usr/bin/env node

/**
 * Script to clear all localStorage data for the Daily Journal app
 * 
 * Usage:
 *   node scripts/clear-data.js
 * 
 * This will open your browser and clear all journal data from localStorage
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create a simple HTML file that clears localStorage
const clearDataHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Clear Journal Data</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    button {
      background: #dc2626;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      margin: 10px;
    }
    button:hover {
      background: #b91c1c;
    }
    .success {
      color: #059669;
      margin-top: 20px;
    }
    .info {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <h1>Clear Daily Journal Data</h1>
  <div class="info">
    <p><strong>This will delete:</strong></p>
    <ul>
      <li>All journal entries</li>
      <li>Session data</li>
      <li>Completion dates</li>
      <li>First journal date (will reset prompt cycle)</li>
    </ul>
  </div>
  <button onclick="clearData()">Clear All Data</button>
  <div id="result"></div>

  <script>
    function clearData() {
      try {
        // Clear all journal-related localStorage keys
        const keys = [
          'journalEntries',
          'completedDate',
          'sessionStartTime',
          'firstJournalDate'
        ];
        
        let cleared = [];
        keys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            cleared.push(key);
          }
        });
        
        const resultDiv = document.getElementById('result');
        if (cleared.length > 0) {
          resultDiv.innerHTML = '<div class="success"><strong>✓ Success!</strong><br>Cleared: ' + cleared.join(', ') + '</div>';
        } else {
          resultDiv.innerHTML = '<div class="success">No data found to clear.</div>';
        }
        
        // Show current localStorage state
        console.log('Remaining localStorage keys:', Object.keys(localStorage));
      } catch (error) {
        document.getElementById('result').innerHTML = '<div style="color: #dc2626;">Error: ' + error.message + '</div>';
      }
    }
    
    // Show current data on load
    window.onload = function() {
      const keys = ['journalEntries', 'completedDate', 'sessionStartTime', 'firstJournalDate'];
      const found = keys.filter(key => localStorage.getItem(key));
      if (found.length > 0) {
        console.log('Found data:', found);
      }
    };
  </script>
</body>
</html>
`;

// Write the HTML file
const htmlPath = path.join(__dirname, 'clear-data.html');
fs.writeFileSync(htmlPath, clearDataHTML);

console.log('✓ Created clear-data.html');
console.log('\nTo clear your data:');
console.log('1. Open scripts/clear-data.html in your browser');
console.log('2. Click the "Clear All Data" button');
console.log('\nOr run: open scripts/clear-data.html');

// Try to open it automatically (macOS)
if (process.platform === 'darwin') {
  exec(`open ${htmlPath}`, (error) => {
    if (error) {
      console.log('\nCould not open automatically. Please open scripts/clear-data.html manually.');
    }
  });
} else if (process.platform === 'win32') {
  exec(`start ${htmlPath}`, (error) => {
    if (error) {
      console.log('\nCould not open automatically. Please open scripts/clear-data.html manually.');
    }
  });
} else {
  console.log('\nPlease open scripts/clear-data.html in your browser.');
}
