import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { collectionMeta, designsFor, isCollectionId, type CollectionId } from '@/lib/catalog';
import { literaryElements } from '@/lib/book-story';
import { t, type Locale } from '@/lib/muguetli';
import { CatalogGrid } from './catalog-page';
import { ElementFilm } from './element-film';
import styles from './collection-page.module.css';

const collectionIcons = {
  fire: 'fire',
  earth: 'earth',
  water: 'water',
  wind: 'wind',
  calligraphy: 'writing',
} satisfies Record<CollectionId, string>;

export function CollectionPage({ locale, collectionId }: { locale: Locale; collectionId: string }) {
  const fa = locale === 'fa';
  if (!isCollectionId(collectionId)) return null;
  const meta = collectionMeta[collectionId];
  const items = designsFor(collectionId);
  const element = literaryElements.find(item => item.id === (collectionId === 'wind' ? 'air' : collectionId));
  const label = t(meta.name, locale);
  const description = element ? t(element.idea, locale) : t(meta.statement, locale);
  const statement = t(meta.statement, locale);
  const chapterTitle = element ? t(element.title, locale) : '';
  const showStatement = element && statement.replace(/\.$/, '') !== chapterTitle.replace(/\.$/, '');
  return <main className={styles.page} dir={fa ? 'rtl' : 'ltr'}>
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{fa ? 'موگه‌تلی / هنر پوشیدنی' : 'MUGUETLI / WEARABLE ART'}</p>
        <h1>{label}</h1>
        {chapterTitle && <h2>{chapterTitle}</h2>}
        {showStatement && <p className={styles.statement}>{statement}</p>}
        <p className={styles.description}>{description}</p>
        <ElementFilm element={collectionId} locale={locale} />
      </div>
      <div className={styles.heroArtwork} aria-hidden="true"><img className={styles.heroIcon} src={`/icons/detail/${collectionIcons[collectionId]}.webp`} alt="" width={360} height={360} fetchPriority="high" /></div>
    </header>
    <section className={styles.catalog}>
      <div className={styles.catalogHeader}><p>{fa ? 'آرشیو شماره‌گذاری‌شده' : 'NUMBERED ARCHIVE'}</p><h2>{fa ? 'آثار این مجموعه' : 'The artworks'}</h2><Link href={`/${locale}/products?collection=${collectionId}`}>{fa ? 'دیدن در فهرست آثار' : 'View in catalogue'}<ArrowUpRight size={17} /></Link></div>
      <CatalogGrid locale={locale} items={items} />
    </section>
    <nav className={styles.footerNav}><Link href={`/${locale}/collections`}>{fa ? 'بازگشت به مجموعه‌ها' : 'Back to collections'}<ArrowUpRight size={17} /></Link><Link href={`/${locale}/size-guide`}>{fa ? 'راهنمای اندازه' : 'Size guide'}<ArrowUpRight size={17} /></Link></nav>
  </main>;
}
