import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalArticlePage } from '@/components/journal-article-page';
import { editorial } from '@/lib/editorial';
import { isLocale, locales } from '@/lib/muguetli';

export function generateStaticParams() {
  return locales.flatMap(locale => editorial.articles.map(article => ({ locale, article: article.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; article: string }> }): Promise<Metadata> {
  const { locale, article } = await params;
  const record = editorial.articles.find(item => item.id === article);
  if (!isLocale(locale) || !record) return {};
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const path = `/${locale}/journal/${article}`;
  return {
    title: record.title[locale],
    description: record.excerpt[locale],
    alternates: {
      canonical: origin ? `${origin}${path}` : path,
      languages: {
        en: `${origin ?? ''}/en/journal/${article}`,
        fa: `${origin ?? ''}/fa/journal/${article}`,
      },
    },
    ...(origin ? { openGraph: {
      type: 'article',
      title: record.title[locale],
      description: record.excerpt[locale],
      url: `${origin}${path}`,
      images: [{ url: `${origin}${record.image}`, alt: record.imageAlt?.[locale] ?? record.title[locale] }],
      ...(record.author ? { authors: [record.author[locale]] } : {}),
    } } : {}),
  };
}

export default async function LocalizedArticle({ params }: { params: Promise<{ locale: string; article: string }> }) {
  const { locale, article } = await params;
  if (!isLocale(locale) || !editorial.articles.some(item => item.id === article)) notFound();
  return <JournalArticlePage locale={locale} articleId={article} />;
}
