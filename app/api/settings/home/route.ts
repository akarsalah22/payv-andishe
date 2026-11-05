import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readHomeSettings, saveHomeSettings } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { DEFAULT_HOME_SETTINGS, type HomeSettings } from '@/data/homeSettings';

// GET: Return current homepage hero settings
export async function GET() {
  try {
    const settings = await readHomeSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read home settings:', error);
    return NextResponse.json(DEFAULT_HOME_SETTINGS);
  }
}

// POST: Update homepage hero settings (requires admin authentication)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'تکایە ناونیشانی سەرەکی پەڕەی سەرەکی بنووسە' },
        { status: 400 }
      );
    }

    const settingsToSave: HomeSettings = {
      badgeText: (body.badgeText || '').trim() || DEFAULT_HOME_SETTINGS.badgeText,
      title: body.title.trim(),
      subtitle: (body.subtitle || '').trim() || DEFAULT_HOME_SETTINGS.subtitle,
    };

    const success = await saveHomeSettings(settingsToSave);

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: settingsToSave,
      dbSynced: success,
    });
  } catch (error) {
    console.error('Failed to save home settings:', error);
    return NextResponse.json(
      { error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی سەرەکی' },
      { status: 500 }
    );
  }
}

