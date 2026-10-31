'use client';

import { useState } from 'react';
import { Search, Heart, Grid2X2, Columns2 } from 'lucide-react';
import { SaveArtwork, useSavedArtworks } from './saved-artworks';
import { CollectionSigil } from './shop-sigil';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import {
  collectionIds, collectionMeta, coverFor, designsFor, productHref, productTypes, stylingFor,
  sizeOptions, type CollectionId, type Design, type ProductType,
} from '@/lib/catalog';
import { t, type Locale } from '@/lib/muguetli';
import styles from './catalog-page.module.css';

function count(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en').format(value);
}

type CatalogView = 'textile' | 'styled';

function filterHref(locale: Locale, collection?: CollectionId, type?: ProductType, view: CatalogView = 'textile') {
  const params = new URLSearchParams();
  if (collection) params.set('collection', collection);
  if (type) params.set('type', type);
  if (view === 'styled') params.set('view', view);
  return `/${locale}/products${params.size ? `?${params}` : ''}`;
}

export function CatalogGrid({ locale, items, emptyText, view = 'textile', type }: { locale: Locale; items: Design[]; emptyText?: string; view?: CatalogView; type?: ProductType }) {
  const fa = locale === 'fa';
  if (!items.length) return <div className={styles.empty}><span>00 / MUGUETLI</span><p>{emptyText ?? (fa ? 'در این ترکیب هنوز اثری برای نمایش نیست.' : 'There is no artwork in this combination yet.')}</p></div>;

  return <div className={styles.grid}>
    {items.map((design, index) => {
      const artwork = (view === 'styled' ? stylingFor(design) : undefined) ?? coverFor(design);
      const generated = artwork?.kind === 'generated-model';
      const alternate = view === 'styled' ? coverFor(design) : stylingFor(design);
      const selectedSize = type
        ? design.options.find(option => option.type === type)?.code
        : generated ? design.options.find(option => option.type === 'square-scarf')?.code : undefined;
      return <article className={styles.productCard} key={design.id}><SaveArtwork id={design.id} locale={locale} className={styles.saveButton} /><Link href={`${productHref(locale, design, selectedSize)}${generated ? '#styling' : ''}`} className={styles.card}>
        <div data-has-alternate={Boolean(alternate && alternate.src !== artwork?.src)} className={`${styles.cardImage}${view === 'styled' ? ` ${styles.portraitImage}` : ''}`}>
          {artwork ? generated
            ? <Image src={artwork.src} alt={artwork.alt ? t(artwork.alt, locale) : t(design.title, locale)} width={artwork.width ?? 1024} height={artwork.height ?? 1536} sizes="(max-width: 760px) 44vw, (max-width: 1100px) 29vw, 22vw" loading={index < 4 ? 'eager' : 'lazy'} />
            : <img src={artwork.src} alt={artwork.alt ? t(artwork.alt, locale) : t(design.title, locale)} width={artwork.width ?? 900} height={artwork.height ?? 900} loading="lazy" />
            : <span>{t(collectionMeta[design.collection].name, locale)}</span>}
          {alternate && alternate.src !== artwork?.src && <img className={styles.hoverImage} src={alternate.src} alt="" aria-hidden="true" width={1024} height={1536} loading="lazy" />}
          {alternate && alternate.src !== artwork?.src && <span className={styles.hoverLabel}>{view === 'styled' ? (fa ? 'نمای پارچه' : 'Textile view') : (fa ? 'تصویرسازی استایل' : 'AI styling')}</span>}
          {generated && <span className={styles.imageLabel}>{fa ? 'تصویرسازی استایل' : 'AI styling'}</span>}
        </div>
        <div className={styles.cardMeta}>
          <span>{collectionMeta[design.collection].index} / {String(design.number).padStart(2, '0')}</span>
          <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" />
        </div>
        <h3>{t(design.title, locale)}</h3>
        <p>{design.options.filter(option => !type || option.type === type).map(option => `${t(option.label, locale)} ${option.widthCm} × ${option.heightCm}`).join(' · ')}</p>
      </Link></article>;
    })}
  </div>;
}

