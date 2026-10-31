import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Protect mutating API routes (POST, PUT, DELETE) for content management
  const isProtectedApiRoute =
    pathname.startsWith('/api/films') ||
    pathname.startsWith('/api/articles');

  const isMutatingMethod =
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE';

  if (isProtectedApiRoute && isMutatingMethod) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValidSession = await verifySessionToken(sessionCookie);

    if (!isValidSession) {
      return NextResponse.json(
        { error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە یان دانیشتنەکەت بەسەرچووە.' },
        { status: 401 }
      );
    }
  }

  // 2. Add security headers for Admin routes and API
  const response = NextResponse.next();

  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/films/:path*',
    '/api/articles/:path*',
  ],
};

