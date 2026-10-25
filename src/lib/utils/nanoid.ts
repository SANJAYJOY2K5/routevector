import crypto from 'crypto';

// URL-friendly alphabet (alphanumeric, omitting easily confused characters if desired, 62 chars)
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateShortCode(length: number = 7): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
}

// Blocked reserved route keywords
export const RESERVED_CODES = new Set([
  'api',
  'go',
  'analytics',
  'dashboard',
  'admin',
  'login',
  'logout',
  'auth',
  'settings',
  'app',
  'assets',
  'static',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'health',
  'status',
  'links',
  'clicks',
]);

export function isValidCustomCode(code: string): { valid: boolean; reason?: string } {
  if (!code || typeof code !== 'string') {
    return { valid: false, reason: 'Custom code cannot be empty.' };
  }

  const trimmed = code.trim();
  if (trimmed.length < 3 || trimmed.length > 32) {
    return { valid: false, reason: 'Custom code must be between 3 and 32 characters.' };
  }

  // Allow letters, numbers, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, reason: 'Only letters, numbers, hyphens (-), and underscores (_) are allowed.' };
  }

  if (RESERVED_CODES.has(trimmed.toLowerCase())) {
    return { valid: false, reason: `"${trimmed}" is a reserved system path and cannot be used.` };
  }

  return { valid: true };
}
