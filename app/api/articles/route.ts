import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { readArticles, writeArticles } from '@/lib/storage';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import type { Article } from '@/data/articles';

// GET: Fetch all articles from disk
export async function GET() {
  try {
    const articles = await readArticles();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST: Create a new article and write permanently to disk
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const newArticle = await req.json();

    if (!newArticle.title || !newArticle.title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const articles = await readArticles();

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
      author: newArticle.author || 'پەیڤ و ئەندێشە',
    };

    const updated = [articleToSave, ...articles];
    await writeArticles(updated);

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, article: articleToSave }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

// PUT: Update existing article permanently on disk
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const updatedArticle = await req.json();

    if (!updatedArticle.id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const articles = await readArticles();
    const index = articles.findIndex((a: Article) => a.id === updatedArticle.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Format content if string
    const paragraphs = Array.isArray(updatedArticle.content)
      ? updatedArticle.content
      : typeof updatedArticle.content === 'string'
      ? updatedArticle.content.split('\n\n').map((p: string) => p.trim()).filter(Boolean)
      : articles[index].content;

    const cover = updatedArticle.coverImage || updatedArticle.imageUrl || articles[index].coverImage;

    articles[index] = {
      ...articles[index],
      ...updatedArticle,
      content: paragraphs,
      coverImage: cover,
      imageUrl: cover,
      updatedAt: new Date().toISOString(),
    };

    await writeArticles(articles);

    revalidatePath('/');
    revalidatePath('/articles');
    if (updatedArticle.slug) {
      revalidatePath(`/articles/${updatedArticle.slug}`);
    }
    revalidatePath('/admin');

    return NextResponse.json({ success: true, article: articles[index] });
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// PATCH alias to PUT
export async function PATCH(req: Request) {
  return PUT(req);
}

// DELETE: Delete article permanently from disk
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized: دەسەڵاتی کارگێڕی بوونی نییە' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    let articleId = id;
    if (!articleId) {
      try {
        const body = await req.json();
        articleId = body.id;
      } catch {
        // no body
      }
    }

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const articles = await readArticles();
    const articleToDelete = articles.find((a: Article) => a.id === articleId);
    const updated = articles.filter((a: Article) => a.id !== articleId);

    await writeArticles(updated);

    revalidatePath('/');
    revalidatePath('/articles');
    if (articleToDelete?.slug) {
      revalidatePath(`/articles/${articleToDelete.slug}`);
    }
    revalidatePath('/admin');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
