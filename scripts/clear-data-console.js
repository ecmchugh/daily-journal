/**
 * Browser Console Script - Copy and paste this into your browser console
 * 
 * This will clear all Daily Journal localStorage data
 */

(function() {
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
  
  if (cleared.length > 0) {
    console.log('✓ Cleared:', cleared.join(', '));
    console.log('All Daily Journal data has been deleted.');
  } else {
    console.log('No Daily Journal data found to clear.');
  }
  
  console.log('Remaining localStorage keys:', Object.keys(localStorage));
})();
