import { redirect } from 'next/navigation';

export const revalidate = 1800;

export default function WritingsPage() {
  redirect('/articles');
}

