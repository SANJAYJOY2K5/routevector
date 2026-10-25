export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl?: string;
  domain?: string;
  error?: string;
}

const FORBIDDEN_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:', 'blob:'];

export function validateAndNormalizeUrl(rawInput: string, currentHost?: string): UrlValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { valid: false, error: 'Please enter a destination URL.' };
  }

  let trimmed = rawInput.trim();

  // Quick check for dangerous protocols
  const lower = trimmed.toLowerCase();
  for (const protocol of FORBIDDEN_PROTOCOLS) {
    if (lower.startsWith(protocol)) {
      return { valid: false, error: `Protocol "${protocol}" is unsafe and not permitted.` };
    }
  }

  // Prepend https:// if user omitted protocol (e.g., "github.com/dubinc/dub")
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format. Please provide a valid web address.' };
  }

  // Only allow http and https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS destination links are supported.' };
  }

  // Ensure hostname has at least one period or is localhost
  const hostname = parsed.hostname.toLowerCase();
  if (!hostname.includes('.') && hostname !== 'localhost') {
    return { valid: false, error: 'Destination URL must contain a valid domain name.' };
  }

  // Prevent self-referential redirect loops
  if (currentHost) {
    const cleanCurrent = currentHost.replace(/:\d+$/, '').toLowerCase();
    if (hostname === cleanCurrent && (parsed.pathname.startsWith('/go/') || parsed.pathname === '/go')) {
      return { valid: false, error: 'Self-redirect loop detected: destination cannot point back to /go/:code.' };
    }
  }

  return {
    valid: true,
    normalizedUrl: parsed.href,
    domain: hostname.replace(/^www\./, ''),
  };
}

export function extractDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}
