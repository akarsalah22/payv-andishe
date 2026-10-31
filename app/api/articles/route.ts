import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readArticles, saveSingleArticle, removeSingleArticle } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import type { Article } from '@/data/articles';

// GET: Fetch all articles from Neon Postgres
export async function GET() {
  try {
    const articles = await readArticles();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST: Create a new article and write to Neon Postgres
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const newArticle = await req.json();

    if (!newArticle.title || !newArticle.title.trim()) {
      return NextResponse.json({ error: 'ناونیشانی وتار داواکراوە' }, { status: 400 });
    }

    // Format content if passed as a single string
    const paragraphs = Array.isArray(newArticle.content)
      ? newArticle.content
      : typeof newArticle.content === 'string'
      ? newArticle.content.split('\n\n').map((p: string) => p.trim()).filter(Boolean)
      : [''];

    const articleToSave: Article = {
      id: newArticle.id || `article-${Date.now()}`,
      slug: newArticle.slug || `post-${Date.now()}`,
      title: newArticle.title.trim(),
      excerpt: newArticle.excerpt || (paragraphs[0] ? paragraphs[0].slice(0, 120) + '...' : ''),
      content: paragraphs.length > 0 ? paragraphs : [''],
      category: newArticle.category || 'ڕامان',
      readTime: newArticle.readTime || '٥ خولەک خوێندنەوە',
      date: newArticle.date || 'ئەمڕۆ',
      coverImage:
        newArticle.coverImage ||
        newArticle.imageUrl ||
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      imageUrl:
        newArticle.coverImage ||
        newArticle.imageUrl ||
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      author: newArticle.author || 'میدیای ئیسلامی',
    };

    await saveSingleArticle(articleToSave);

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath(`/articles/${articleToSave.slug}`);

    return NextResponse.json({ success: true, article: articleToSave }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error in POST /api/articles:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە تۆمارکردنی وتاردا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Update existing article in Neon Postgres
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const updatedArticle = await req.json();

    if (!updatedArticle.id) {
      return NextResponse.json({ error: 'ناسێنەری وتار داواکراوە' }, { status: 400 });
    }

    const articles = await readArticles();
    const existing = articles.find((a: Article) => a.id === updatedArticle.id);

    // Format content if string
    const paragraphs = Array.isArray(updatedArticle.content)
      ? updatedArticle.content
      : typeof updatedArticle.content === 'string'
      ? updatedArticle.content.split('\n\n').map((p: string) => p.trim()).filter(Boolean)
      : existing?.content || [''];

    const mergedArticle: Article = {
      ...(existing || {
        id: updatedArticle.id,
        slug: updatedArticle.slug || `post-${Date.now()}`,
        title: updatedArticle.title || '',
        excerpt: updatedArticle.excerpt || '',
        content: [''],
        category: updatedArticle.category || 'ڕامان',
        readTime: updatedArticle.readTime || '٥ خولەک خوێندنەوە',
        date: updatedArticle.date || 'ئەمڕۆ',
        coverImage: updatedArticle.coverImage || '',
        imageUrl: updatedArticle.coverImage || '',
        author: updatedArticle.author || 'میدیای ئیسلامی',
      }),
      ...updatedArticle,
      content: paragraphs.length > 0 ? paragraphs : [''],
      coverImage: updatedArticle.coverImage || updatedArticle.imageUrl || existing?.coverImage || '',
      imageUrl: updatedArticle.coverImage || updatedArticle.imageUrl || existing?.imageUrl || '',
    };

    await saveSingleArticle(mergedArticle);

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath(`/articles/${mergedArticle.slug}`);

    return NextResponse.json({ success: true, article: mergedArticle });
  } catch (err: unknown) {
    console.error('Error in PUT /api/articles:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە نوێکردنەوەی وتاردا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove an article from Neon Postgres
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
      return NextResponse.json({ error: 'ناسێنەری وتار داواکراوە' }, { status: 400 });
    }

    await removeSingleArticle(idToDelete);

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/articles:', err);
    const message = err instanceof Error ? err.message : 'هەڵەیەک لە سڕینەوەی وتاردا ڕوویدا';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
