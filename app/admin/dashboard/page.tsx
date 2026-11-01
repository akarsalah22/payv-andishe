import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'پەنێڵی بەڕێوەبردن | میدیای ئیسلامی',
  description: 'پەنێڵی بەڕێوەبردنی فیلم، ئەنیمەیشن و وتارەکان',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(sessionToken);

  if (!isAuthenticated) {
    redirect('/admin');
  }

  return <AdminDashboardClient />;
}

