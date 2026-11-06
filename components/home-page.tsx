import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CanvasHero } from './canvas-hero';
import { ArrivalPreloader } from './arrival-preloader';
import { EditorialMotion } from './editorial-motion';
import { StoryJourney } from './story-journey';
import { StoryRibbon } from './story-ribbon';
import { t, type ElementId, type FeaturedProduct, type Locale } from '@/lib/muguetli';
import { editorial, services, values, type Collection } from '@/lib/editorial';
import { JournalIcon } from './journal-icon';
import styles from './home-page.module.css';

export function HomePage({ locale, products, collections }: { locale: Locale; products: Partial<Record<ElementId, FeaturedProduct[]>>; collections: Collection[] }) {
  const fa = locale === 'fa';
  const copy = (en: string, faText: string) => fa ? faText : en;
  const number = (n: number) => new Intl.NumberFormat(fa ? 'fa-IR' : 'en', { minimumIntegerDigits: 2 }).format(n);
  const pieces = Array.from(new Map(Object.values(products).flat().filter(Boolean).map(p => [p.id, p])).values());
  const cards = collections.length ? collections : pieces.map(p => ({ id: p.id, name: p.name, image: p.image, description: '', url: p.permalink }));
  const essays = editorial.articles.filter(article => article.body);
  const journalArticles = essays.length ? essays : editorial.articles.slice(0, 3);

  return <main>
    <noscript><style>{'dialog[data-arrival-preloader]{display:none!important}'}</style></noscript>
    <ArrivalPreloader locale={locale} />
    <CanvasHero locale={locale} />
    <EditorialMotion locale={locale}>
      <section className={styles.storyIntro} aria-labelledby="story-intro-title">
        <div className={styles.storyIntroMeta}><span>{copy('MUGUETLI / A FIELD OF MEANING', 'موگه‌تلی / میدان معنا')}</span><span>{copy('01 / ARRIVAL', '۰۱ / ورود')}</span></div>
        <div className={styles.storyIntroBody}>
          <p className={styles.kicker} data-reveal>{copy('NARRATIVE TEXTILE & IMAGE ARCHITECTURE', 'معماری روایت، منسوجات و تصویر')}</p>
          <h1 id="story-intro-title" data-reveal>{copy('From the heights we came,', 'ما ز بالاییم،')}<br /><span>{copy('to the heights we ascend.', 'و بالا می‌رویم.')}</span></h1>
          <div className={styles.storyIntroFooter} data-reveal>
            <p>{copy('A story begins in language, becomes image, and finds another life on the body. Move through the four elements, then enter the catalogue when you are ready.', 'داستان از زبان آغاز می‌شود، به تصویر بدل می‌شود و روی بدن زندگی دیگری پیدا می‌کند. از میان چهار عنصر عبور کنید و وقتی آماده بودید، وارد فهرست آثار شوید.')}</p>
            <div className={styles.storyIntroLinks}><a href="#chapter-fire">{copy('Enter the journey', 'ورود به سفر')}<ArrowUpRight size={17} /></a><Link href={`/${locale}/collections`}>{copy('Browse the catalogue', 'دیدن فهرست آثار')}<ArrowUpRight size={17} /></Link></div>
          </div>
        </div>
      </section>
      <StoryRibbon locale={locale} />
      <StoryJourney locale={locale} collections={cards} />

      <section id="founder" tabIndex={-1} className={styles.founder} aria-labelledby="founder-title">
        <div className={styles.founderArt} data-portrait><img src={editorial.founder?.image || '/media/collection/founder.webp'} alt={copy('Elnaz Bakhtiari wearing a Muguetli scarf', 'الناز بختیاری با روسری موگه‌تلی')} width={853} height={1280} loading="lazy" decoding="async" /></div>
        <div className={styles.founderCopy}>
          <p className={styles.kicker} data-reveal>{copy('03 / THE WOMAN BEHIND THE WORLD', '۰۳ / زنی پشت این جهان')}</p>
          <h2 id="founder-title" data-reveal>{copy('Elnaz', 'الناز')}<br /><span>{copy('Bakhtiari', 'بختیاری')}</span></h2>
          <p className={styles.founderRole}>{editorial.founder && t(editorial.founder.role, locale)}</p>
          <p className={styles.founderText} data-reveal>{editorial.founder && t(editorial.founder.copy, locale)}</p>
          <div className={styles.values}>{values.slice(0, 3).map((value, i) => <div key={value.en}><span className={styles.rule} data-line /><small>{number(i + 1)}</small><span>{t(value, locale)}</span></div>)}</div>
          <Link className={styles.textLink} href={`/${locale}/about`}>{copy('Her story & the four elements', 'داستان او و اندیشهٔ چهار عنصر')}<ArrowUpRight size={18} /></Link>
        </div>
        <div className={styles.founderCaption}><span>MUGUETLI / {copy('THE FOUNDER', 'بنیان‌گذار')}</span><span>{copy('Art as a way of being.', 'هنر، شیوه‌ای برای بودن.')}</span></div>
      </section>

      <StoryRibbon locale={locale} light />

      <section data-surface="dark" id="atelier" tabIndex={-1} className={styles.consulting} aria-labelledby="atelier-title">
        <div className={styles.sectionTop}><span>{copy('04 / THE ATELIER', '۰۴ / آتلیه')}</span><span>{copy('STYLING & CREATIVE CONSULTING', 'استایل و مشاورهٔ خلاق')}</span></div>
        <div className={styles.consultingHead}><h2 id="atelier-title" data-reveal>{copy('BECOME YOUR', 'خودت')}<br /><span>{copy('OWN MUSE.', 'الهام‌بخش باش.')}</span></h2><p data-reveal>{copy('Your clothes. Your image.\nYour way of being seen.', 'لباس تو. تصویر تو.\nشیوهٔ دیده‌شدن تو.')}</p></div>
        <div className={styles.services}>{services.map((service, i) => <Link href={`/${locale}/consulting#service-${i}`} key={service.title.en} className={styles.service}><span className={styles.rule} data-line /><span className={styles.serviceNumber}>{number(i + 1)}</span><h3 data-reveal>{t(service.title, locale)}</h3><p>{t(service.description, locale)}</p><ArrowUpRight strokeWidth={1} /></Link>)}</div>
        <Link className={styles.textLink} href={`/${locale}/consulting`}>{copy('Explore the atelier', 'کشف آتلیه')}<ArrowUpRight size={20} /></Link>
      </section>

      <section className={styles.journal} id="journal" tabIndex={-1} aria-labelledby="journal-title">
        <div className={styles.journalHeading} data-reveal><div><p className={styles.kicker}>{copy('05 / NOTES FROM OUR WORLD', '۰۵ / یادداشت‌هایی از جهان ما')}</p><h2 id="journal-title">{copy('The journal', 'ژورنال')}<span>.</span></h2></div><Link className={styles.textLink} href={`/${locale}/journal`}>{copy('All stories', 'همهٔ داستان‌ها')}<ArrowUpRight size={19} /></Link></div>
        {journalArticles.length ? <div className={styles.journalGrid}>{journalArticles.map(a => <Link href={a.url.replace(/^\/en(?=\/|$)/, `/${locale}`)} key={a.id} data-reveal><img src={a.image} alt={a.imageAlt ? t(a.imageAlt, locale) : ''} width={1536} height={1024} loading="lazy" decoding="async" /><div className={styles.journalCategory}><small>{t(a.category, locale)}</small>{a.icon && <JournalIcon kind={a.icon} />}</div><h3>{t(a.title, locale)}</h3><p>{t(a.excerpt, locale)}</p></Link>)}</div> : <p className={styles.journalNote}>{copy('Stories are taking shape. New notes will appear here.', 'داستان‌ها در حال شکل‌گرفتن‌اند. یادداشت‌های تازه اینجا منتشر می‌شوند.')}</p>}
      </section>
    </EditorialMotion>
  </main>;
}
