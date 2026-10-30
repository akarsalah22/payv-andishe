import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { AdminLoginClient } from '@/components/admin/AdminLoginClient';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'کارگێڕیی پلاتفۆرم | میدیای ئیسلامی',
  description: 'پەنێڵی بەڕێوەبردنی فیلم، ئەنیمەیشن و وتارەکان',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(sessionToken);

  if (!isAuthenticated) {
    return <AdminLoginClient />;
  }

  return <AdminDashboardClient />;
}
