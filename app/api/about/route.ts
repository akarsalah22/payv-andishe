import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readAboutContent, saveAboutContent } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { DEFAULT_ABOUT_CONTENT, type AboutContent } from '@/data/about';

// GET: Return current About content
export async function GET() {
  try {
    const about = await readAboutContent();
    return NextResponse.json(about);
  } catch (error) {
    console.error('Failed to read about content:', error);
    return NextResponse.json(DEFAULT_ABOUT_CONTENT);
  }
}

// POST: Update About content (requires admin authentication)
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

    if (!body.missionTitle || !body.missionTitle.trim()) {
      return NextResponse.json(
        { error: 'تکایە ناونیشانی پەیام بنووسە' },
        { status: 400 }
      );
    }

    const contentToSave: AboutContent = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || '',
      missionTitle: body.missionTitle.trim(),
      missionText: body.missionText?.trim() || '',
      features: Array.isArray(body.features)
        ? body.features.map((f: any) => ({
            title: String(f.title || '').trim(),
            desc: String(f.desc || '').trim(),
          }))
        : DEFAULT_ABOUT_CONTENT.features,
    };

    const success = await saveAboutContent(contentToSave);

    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: contentToSave,
      dbSynced: success,
    });
  } catch (error) {
    console.error('Failed to save about content:', error);
    return NextResponse.json(
      { error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی دەربارە' },
      { status: 500 }
    );
  }
}

