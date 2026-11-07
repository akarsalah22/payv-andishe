import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readAboutSettings, saveAboutSettings } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { DEFAULT_ABOUT_SETTINGS, type AboutSettings } from '@/data/about';

// GET: Return current About settings
export async function GET() {
  try {
    const about = await readAboutSettings();
    return NextResponse.json(about);
  } catch (error) {
    console.error('Failed to read about settings:', error);
    return NextResponse.json(DEFAULT_ABOUT_SETTINGS);
  }
}

// POST: Update About settings (requires admin authentication)
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
        { error: 'تکایە ناونیشانی سەرەکی دەربارە بنووسە' },
        { status: 400 }
      );
    }

    if (!body.paragraph_1 || !body.paragraph_1.trim()) {
      return NextResponse.json(
        { error: 'تکایە دەقی سەرەکی و ناساندن بنووسە' },
        { status: 400 }
      );
    }

    const contentToSave: AboutSettings = {
      title: body.title.trim(),
      paragraph_1: body.paragraph_1.trim(),
      paragraph_2: body.paragraph_2?.trim() || DEFAULT_ABOUT_SETTINGS.paragraph_2,
      paragraph_3: body.paragraph_3?.trim() || DEFAULT_ABOUT_SETTINGS.paragraph_3,
      instagram_handle: body.instagram_handle?.trim() || DEFAULT_ABOUT_SETTINGS.instagram_handle,
      instagram_url: body.instagram_url?.trim() || DEFAULT_ABOUT_SETTINGS.instagram_url,
      telegram_handle: body.telegram_handle?.trim() || DEFAULT_ABOUT_SETTINGS.telegram_handle,
      telegram_url: body.telegram_url?.trim() || DEFAULT_ABOUT_SETTINGS.telegram_url,
    };

    const success = await saveAboutSettings(contentToSave);

    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: contentToSave,
      dbSynced: success,
    });
  } catch (error) {
    console.error('Failed to save about settings:', error);
    return NextResponse.json(
      { error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی دەربارە' },
      { status: 500 }
    );
  }
}
