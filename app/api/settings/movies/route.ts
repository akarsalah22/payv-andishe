import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readMoviesPageSettings, saveMoviesPageSettings } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { DEFAULT_MOVIES_PAGE_SETTINGS, type MoviesPageSettings } from '@/data/pageSettings';

// GET: Return current movies page settings
export async function GET() {
  try {
    const settings = await readMoviesPageSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read movies page settings:', error);
    return NextResponse.json(DEFAULT_MOVIES_PAGE_SETTINGS);
  }
}

// POST: Update movies page settings (requires admin authentication)
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
        { error: 'تکایە ناونیشانی سەرەکی پەڕەی فیلمەکان بنووسە' },
        { status: 400 }
      );
    }

    const settingsToSave: MoviesPageSettings = {
      badge: (body.badge || '').trim() || DEFAULT_MOVIES_PAGE_SETTINGS.badge,
      title: body.title.trim(),
      subtitle: (body.subtitle || '').trim() || DEFAULT_MOVIES_PAGE_SETTINGS.subtitle,
      searchPlaceholder: (body.searchPlaceholder || '').trim() || DEFAULT_MOVIES_PAGE_SETTINGS.searchPlaceholder,
      emptyMessage: (body.emptyMessage || '').trim() || DEFAULT_MOVIES_PAGE_SETTINGS.emptyMessage,
    };

    const success = await saveMoviesPageSettings(settingsToSave);

    revalidatePath('/films');
    revalidatePath('/movies');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: settingsToSave,
      dbSynced: success,
    });
  } catch (error) {
    console.error('Failed to save movies page settings:', error);
    return NextResponse.json(
      { error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی ڕێکخستنەکانی پەڕەی فیلمەکان' },
      { status: 500 }
    );
  }
}