export function CollectionIndex({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  return <section className={styles.collectionIndex} aria-label={fa ? 'مجموعه‌های آثار' : 'Artwork collections'}>
    <div className={styles.sectionHeading}><span>01 / {fa ? 'مجموعه‌ها' : 'COLLECTIONS'}</span><h2>{fa ? 'پنج راه برای ورود به اثر.' : 'Five ways into the work.'}</h2></div>
    <div className={styles.collectionGrid}>
      {collectionIds.map(id => {
        const collection = collectionMeta[id];
        const items = designsFor(id);
        const artwork = items[0] && coverFor(items[0]);
        return <Link href={`/${locale}/collections/${id}`} key={id} className={styles.collectionCard}>
          <span className={styles.collectionNumber}>{collection.index} / {count(items.length, locale)}</span>
          <div className={styles.collectionArt}>
            {artwork ? <img src={artwork.src} alt="" width={artwork.width ?? 900} height={artwork.height ?? 900} loading="lazy" /> : <span aria-hidden="true">{collection.index}</span>}
          </div>
          <h3>{t(collection.name, locale)}</h3>
          <p>{t(collection.statement, locale)}</p>
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>;
      })}
    </div>
  </section>;
}

export function CatalogPage({ locale, collection, type, invalidFilter = false, view = 'textile' }: { locale: Locale; collection?: CollectionId; type?: ProductType; invalidFilter?: boolean; view?: CatalogView }) {
  const fa = locale === 'fa';
  const [search, setSearch] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [editorial, setEditorial] = useState(false);
  const { saved } = useSavedArtworks();
  const allItems = invalidFilter ? [] : designsFor(collection, type);
  const normalized = search.trim().toLocaleLowerCase().replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
  const items = allItems.filter(item => (!savedOnly || saved.includes(item.id)) && (!normalized || [item.id, item.title.en, item.title.fa.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))].some(value => value.toLocaleLowerCase().includes(normalized))));
  return <main className={styles.page} dir={fa ? 'rtl' : 'ltr'}>
    <nav className={styles.breadcrumb}><Link href={`/${locale}`}>{fa ? 'خانه' : 'Home'}</Link><span>/</span><span>{fa ? 'فروشگاه' : 'The shop'}</span></nav>
    <header className={styles.hero}>
      <div><span>{fa ? 'موگه‌تلی / هنر پوشیدنی' : 'MUGUETLI / WEARABLE ART'}</span><h1>{fa ? 'نقشی برای پوشیدن.' : 'Art, to be worn.'}</h1></div>
      <p>{fa ? 'از یک نقش شروع کنید. میان روسری‌ها، شال‌ها و دستمال‌های جیبی، اثر نزدیک به خودتان را پیدا کنید.' : 'Start with a pattern. Find a little of yourself in our scarves, shawls and pocket squares.'}</p>
    </header>

    <section className={styles.categoryEntrances} aria-label={fa ? 'انتخاب فرم' : 'Explore by form'}>
      {(['square-scarf', 'long-shawl', 'pocket-square'] as ProductType[]).map((id, index) => {
        const option = Object.values(sizeOptions).find(item => item.type === id)!;
        const design = designsFor(undefined, id)[index === 2 ? 7 : index === 1 ? 2 : 0];
        const art = id === 'pocket-square' ? coverFor(design) : stylingFor(design) ?? coverFor(design);
        return <Link key={id} href={filterHref(locale, collection, id, view)} aria-current={type === id ? 'page' : undefined}>
          <div className={styles.categoryImage}>{art && <img src={art.src} alt={art.kind === 'generated-model' ? (fa ? 'تصویرسازی استایل با هوش مصنوعی' : 'AI styling visualization') : t(option.label, locale)} width={600} height={800} />}{art?.kind === 'generated-model' && <small>{fa ? 'تصویرسازی استایل' : 'AI styling'}</small>}</div>
          <div><span>{t(option.label, locale)}</span><ArrowUpRight size={17} /></div><small dir="ltr">{option.widthCm} × {option.heightCm} cm</small>
        </Link>;
      })}
      <div className={styles.categoryAside}><span>THE MUGUETLI EDIT</span><p>{fa ? 'یک اثر، بخشی از روایت شما.' : 'An artwork. A part of your story.'}</p><a href="#catalog-results">{fa ? 'دیدن همهٔ آثار' : 'Explore the artworks'} ↓</a></div>
    </section>

    <div className={styles.filters} aria-label={fa ? 'فیلتر آثار' : 'Filter artworks'}>
      <div className={styles.filterGroup}><span>{fa ? 'مجموعه' : 'COLLECTION'}</span><div className={styles.filterChoices}>
        <Link href={filterHref(locale, undefined, type, view)} aria-current={!collection && !invalidFilter ? 'page' : undefined}>{fa ? 'همه' : 'All'}</Link>
        {collectionIds.map(id => <Link key={id} href={filterHref(locale, id, type, view)} aria-current={collection === id && !invalidFilter ? 'page' : undefined}>{id !== 'calligraphy' && <span className={styles.filterSigil}><CollectionSigil element={id} index={collectionIds.indexOf(id)} /></span>}{t(collectionMeta[id].name, locale)}</Link>)}
      </div></div>
      <div className={styles.filterGroup}><span>{fa ? 'فرم و اندازه' : 'FORM & SIZE'}</span><div className={styles.filterChoices}>
        <Link href={filterHref(locale, collection, undefined, view)} aria-current={!type && !invalidFilter ? 'page' : undefined}>{fa ? 'همه' : 'All'}</Link>
        {productTypes.map(id => {
          const option = Object.values(sizeOptions).find(item => item.type === id)!;
          return <Link key={id} href={filterHref(locale, collection, id, view)} aria-current={type === id && !invalidFilter ? 'page' : undefined}>{t(option.label, locale)} <small>{option.widthCm} × {option.heightCm}</small></Link>;
        })}
      </div></div>
    </div>

    <section id="catalog-results" className={`${styles.results} ${editorial ? styles.editorial : ''}`}>
      <div className={styles.shopTools}>
        <label className={styles.search}><Search size={17} /><input aria-label={fa ? 'جست‌وجوی نام یا کد اثر' : 'Search name or design code'} placeholder={fa ? 'نام یا کد اثر را جست‌وجو کنید' : 'Find a name or design code'} value={search} onChange={event => setSearch(event.target.value)} />{search && <button aria-label={fa ? 'پاک‌کردن جست‌وجو' : 'Clear search'} onClick={() => setSearch('')}>×</button>}</label>
        <button className={styles.savedFilter} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Heart size={16} />{fa ? 'پسندیده‌ها' : 'Saved'} <span>({count(saved.length, locale)})</span></button>
        <div className={styles.layoutSwitch} aria-label={fa ? 'چیدمان آثار' : 'Catalogue layout'}><button aria-pressed={!editorial} onClick={() => setEditorial(false)}><Grid2X2 size={16} />{fa ? 'شبکه‌ای' : 'Grid'}</button><button aria-pressed={editorial} onClick={() => setEditorial(true)}><Columns2 size={16} />{fa ? 'گالری' : 'Gallery'}</button></div>
      </div>
      <div className={styles.resultsHeading}><span role="status" aria-live="polite" aria-atomic="true">{count(items.length, locale)} {fa ? 'اثر' : items.length === 1 ? 'ARTWORK' : 'ARTWORKS'}</span><Link href={`/${locale}/size-guide`}>{fa ? 'راهنمای اندازه' : 'Size guide'} <ArrowUpRight size={16} /></Link></div>
      <nav className={styles.viewSwitch} aria-label={fa ? 'نوع نمایش تصاویر' : 'Image view'}>
        <Link href={`${filterHref(locale, collection, type)}#catalog-results`} aria-current={view === 'textile' ? 'page' : undefined}>{fa ? 'نمای پارچه' : 'Textile'}</Link>
        <Link href={`${filterHref(locale, collection, type, 'styled')}#catalog-results`} aria-current={view === 'styled' ? 'page' : undefined}>{fa ? 'روی مدل' : 'Styled'}</Link>
      </nav>
      {view === 'styled' && <p className={styles.stylingNote}>{fa ? 'پیشنهادهایی برای پوشیدن هر طرح؛ تصویرسازی‌شده با کمک هوش مصنوعی. عکس‌های اصلی در صفحهٔ هر اثر در دسترس‌اند.' : 'Styling suggestions created with AI. Original textile photographs and artwork are available on each detail page.'}</p>}
      {view === 'styled' && type === 'pocket-square' && <p className={styles.stylingNote}>{fa ? 'این پرتره‌ها، فرم روسری مربع همین طرح‌ها را نشان می‌دهند؛ اندازهٔ انتخابی شما در صفحهٔ اثر حفظ می‌شود.' : 'These portraits show the square-scarf form of the same designs. Your selected size carries through to the detail page.'}</p>}
      {(search || savedOnly || collection || type || invalidFilter) && <div className={styles.activeFilters}><span>{fa ? 'انتخاب شما' : 'YOUR SELECTION'}</span>{collection && <span>{t(collectionMeta[collection].name, locale)}</span>}{type && <span>{t(Object.values(sizeOptions).find(item => item.type === type)!.label, locale)}</span>}<Link href={filterHref(locale, undefined, undefined, view)} onClick={() => { setSearch(''); setSavedOnly(false); }}>{fa ? 'پاک‌کردن فیلترها' : 'Clear filters'} ×</Link></div>}
      <CatalogGrid locale={locale} items={items} view={view} type={type} emptyText={savedOnly && !items.length ? (fa ? 'اثری از پسندیده‌های شما با این فیلترها پیدا نشد. فیلترها را پاک کنید یا با نشان قلب اثری ذخیره کنید.' : 'No saved artworks match these filters. Clear the filters or save a piece with the heart button.') : search && !items.length ? (fa ? 'اثری با این نام یا کد پیدا نشد. جست‌وجوی دیگری امتحان کنید.' : 'No artwork matches that name or code. Try another search.') : invalidFilter ? (fa ? 'این فیلتر شناخته‌شده نیست. از گزینه‌های بالا انتخاب کنید.' : 'This filter is not recognized. Choose from the options above.') : undefined} />
    </section>
    <section className={styles.archiveFeature} aria-labelledby="archive-feature-title">
      <img src="/media/pre-collection/pistachio-model-front.webp" alt={fa ? 'عکس اصلی روسری پسته‌ای از آرشیو Pre' : 'Original modeled pistachio scarf from the Pre collection archive'} width={1200} height={1800} loading="lazy" />
      <div><span>{fa ? 'آرشیو جداگانه / مجموعهٔ Pre' : 'SEPARATE ARCHIVE / PRE COLLECTION'}</span><h2 id="archive-feature-title">{fa ? 'نگاهی به پیش از مجموعه‌ها.' : 'A look into the Pre collection.'}</h2><p>{fa ? 'عکس‌های بیشتری از آرشیو روسری‌ها را ببینید. این آثار در شماره‌گذاری ۷۵ طرح پنج مجموعهٔ اصلی حساب نمی‌شوند.' : 'Explore additional scarf photographs from the archive. These studies are separate from the 75 numbered designs in the five main collections.'}</p><Link href={`/${locale}/archive`}>{fa ? 'دیدن آرشیو' : 'Explore the archive'}<ArrowUpRight size={17} /></Link></div>
    </section>
    <footer className={styles.footerNote}><p>{fa ? 'برای این آثار قیمت عمومی یا سبد خرید نمایش داده نمی‌شود. مسیر انتخاب از یک گفت‌وگوی خصوصی می‌گذرد.' : 'These artworks are presented through private inquiry. Select a design and size to begin a conversation.'}</p><Link href={`/${locale}/contact`}>{fa ? 'گفت‌وگوی خصوصی' : 'Private inquiry'} <ArrowUpRight size={17} /></Link></footer>
  </main>;
}
