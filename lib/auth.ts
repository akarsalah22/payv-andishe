const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ADMIN_PASS ||
  "#akar123-session-security-key-2026";

export const ADMIN_CREDENTIALS = {
  username: (process.env.ADMIN_USER || "akar").trim(),
  password: (process.env.ADMIN_PASS || "#akar123").trim(),
};

export const SESSION_COOKIE_NAME = "admin_session";
export const CLIENT_AUTH_COOKIE_NAME = "admin_logged_in";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};

export const CLIENT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a cryptographically signed session token for an authenticated admin using Web Crypto API.
 */
export async function createSessionToken(username: string): Promise<string> {
  const enc = new TextEncoder();
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const payloadObj = {
    u: username,
    t: Date.now(),
    r: randomHex,
  };

  const payloadStr = JSON.stringify(payloadObj);
  const payload = base64UrlEncode(enc.encode(payloadStr));

  const key = await getHmacKey(SESSION_SECRET);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const signature = base64UrlEncode(sig);

  return `${payload}.${signature}`;
}

/**
 * Verifies a session token using Web Crypto API.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payload, signature] = parts;
    const enc = new TextEncoder();
    const key = await getHmacKey(SESSION_SECRET);
    const sigBytes = base64UrlDecode(signature);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, enc.encode(payload));
    if (!isValid) return false;

    const payloadBytes = base64UrlDecode(payload);
    const data = JSON.parse(new TextDecoder().decode(payloadBytes));

    const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours
    if (!data.t || Date.now() - data.t > maxAgeMs) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
