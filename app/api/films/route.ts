import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readFilms, saveSingleFilm, removeSingleFilm } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import type { Film } from '@/data/films';

// Helper to generate a clean URL slug from title
function generateSlug(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `film-${Date.now()}`
  );
}

// GET: Return all films from persistent storage (Neon Postgres)
export async function GET() {
  try {
    const films = await readFilms();
    return NextResponse.json(films);
  } catch {
    return NextResponse.json({ error: 'Failed to read films' }, { status: 500 });
  }
}

// POST: Add a new film and write to Neon Postgres
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const newFilm = await req.json();

    if (!newFilm.titleKurdish || !newFilm.titleKurdish.trim()) {
      return NextResponse.json({ error: 'تکایە ناوی کوردیی فیلم بنووسە' }, { status: 400 });
    }

    const filmToSave: Film = {
      id: newFilm.id || `film-${Date.now()}`,
      slug: newFilm.slug || generateSlug(newFilm.titleKurdish),
      titleKurdish: newFilm.titleKurdish.trim(),
      originalTitle: newFilm.originalTitle?.trim() || newFilm.titleKurdish.trim(),
      year: Number(newFilm.year) || new Date().getFullYear(),
      duration: newFilm.duration?.trim() || '٢ کاتژمێر',
      category: newFilm.category || 'سینەمایی',
      genres: Array.isArray(newFilm.genres) && newFilm.genres.length > 0 ? newFilm.genres : ['سینەما'],
      posterUrl:
        newFilm.posterUrl?.trim() ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      description: newFilm.description?.trim() || '',
      telegramPostUrl: newFilm.telegramPostUrl?.trim() || 'https://t.me/mediay_islami',
    };

    await saveSingleFilm(filmToSave);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, film: filmToSave }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error in POST /api/films:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە تۆمارکردنی فیلمدا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Update an existing film in Neon Postgres
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const updatedFilm = await req.json();

    if (!updatedFilm.id) {
      return NextResponse.json({ error: 'ناسێنەری فیلم دیاری نەکراوە' }, { status: 400 });
    }

    const films = await readFilms();
    const existing = films.find((f) => f.id === updatedFilm.id);

    const mergedFilm: Film = {
      ...(existing || {
        id: updatedFilm.id,
        slug: updatedFilm.slug || `film-${Date.now()}`,
        titleKurdish: updatedFilm.titleKurdish || '',
        originalTitle: updatedFilm.originalTitle || '',
        year: Number(updatedFilm.year) || 2024,
        duration: updatedFilm.duration || '٢ کاتژمێر',
        category: updatedFilm.category || 'سینەمایی',
        genres: updatedFilm.genres || ['سینەما'],
        posterUrl: updatedFilm.posterUrl || '',
        description: updatedFilm.description || '',
        telegramPostUrl: updatedFilm.telegramPostUrl || 'https://t.me/mediay_islami',
      }),
      ...updatedFilm,
      year: Number(updatedFilm.year) || (existing ? existing.year : 2024),
    };

    await saveSingleFilm(mergedFilm);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, film: mergedFilm });
  } catch (err: unknown) {
    console.error('Error in PUT /api/films:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە نوێکردنەوەی فیلمدا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove a film from Neon Postgres
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get('id');

    let idToDelete = idFromQuery;
    if (!idToDelete) {
      try {
        const body = await req.json();
        idToDelete = body.id;
      } catch {
        // query param was empty and body not json
      }
    }

    if (!idToDelete) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
    }

    await removeSingleFilm(idToDelete);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/films:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە سڕینەوەی فیلمدا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
