import { NextResponse } from 'next/server';
import {
  ADMIN_CREDENTIALS,
  SESSION_COOKIE_NAME,
  CLIENT_AUTH_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  CLIENT_COOKIE_OPTIONS,
  createSessionToken,
} from '@/lib/auth';
import {
  getClientIp,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Check rate limit / brute-force lockout
    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.retryAfterSeconds || 60) / 60);
      return NextResponse.json(
        {
          error: `بەهۆی ٥ هەوڵی هەڵەی یەکبەدوای یەک، هەژمارەکەت قفڵ کرا. تکایە دوای ${minutes} خولەک دووبارە هەوڵبدەرەوە.`,
          isLockedOut: true,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds || 900),
          },
        }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'تکایە ناوی بەکارهێنەر و تێپەڕەوشە بە دروستی بنووسە.' },
        { status: 400 }
      );
    }

    // 3. Validate credentials
    const isUserValid =
      username === ADMIN_CREDENTIALS.username ||
      username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase();
    const isPassValid = password === ADMIN_CREDENTIALS.password;

    if (!isUserValid || !isPassValid) {
      const failResult = recordFailedLogin(ip);

      if (failResult.isLockedOut) {
        const minutes = Math.ceil((failResult.retryAfterSeconds || 60) / 60);
        return NextResponse.json(
          {
            error: `بەهۆی ٥ هەوڵی هەڵەی یەکبەدوای یەک، هەژمارەکەت بۆ ماوەی ${minutes} خولەک قفڵ کرا.`,
            isLockedOut: true,
            remainingAttempts: 0,
            retryAfterSeconds: failResult.retryAfterSeconds,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(failResult.retryAfterSeconds || 900),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: `ناوی بەکارهێنەر یان تێپەڕەوشە هەڵەیە! (${failResult.remainingAttempts} هەوڵ ماوەتەوە پێش قفڵبوون)`,
          remainingAttempts: failResult.remainingAttempts,
          isLockedOut: false,
        },
        { status: 401 }
      );
    }

    // 4. Success: reset failed attempts
    resetLoginAttempts(ip);

    // 5. Generate secure session token & set httpOnly cookie
    const token = await createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'چوونەژوورەوە بە سەرکەوتوویی ئەنجامدرا',
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    response.cookies.set(CLIENT_AUTH_COOKIE_NAME, 'true', CLIENT_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'هەڵەیەک لە سێرڤەر ڕوویدا، تکایە دووبارە هەوڵبدەرەوە.' },
      { status: 500 }
    );
  }
}
