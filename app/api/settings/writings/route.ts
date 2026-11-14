import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readWritingsPageSettings, saveWritingsPageSettings } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { DEFAULT_WRITINGS_PAGE_SETTINGS, type WritingsPageSettings } from '@/data/pageSettings';

// GET: Return current writings page settings
export async function GET() {
  try {
    const settings = await readWritingsPageSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read writings page settings:', error);
    return NextResponse.json(DEFAULT_WRITINGS_PAGE_SETTINGS);
  }
}

// POST: Update writings page settings (requires admin authentication)
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
        { error: 'تکایە ناونیشانی سەرەکی پەڕەی نووسینەکان بنووسە' },
        { status: 400 }
      );
    }

    const settingsToSave: WritingsPageSettings = {
      badge: (body.badge || '').trim() || DEFAULT_WRITINGS_PAGE_SETTINGS.badge,
      title: body.title.trim(),
      subtitle: (body.subtitle || '').trim() || DEFAULT_WRITINGS_PAGE_SETTINGS.subtitle,
      searchPlaceholder: (body.searchPlaceholder || '').trim() || DEFAULT_WRITINGS_PAGE_SETTINGS.searchPlaceholder,
      emptyMessage: (body.emptyMessage || '').trim() || DEFAULT_WRITINGS_PAGE_SETTINGS.emptyMessage,
    };

    const success = await saveWritingsPageSettings(settingsToSave);

    revalidatePath('/articles');
    revalidatePath('/writings');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: settingsToSave,
      dbSynced: success,
    });
  } catch (error) {
    console.error('Failed to save writings page settings:', error);
    return NextResponse.json(
      { error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی نووسینەکان' },
      { status: 500 }
    );
  }
}
