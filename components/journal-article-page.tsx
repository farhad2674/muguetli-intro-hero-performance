import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { editorial } from '@/lib/editorial';
import { t, type Locale } from '@/lib/muguetli';
import { JournalIcon } from './journal-icon';
import styles from './journal-article-page.module.css';

export function JournalArticlePage({ locale, articleId }: { locale: Locale; articleId: string }) {
  const article = editorial.articles.find(item => item.id === articleId);
  if (!article) return null;
  const fa = locale === 'fa';
  const otherLocale = fa ? 'en' : 'fa';
  const sections = article.body?.[locale];
  const contents = sections?.filter(section => section.heading) ?? [];
  const related = editorial.articles.filter(item => item.id !== article.id && Boolean(item.body) === Boolean(article.body)).slice(0, 2);
  const cta = article.cta ?? { href: '/collections', label: { fa: 'دیدن فهرست آثار', en: 'Browse the catalogue' } };

  return <main className={styles.page} dir={fa ? 'rtl' : 'ltr'}>
    <header className={styles.hero}>
      <nav className={styles.utilities} aria-label={fa ? 'مسیرهای مقاله' : 'Article navigation'}>
        <Link href={`/${locale}/journal`}>{fa ? 'همهٔ یادداشت‌ها' : 'All journal entries'}</Link>
        <Link href={`/${otherLocale}/journal/${article.id}`} hrefLang={otherLocale} lang={otherLocale} dir={fa ? 'ltr' : 'rtl'}>{fa ? 'Read in English' : 'خواندن به فارسی'}</Link>
      </nav>
      <p className={styles.category}>{article.icon && <JournalIcon kind={article.icon} className={styles.categoryIcon} />}{t(article.category, locale)}</p>
      <h1>{t(article.title, locale)}</h1>
      <p className={styles.excerpt}>{t(article.excerpt, locale)}</p>
    </header>
    <article className={styles.article} aria-label={t(article.title, locale)}>
      <img className={styles.cover} src={article.image} alt={article.imageAlt ? t(article.imageAlt, locale) : ''} width={1536} height={1024} fetchPriority="high" />
      {article.author && <p className={styles.byline}><span>{fa ? 'نوشتهٔ' : 'Words by'}</span>{t(article.author, locale)}</p>}
      <div className={`${styles.reader} ${contents.length ? '' : styles.readerWithoutContents}`}>
        {contents.length > 0 && <nav className={styles.contents} aria-label={fa ? 'در این یادداشت' : 'In this essay'}>
          <p>{fa ? 'در این یادداشت' : 'IN THIS ESSAY'}</p>
          <ol>{contents.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol>
        </nav>}
        <div className={styles.prose}>
          {sections?.length ? sections.map(section => <section className={styles.essaySection} id={section.id} key={section.id} aria-label={section.heading}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs.map((paragraph, index) => <p key={`${section.id}-${index}`}>{paragraph}</p>)}
          </section>) : <>
            <p>{fa ? 'این یادداشت یک راهنمای عمومی است؛ داستان شخصی هر اثر جداگانه در گفت‌وگوی خصوصی شکل می‌گیرد.' : 'This is a general styling guide. The personal story of each artwork begins in a private conversation.'}</p>
            <p>{fa ? 'به تصویر فرصت بدهید، سپس فرم را با حرکت خودتان پیدا کنید. اندازه، نسبت و جای قرارگرفتن پارچه بخشی از روایت‌اند؛ قانون نهایی، حس شماست.' : 'Give the image room first, then let the form find your movement. Scale, proportion and placement are part of the narrative; your sense of self is the final rule.'}</p>
          </>}
          <Link className={styles.cta} href={`/${locale}${cta.href}`}>{t(cta.label, locale)}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
    {related.length > 0 && <section className={styles.related} aria-labelledby="related-heading">
      <p>{fa ? 'ادامهٔ ژورنال' : 'CONTINUE READING'}</p>
      <h2 id="related-heading">{fa ? 'روایت‌های هم‌مسیر' : 'Stories in conversation'}</h2>
      <div className={styles.relatedGrid}>{related.map(item => <Link className={styles.relatedCard} key={item.id} href={`/${locale}/journal/${item.id}`}>
        <img src={item.image} alt="" width={768} height={512} loading="lazy" />
        <span className={styles.relatedCategory}>{item.icon && <JournalIcon kind={item.icon} className={styles.relatedIcon} />}{t(item.category, locale)}</span>
        <h3>{t(item.title, locale)}</h3>
        <span className={styles.readLink}>{item.body ? (fa ? 'خواندن یادداشت' : 'Read the essay') : (fa ? 'خواندن راهنما' : 'Read the guide')}<ArrowUpRight size={18} aria-hidden="true" /></span>
      </Link>)}</div>
    </section>}
  </main>;
}
