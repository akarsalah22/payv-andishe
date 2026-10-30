/**
 * Rate Limiter and Brute-Force Prevention for Admin Login
 * Limits failed attempts to 5 before locking out for 15 minutes.
 */

interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil: number | null;
  lastAttempt: number;
}

// In-memory store keyed by client IP
const loginAttemptsMap = new Map<string, RateLimitRecord>();

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes rolling window

/**
 * Extract client IP from Request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  return '127.0.0.1';
}

/**
 * Checks whether an IP is currently allowed to attempt login.
 */
export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  // Active lockout check
  if (record.lockoutUntil && now < record.lockoutUntil) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // Lockout expired: reset record
  if (record.lockoutUntil && now >= record.lockoutUntil) {
    loginAttemptsMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  // Window expired without lockout: reset record
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttemptsMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.failedAttempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
  };
}

/**
 * Records a failed login attempt for an IP.
 */
export function recordFailedLogin(ip: string): {
  isLockedOut: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip) || {
    failedAttempts: 0,
    lockoutUntil: null,
    lastAttempt: now,
  };

  record.failedAttempts += 1;
  record.lastAttempt = now;

  if (record.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_DURATION_MS;
    loginAttemptsMap.set(ip, record);
    const retryAfterSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return {
      isLockedOut: true,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  loginAttemptsMap.set(ip, record);
  return {
    isLockedOut: false,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - record.failedAttempts,
  };
}

/**
 * Resets failed attempts upon successful authentication.
 */
export function resetLoginAttempts(ip: string): void {
  loginAttemptsMap.delete(ip);
}

