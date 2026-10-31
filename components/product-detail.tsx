import Link from 'next/link';
import { ProductGallery } from './product-gallery';
import { SaveArtwork } from './saved-artworks';
import { CollectionSigil } from './shop-sigil';
import { ArrowUpRight } from 'lucide-react';
import { collectionMeta, productHref, type Design, type SizeCode } from '@/lib/catalog';
import { t, type Locale } from '@/lib/muguetli';
import { ProductInquiry } from './product-inquiry';
import { CatalogGrid } from './catalog-page';
import { designsFor } from '@/lib/catalog';
import styles from './product-detail.module.css';

export function ProductDetail({ locale, design, selectedSize }: { locale: Locale; design: Design; selectedSize: SizeCode }) {
  const fa = locale === 'fa';
  const collection = collectionMeta[design.collection];
  const related = designsFor(design.collection).filter(item => item.id !== design.id).slice(0, 4);
  return <main className={styles.page} dir={fa ? 'rtl' : 'ltr'}>
    <nav className={styles.crumbs} aria-label={fa ? 'مسیر صفحه' : 'Breadcrumb'}>
      <Link href={`/${locale}/products`}>{fa ? 'هنر پوشیدنی' : 'Wearable art'}</Link><span aria-hidden="true">/</span>
      <Link href={`/${locale}/collections/${design.collection}`}>{t(collection.name, locale)}</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{t(design.title, locale)}</span>
    </nav>

    <div className={styles.layout}>
      <ProductGallery design={design} locale={locale} pocket={selectedSize === '50x50'} />

      <aside className={styles.info}>
        <p className={styles.eyebrow}>{collection.index} / {t(collection.name, locale)} <span>·</span> {String(design.number).padStart(2, '0')}</p>
        <div className={styles.titleRow}><h1>{t(design.title, locale)}</h1><SaveArtwork id={design.id} locale={locale} className={styles.saveArtwork} /></div>
        <p className={styles.intro}>{t(collection.statement, locale)} {fa ? 'نقش را از نزدیک ببینید و فرم دلخواهتان را انتخاب کنید.' : 'Explore the pattern up close. Choose the form that feels like you.'}</p>
        <div className={styles.sizeBlock}>
          <div className={styles.sizeHeader}><h2>{fa ? 'فرم و اندازه' : 'FORM & SIZE'}</h2><Link href={`/${locale}/size-guide`}>{fa ? 'راهنمای اندازه' : 'Size guide'}<ArrowUpRight size={16} /></Link></div>
          <div className={styles.sizeChoices}>
            {design.options.map(option => <Link key={option.code} href={productHref(locale, design, option.code)} aria-current={selectedSize === option.code ? 'true' : undefined}>
              <span>{t(option.label, locale)}</span><strong>{option.widthCm} × {option.heightCm} cm</strong>
            </Link>)}
          </div>
          <p className={styles.sizeNote}>{fa ? 'این‌ها گزینه‌های این طرح در فهرست‌اند، نه ادعای موجودی آماده.' : 'These are catalogue options for this design, not a claim of ready stock.'}</p>
        </div>
        <div className={styles.privateNote}><span aria-hidden="true">✳</span><span>{fa ? 'قیمت و موجودی با استعلام مشخص می‌شود.' : 'Price and availability confirmed by private inquiry.'}</span></div>
        <ProductInquiry key={selectedSize} locale={locale} designId={design.id} collection={design.collection} size={selectedSize} />
        <div className={styles.details}>
          <details open><summary>{fa ? 'روایت مجموعه' : 'The collection story'}</summary><p>{t(collection.statement, locale)}</p><Link href={`/${locale}/collections/${design.collection}`}>{fa ? 'کشف مجموعه' : 'Explore the collection'} <ArrowUpRight size={15} /></Link></details>
          <details><summary>{fa ? 'جزئیات اثر و تصاویر' : 'Artwork & image details'}</summary><p>{fa ? 'نمای کامل، نقش و حاشیه‌های اثر را نشان می‌دهد. تصاویر استایلِ برچسب‌دار با هوش مصنوعی ساخته شده‌اند؛ برای بررسی نقش و رنگ به عکس‌های اصلی مراجعه کنید.' : 'The full artwork reveals the pattern and borders. Labelled styling images are AI visualizations; refer to original photographs for pattern and color.'}</p><p dir="ltr">MUGUETLI / {design.id.toUpperCase()} / {selectedSize} cm</p></details>
          <details><summary>{fa ? 'راهنمای انتخاب و سفارش' : 'Choosing & ordering'}</summary><p>{fa ? 'اندازه را انتخاب کنید. در پیام آماده، کد اثر و اندازهٔ شما ثبت می‌شود. دربارهٔ جنس، موجودی، قیمت و ارسال از ما بپرسید.' : 'Select your size. Your inquiry includes the artwork reference and chosen dimensions. Ask us about fabric, availability, pricing and delivery.'}</p></details>
        </div>
      </aside>
    </div>

    <section className={styles.collectionStory}>
      <div className={styles.storySymbol}>{design.collection !== 'calligraphy' ? <CollectionSigil element={design.collection} index={Number(collection.index) - 1} /> : <span>م</span>}</div>
      <div><span>{fa ? 'از جهان موگه‌تلی' : 'FROM THE WORLD OF MUGUETLI'} / {collection.index}</span><h2>{t(collection.name, locale)}</h2><p>{t(collection.statement, locale)}</p><Link href={`/${locale}/collections/${design.collection}`}>{fa ? 'روایت این مجموعه را بخوانید' : 'Read the collection story'} <ArrowUpRight size={18} /></Link></div>
    </section>
    {related.length > 0 && <section className={styles.related}><div><span>{fa ? 'در همین مجموعه' : 'IN THE SAME COLLECTION'}</span><h2>{fa ? 'اثر بعدی را پیدا کنید.' : 'Continue exploring.'}</h2></div><CatalogGrid locale={locale} items={related} /></section>}
  </main>;
}
