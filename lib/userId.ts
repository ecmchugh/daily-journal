export function getOrCreateUserId(): string {
  // Check if we're in browser (not server-side)
  if (typeof window === 'undefined') {
    return '';
  }

  // Check if user ID already exists
  let userId = localStorage.getItem('journalUserId');

  // If not, create a new one
  if (!userId) {
    // Generate unique ID: "anon_" + random UUID
    userId = `anon_${crypto.randomUUID()}`;
    localStorage.setItem('journalUserId', userId);
  }

  return userId;
}
