// Fixed salt for key derivation - this is acceptable since userId is already unique
const SALT = new TextEncoder().encode('daily-journal-encryption-salt');

/**
 * Derives an AES-256 key from the user ID using PBKDF2
 */
async function deriveKey(userId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userId),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts text using AES-GCM, returns base64 string
 * Format: base64(iv + ciphertext)
 */
export async function encryptText(text: string, userId: string): Promise<string> {
  const key = await deriveKey(userId);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(text)
  );

  // Combine IV and ciphertext into a single array
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts base64 string back to plaintext
 */
export async function decryptText(encryptedText: string, userId: string): Promise<string> {
  const key = await deriveKey(userId);

  // Decode base64
  const combined = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));

  // Extract IV (first 12 bytes) and ciphertext (rest)
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Checks if a string appears to be encrypted
 * Encrypted text is pure base64 with no spaces or normal punctuation
 * Used by the migration page to skip already-encrypted entries
 */
export function isEncrypted(text: string): boolean {
  if (text.length < 20) return false;

  // If text contains spaces, newlines, or common punctuation, it's plaintext
  // Encrypted base64 won't have these characters
  if (/[\s,.'!?;:\-]/.test(text)) {
    return false;
  }

  // Check if it's valid base64 (only base64 chars: A-Z, a-z, 0-9, +, /, =)
  if (!/^[A-Za-z0-9+/]+=*$/.test(text)) {
    return false;
  }

  try {
    const decoded = atob(text);
    // Must have at least IV (12 bytes) + auth tag (16 bytes) + some content
    return decoded.length >= 29;
  } catch {
    return false;
  }
}
