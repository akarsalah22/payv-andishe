import { redirect } from 'next/navigation';

export const revalidate = 1800;
export const dynamicParams = true;

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  redirect(`/films/${encodeURIComponent(id)}`);
}

