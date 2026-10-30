import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  CLIENT_AUTH_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  CLIENT_COOKIE_OPTIONS,
} from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'چوونەدەرەوە بە سەرکەوتوویی ئەنجامدرا',
  });

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set(CLIENT_AUTH_COOKIE_NAME, '', {
    ...CLIENT_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

