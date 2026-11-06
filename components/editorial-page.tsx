import Link from 'next/link';
import { chapters, t, type Locale } from '@/lib/muguetli';
import { pages, type PageSlug } from '@/lib/pages';
import styles from './editorial-page.module.css';
import { editorial, editorialCollections, services } from '@/lib/editorial';
import { ScarfGallery } from './scarf-gallery';
import { BookQuote } from './book-quote';
import { bookExcerpts, literaryElements } from '@/lib/book-story';
import { PrivateInquiry } from './private-inquiry';
import { CollectionIndex } from './catalog-page';
import { JournalIndex } from './journal-index';
import { BrandStoryFeature } from './brand-story-feature';

export async function EditorialPage({ locale, slug }: { locale: Locale; slug: PageSlug }) {
  const page = pages[slug];
  const collections = slug === 'collections' ? editorialCollections : [];
  const catalog = collections;
  const book = (slug === 'books' || slug === 'ebook') ? editorial.book : null;
  const articles = slug === 'journal' ? editorial.articles : [];
  const hasContent = slug === 'collections' || slug === 'size-guide' || catalog.length > 0 || Boolean(book) || articles.length > 0;
  const fa = locale === 'fa';
  const editionUrl = slug === 'ebook' ? book?.ebookUrl : book?.url;
  return (
    <main className={styles.page} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <header className={`${styles.hero}${slug === 'journal' ? ` ${styles.journalHero}` : ''}`}>
        <p>{t(page.eyebrow, locale)}</p>
        <h1 className={book ? styles.originalBookTitle : undefined} lang={book ? 'fa' : locale} dir={book ? 'rtl' : undefined}>{book ? book.originalTitle : t(page.title, locale)}</h1>
        <span>{t(page.lede, locale)}</span>
      </header>

      {slug === 'collections' && <CollectionIndex locale={locale} />}
      {book && <section className={styles.bookReading}>
        <div className={styles.bookIntroduction}>
          {book.image && <img src={book.image} alt={t(book.title, locale)} width={600} height={800} />}
          <div><p className={styles.bookByline}>{t(book.author, locale)} · {t(book.language, locale)}</p><h2>{t(book.subtitle, locale)}</h2><p>{t(book.synopsis, locale)}</p></div>
          <BookQuote excerpt={bookExcerpts.rebirth} locale={locale} />
        </div>
        <div className={styles.editionNotice}><div><h3>{slug === 'ebook' ? (fa ? 'نسخهٔ الکترونیکی · فارسی' : 'Digital edition · Persian') : (fa ? 'نسخهٔ چاپی · فارسی' : 'Physical edition · Persian')}</h3><p>{fa ? 'متن اصلی کتاب به زبان فارسی است.' : 'The book’s original text is Persian. English excerpts on this site are translations.'}</p></div>{editionUrl ? <a href={editionUrl}>{fa ? (slug === 'ebook' ? 'دریافت کتاب الکترونیکی' : 'خرید کتاب') : (slug === 'ebook' ? 'Get the eBook' : 'Buy the book')} ↗</a> : <span>{fa ? (slug === 'ebook' ? 'دانلود هنوز در دسترس نیست' : 'خرید هنوز در دسترس نیست') : (slug === 'ebook' ? 'Download not yet available' : 'Purchase not yet available')}</span>}</div>
        <nav className={styles.bookLinks} aria-label={fa ? 'ادامهٔ داستان' : 'Continue the story'}><Link href={`/${locale}/mythology`}>{fa ? 'چهار عنصر؛ ۲۱ مرحله' : 'Four elements. 21 stages.'} ↗</Link><Link href={`/${locale}/${slug === 'ebook' ? 'books' : 'ebook'}`}>{slug === 'ebook' ? (fa ? 'دربارهٔ نسخهٔ چاپی' : 'About the physical book') : (fa ? 'دربارهٔ نسخهٔ الکترونیکی' : 'About the eBook')} ↗</Link></nav>
      </section>}
      {articles.length > 0 && <JournalIndex articles={articles} locale={locale} />}

      {slug === 'size-guide' && <section className={styles.sizeMatrix} aria-label={fa ? 'اندازه‌های منسوجات' : 'Textile sizes'}>
        <article id="pocket-square" tabIndex={-1}><span>01</span><p>50 × 50 cm</p><h2>{fa ? 'دستمال جیبی' : 'Pocket square'}</h2><small>{fa ? 'مربعی کوچک برای جیب، گردن یا قاب‌کردن بخشی از تصویر.' : 'A small square for a pocket, the neck, or framing one part of an image.'}</small></article>
        <article id="square-scarf" tabIndex={-1}><span>02</span><p>90 × 90 cm</p><h2>{fa ? 'روسری مربع' : 'Square scarf'}</h2><small>{fa ? 'اندازه‌ای منعطف برای سر، گردن و شانه.' : 'A flexible scale for the head, neck, and shoulders.'}</small></article>
        <article id="long-shawl" tabIndex={-1}><span>03</span><p>180 × 70 cm</p><h2>{fa ? 'شال بلند' : 'Long shawl'}</h2><small>{fa ? 'فرمی کشیده برای حرکت روی شانه و ساختن سیلوئت.' : 'An elongated form for movement across the shoulders and shaping a silhouette.'}</small></article>
        <p className={styles.sizeNote}>{t(page.body[0], locale)}</p>
      </section>}

      {slug === 'collections' && <section className={styles.suppliedCollection} aria-label={locale === 'fa' ? 'روسری‌های موگه‌تلی' : 'Muguetli scarves'}><ScarfGallery locale={locale} /></section>}
      {slug === 'about' && editorial.founder && <section className={styles.founderDetail}><img src={editorial.founder.image} alt={t(editorial.founder.name, locale)} width={853} height={1280} loading="lazy" /><div><h2>{fa ? 'از سوگ، جهانی زاده شد.' : 'From grief, a world.'}</h2><p>{t(editorial.founder.copy, locale)}</p><Link href={`/${locale}/mythology`}>{fa ? 'اندیشهٔ چهار عنصر' : 'The idea of the four elements'} ↗</Link></div></section>}
      {slug === 'about' && <BrandStoryFeature locale={locale} />}

      {slug === 'mythology' && (
        <section className={styles.chapters} aria-label={locale === 'fa' ? 'چهار فصل' : 'Four chapters'}>
          {literaryElements.map((element, index) => (
            <article key={element.id} id={element.id} tabIndex={-1}>
              <img src={chapters.find(chapter => chapter.id === element.id)!.poster} alt="" width={1280} height={720} loading="lazy" />
              <div>
                <p>{new Intl.NumberFormat(fa ? 'fa-IR' : 'en', { minimumIntegerDigits: 2 }).format(index + 1)} — {t(element.name, locale)}</p>
                <h2 className={styles.elementTitle}>{t(element.title, locale)}</h2>
                <p className={styles.elementIdea}>{t(element.idea, locale)}</p>
                <BookQuote excerpt={element.excerpt} locale={locale} compact />
              </div>
            </article>
          ))}
        </section>
      )}

      <section className={styles.body}>
        {slug === 'consulting' && services.map((service,i)=><article id={`service-${i}`} key={service.title.en} style={{padding:'28px 0',borderBottom:'1px solid currentColor',scrollMarginTop:100}}><h2>{t(service.title,locale)}</h2><p>{t(service.description,locale)}</p></article>)}
        {!hasContent && page.body.map((paragraph) => <p key={paragraph.en}>{t(paragraph, locale)}</p>)}
        {slug === 'about' && <BookQuote excerpt={bookExcerpts.light} locale={locale} />}
        {slug === 'contact' && <PrivateInquiry locale={locale} />}
        <Link href={`/${locale}`}>{locale === 'fa' ? 'بازگشت به چهار مادر' : 'Return to The Four Mothers'} <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
