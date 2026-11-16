import type { Metadata } from 'next';
import { SavedPageClient } from './SavedPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'هەڵگیراوەکانم | میدیای ئیسلامی',
  description: 'ئەو فیلم، کارتۆن و بابەتانەی لەسەر ئامێرەکەت پاشەکەوتت کردوون.',
};

export default function SavedPage() {
  return <SavedPageClient />;
}
