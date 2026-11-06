import Link from 'next/link';
import { t, type Locale } from '@/lib/muguetli';
import type { JournalArticle } from '@/lib/editorial';
import { JournalIcon } from './journal-icon';
import styles from './journal-index.module.css';

export function JournalIndex({ articles, locale }: { articles: JournalArticle[]; locale: Locale }) {
  const fa = locale === 'fa';
  const essays = articles.filter(article => article.body);
  const guides = articles.filter(article => !article.body);
  const [featured, ...remaining] = essays;
  const href = (article: JournalArticle) => article.url.replace(/^\/en(?=\/|$)/, `/${locale}`);

  return <div className={styles.journal}>
    {featured && <section aria-label={fa ? 'یادداشت آغازین' : 'Opening essay'}>
      <Link className={styles.featured} href={href(featured)}>
        <div className={styles.featureImage}><img src={featured.image} alt={featured.imageAlt ? t(featured.imageAlt, locale) : ''} width={1536} height={1024} fetchPriority="high" /><span className={styles.imageSeal}><JournalIcon kind="flower" /></span></div>
        <div className={styles.featureCopy}>
          <span className={styles.eyebrow}>{t(featured.category, locale)}</span>
          <h2>{t(featured.title, locale)}</h2>
          <p>{t(featured.excerpt, locale)}</p>
          {featured.author && <span className={styles.byline}>{t(featured.author, locale)}</span>}
          <span className={styles.read}>{fa ? 'خواندن مانیفست' : 'Read the manifesto'} <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </section>}
    {remaining.length > 0 && <section className={styles.essaySection} aria-labelledby="essays-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>{fa ? 'کلمه، بافت، دگرگونی' : 'Words, texture, transformation'}</span><h2 id="essays-heading">{fa ? 'شکل‌های دیگر یک داستان' : 'Other forms of one story'}</h2></div><span className={styles.sectionNote}>{fa ? 'از جهان درون تا فرمِ زیسته' : 'From the inner world to lived form'}</span></div>
      <div className={styles.essayGrid}>{remaining.map(article => <article key={article.id}>
        <Link className={styles.card} href={href(article)}>
          <div className={styles.cardImage}><img src={article.image} alt={article.imageAlt ? t(article.imageAlt, locale) : ''} width={1536} height={1024} loading="lazy" /></div>
          <div className={styles.cardMeta}><span>{t(article.category, locale)}</span>{article.icon && <JournalIcon kind={article.icon} />}</div>
          <h3>{t(article.title, locale)}</h3><p>{t(article.excerpt, locale)}</p>
          <span className={styles.read}>{fa ? 'خواندن یادداشت' : 'Read the essay'} <span aria-hidden="true">↗</span></span>
        </Link>
      </article>)}</div>
    </section>}
    {guides.length > 0 && <section className={styles.guides} aria-labelledby="guides-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>{fa ? 'هنر در زندگی روزمره' : 'Art in everyday life'}</span><h2 id="guides-heading">{fa ? 'راهنمای پوشیدن روایت' : 'Ways to wear the story'}</h2></div></div>
      <div className={styles.guideGrid}>{guides.map(article => <article key={article.id}><Link className={styles.guide} href={href(article)}><img src={article.image} alt="" width={800} height={600} loading="lazy" /><div><span className={styles.eyebrow}>{t(article.category, locale)}</span><h3>{t(article.title, locale)}</h3><p>{t(article.excerpt, locale)}</p><span className={styles.read}>{fa ? 'خواندن راهنما' : 'Read the guide'} <span aria-hidden="true">↗</span></span></div></Link></article>)}</div>
    </section>}
  </div>;
}
