import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readFilms, writeFilms } from '@/lib/storage';
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

// GET: Return all films from persistent storage
export async function GET() {
  try {
    const films = await readFilms();
    return NextResponse.json(films);
  } catch {
    return NextResponse.json({ error: 'Failed to read films' }, { status: 500 });
  }
}

// POST: Add a new film and write permanently to disk
export async function POST(req: Request) {
  try {
    const newFilm = await req.json();

    if (!newFilm.titleKurdish || !newFilm.titleKurdish.trim()) {
      return NextResponse.json({ error: 'Film Kurdish title is required' }, { status: 400 });
    }

    const films = await readFilms();

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

    const updated = [filmToSave, ...films];
    await writeFilms(updated);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, film: filmToSave }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error in POST /api/films:', err);
    const message = err instanceof Error ? err.message : 'Failed to save film';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Update an existing film permanently on disk
export async function PUT(req: Request) {
  try {
    const updatedFilm = await req.json();

    if (!updatedFilm.id) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
    }

    const films = await readFilms();
    const index = films.findIndex((f) => f.id === updatedFilm.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 });
    }

    films[index] = {
      ...films[index],
      ...updatedFilm,
      year: Number(updatedFilm.year) || films[index].year,
    };

    await writeFilms(films);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, film: films[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update film' }, { status: 500 });
  }
}

// DELETE: Remove a film permanently from disk
export async function DELETE(req: Request) {
  try {
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

    const films = await readFilms();
    const updated = films.filter((f) => f.id !== idToDelete);

    await writeFilms(updated);

    revalidatePath('/');
    revalidatePath('/films');
    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete film' }, { status: 500 });
  }
}
