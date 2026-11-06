'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BookOpen, Tablet } from 'lucide-react';
import { literaryElements, bookExcerpts } from '@/lib/book-story';
import { editorial, type Collection } from '@/lib/editorial';
import { t, type Locale } from '@/lib/muguetli';
import { BookQuote } from './book-quote';
import { ElementFilm } from './element-film';
import { ScarfGallery } from './scarf-gallery';
import { useMotionPreference } from './motion-preference';
import { useArrivalReady } from './arrival-ready';
import styles from './story-journey.module.css';

function CollectionSigil({ element, index }: { element: string; index: number }) {
  const id = element.toLowerCase();
  return <span className={styles.collectionSigil} data-element={id} aria-hidden="true">
    <span className={styles.sigilCoordinates}>M / {String(index + 1).padStart(2, '0')}</span>
    <svg viewBox="0 0 320 360" role="presentation">
      <rect className={styles.sigilFrame} x="28" y="28" width="264" height="304" rx="132" />
      {id === 'fire' && <>
        <path className={styles.sigilOrbit} d="M60 246C92 319 229 330 273 236C309 157 264 64 174 50C87 37 29 122 49 202" />
        <g className={styles.sigilPrimary}>
          <path d="M165 303C100 273 100 218 136 179C166 146 165 110 151 72C207 105 237 155 216 207C205 181 188 169 174 162C185 207 149 218 160 259C165 244 175 229 194 217C204 255 193 283 165 303Z" />
          <path className={styles.sigilCut} d="M166 282C145 263 146 240 166 218C184 239 187 263 166 282Z" />
        </g>
        <g className={styles.sigilParticles}><circle cx="89" cy="113" r="5" /><circle cx="243" cy="120" r="3" /><circle cx="242" cy="270" r="6" /></g>
      </>}
      {id === 'earth' && <>
        <g className={styles.sigilOrbit}>
          <path d="M48 193C68 99 126 55 210 76C279 94 294 179 253 247C217 307 119 319 66 257C51 239 43 217 48 193Z" />
          <path d="M76 194C91 124 133 92 197 106C249 118 260 180 230 230C202 275 132 283 91 238C79 225 72 209 76 194Z" />
          <path d="M107 193C117 151 144 133 183 141C216 148 221 188 203 217C185 246 141 249 118 222C110 214 105 203 107 193Z" />
        </g>
        <g className={styles.sigilPrimary}>
          <path d="M160 276V188" />
          <path d="M160 207C130 195 119 170 124 142C153 146 169 164 160 207Z" />
          <path d="M160 231C190 218 204 191 197 163C171 169 155 191 160 231Z" />
          <path d="M110 276H210" />
        </g>
        <g className={styles.sigilParticles}><circle cx="95" cy="112" r="4" /><circle cx="233" cy="242" r="5" /><circle cx="238" cy="99" r="2" /></g>
      </>}
      {id === 'water' && <>
        <g className={styles.sigilOrbit}>
          <circle cx="160" cy="182" r="126" /><circle cx="160" cy="182" r="94" /><circle cx="160" cy="182" r="61" />
        </g>
        <g className={styles.sigilPrimary}>
          <path d="M79 187C113 147 144 148 171 181C196 211 218 213 244 188" />
          <path d="M79 218C111 183 142 183 171 214C197 241 219 241 244 217" />
          <path d="M160 89C160 89 201 139 201 169C201 193 183 211 160 211C137 211 119 193 119 169C119 139 160 89 160 89Z" />
        </g>
        <g className={styles.sigilParticles}><circle cx="83" cy="126" r="5" /><circle cx="237" cy="116" r="3" /><circle cx="235" cy="269" r="6" /></g>
      </>}
      {id === 'wind' && <>
        <path className={styles.sigilOrbit} d="M54 227C83 299 188 326 254 265C318 207 290 91 206 58C119 24 42 92 45 175" />
        <g className={styles.sigilPrimary}>
          <path d="M68 151C111 151 120 122 113 101C150 107 167 127 161 151H253" />
          <path d="M54 184H217C248 184 253 151 233 140" />
          <path d="M77 218H188C219 218 225 250 205 264" />
          <path d="M109 251H163" />
        </g>
        <g className={styles.sigilParticles}><circle cx="78" cy="111" r="5" /><circle cx="252" cy="109" r="3" /><circle cx="258" cy="246" r="6" /></g>
      </>}
    </svg>
    <span className={styles.sigilAxis} />
  </span>;
}

export function StoryJourney({ locale, collections }: { locale: Locale; collections: Collection[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const arrivalReady = useArrivalReady();
  const [layoutRevision, setLayoutRevision] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const resized = () => { clearTimeout(timer); timer = setTimeout(() => { if (alive) setLayoutRevision(value => value + 1); }, 180); };
    window.addEventListener('resize', resized);
    void document.fonts.ready.then(resized);
    return () => { alive = false; clearTimeout(timer); window.removeEventListener('resize', resized); };
  }, []);
  const fa = locale === 'fa';
  const copy = (en: string, persian: string) => fa ? persian : en;
  const collectionLabel = (collection: Collection) => collection.localizedName ? t(collection.localizedName, locale) : collection.name;
  const collectionHref = (collection: Collection) => collection.url.replace(/^\/en(?=\/|$)/, `/${locale}`);
  const book = editorial.book;
  const featuredCollections = collections.slice(0, 4);
  const chapterLinks = [
    ...literaryElements.map(element => ({ id: `chapter-${element.id}`, label: t(element.name, locale) })),
    { id: 'collections', label: copy('Scarves', 'روسری‌ها') },
    { id: 'books', label: copy('The book', 'کتاب') },
  ];

  useLayoutEffect(() => {
    if (reduced || !arrivalReady || !root.current || !track.current) return;
    const host = root.current;
    const rail = track.current;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add('(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = Array.from(rail.querySelectorAll<HTMLElement>('[data-panel]'));
      host.style.setProperty('--panel-width', `${host.clientWidth}px`);
      host.dataset.horizontal = 'true';
      // Never clip content at enlarged text sizes or when a translation needs more room.
      if (panels.some(panel => panel.scrollHeight > panel.clientHeight + 2)) {
        delete host.dataset.horizontal;
        return;
      }
      const reveals = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>('[data-panel-reveal]')));
      const artwork = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>('[data-panel-art]')));
      const collectionPanelIndex = panels.findIndex(panel => panel.hasAttribute('data-collection-chapter'));
      const overflow = () => Math.max(0, rail.scrollWidth - host.clientWidth);
      const startX = () => fa ? -overflow() : 0;
      const endX = () => fa ? 0 : -overflow();
      const movement = gsap.fromTo(rail, { x: startX }, {
        x: endX, ease: 'none',
        scrollTrigger: {
          trigger: host, start: 'top top', end: () => `+=${overflow()}`, pin: true, scrub: true,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => {
            const position = self.progress * (panels.length - 1);
            const index = Math.min(panels.length - 1, Math.round(position));
            reveals.forEach((items, panelIndex) => {
              const visibility = Math.max(0, 1 - Math.abs(panelIndex - position));
              items.forEach(item => { item.style.opacity = String(.4 + .6 * visibility); item.style.transform = 'translateY(' + (34 * (1 - visibility)) + 'px)'; });
            });
            artwork.forEach((items, panelIndex) => items.forEach((item, i) => { item.style.transform = 'translateY(' + ((panelIndex - position) * (i ? -18 : 18)) + 'px)'; }));
            if (collectionPanelIndex >= 0) {
              const collectionProgress = Math.max(0, Math.min(1, position - collectionPanelIndex + .5));
              host.style.setProperty('--collection-scrub', String(collectionProgress));
              host.style.setProperty('--collection-shift', `${(.5 - collectionProgress) * host.clientWidth * .05}px`);
              host.style.setProperty('--collection-hint-shift', `${(collectionProgress - .5) * 20}px`);
              host.style.setProperty('--collection-rotation', `${(collectionProgress - .5) * 8}deg`);
            }
            host.dataset.activeIndex = String(index);
            host.style.setProperty('--journey-progress', String(self.progress));
            host.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]').forEach(link => {
              const target = panels[index]?.id;
              const active = link.hash === `#${target}` || (target === 'scarves' && link.hash === '#collections') || (target === 'editions' && link.hash === '#books');
              if (active) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
            });
          },
        },
      });
      const showPanel = (target: HTMLElement, focus = true, writeHistory = true) => {
        const panel = target.closest<HTMLElement>('[data-panel]');
        const index = panel ? panels.indexOf(panel) : -1;
        const trigger = movement.scrollTrigger;
        if (index < 0 || !trigger) return false;
        const position = trigger.start + index / (panels.length - 1) * (trigger.end - trigger.start);
        window.dispatchEvent(new CustomEvent('muguetli:scroll', { detail: { top: position } }));
        ScrollTrigger.update();
        if (writeHistory) history.pushState(history.state, '', `#${target.id}`);
        if (focus) { if (!target.hasAttribute('tabindex')) target.tabIndex = -1; target.focus({ preventScroll: true }); }
        return true;
      };
      const navigate = (event: Event) => {
        const id = (event as CustomEvent<{ id: string }>).detail?.id;
        const target = id ? document.getElementById(id) : null;
        if (target && host.contains(target) && showPanel(target)) event.preventDefault();
      };
      const focusPanel = (event: FocusEvent) => {
        if (event.target instanceof HTMLElement && rail.contains(event.target)) showPanel(event.target, false, false);
      };
      const restoreHash = () => {
        let id = '';
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (target && host.contains(target)) showPanel(target, false, false);
      };
      window.addEventListener('muguetli:anchor', navigate);
      window.addEventListener('hashchange', restoreHash);
      window.addEventListener('popstate', restoreHash);
      rail.addEventListener('focusin', focusPanel);
      let alive = true;
      const refresh = () => { if (alive) ScrollTrigger.refresh(); };
      // Every panel image has intrinsic dimensions, so late image loads do not
      // change the rail geometry. Refreshing the pinned trigger for each lazy
      // image can move its spacer while Lenis is still scrolling, which makes
      // the end boundary jump when the journey is entered again in reverse.
      // Font readiness already increments layoutRevision and recreates this
      // trigger once with the final measurements.
      void document.fonts.ready.then(() => { if (alive) restoreHash(); });
      window.addEventListener('pageshow', refresh);
      return () => {
        alive = false;
        window.removeEventListener('pageshow', refresh);
        window.removeEventListener('muguetli:anchor', navigate);
        window.removeEventListener('hashchange', restoreHash);
        window.removeEventListener('popstate', restoreHash);
        rail.removeEventListener('focusin', focusPanel);
        delete host.dataset.horizontal;
      };
      });
      cleanup = () => {
        media.revert();
        rail.querySelectorAll<HTMLElement>('[data-panel-reveal], [data-panel-art]').forEach(item => {
          ['opacity', 'transform', 'translate', 'rotate', 'scale'].forEach(property => item.style.removeProperty(property));
        });
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, fa, collections.length, layoutRevision, arrivalReady]);

  useEffect(() => {
    const host = root.current;
    const chapter = host?.querySelector<HTMLElement>('[data-collection-chapter]');
    if (!chapter || reduced || !arrivalReady || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const writePointer = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        chapter.style.setProperty('--pointer-x-small', `${(x * 14).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-x-small-neg', `${(x * -14).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-y-small', `${(y * 12).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-y-small-neg', `${(y * -12).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-x-large', `${(x * 38).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-x-large-neg', `${(x * -38).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-y-large', `${(y * 34).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-y-large-neg', `${(y * -34).toFixed(2)}px`);
        chapter.style.setProperty('--pointer-rotate', `${(x * 1.2).toFixed(2)}deg`);
        chapter.style.setProperty('--pointer-rotate-neg', `${(x * -1.2).toFixed(2)}deg`);
      });
    };
    const move = (event: PointerEvent) => {
      const bounds = chapter.getBoundingClientRect();
      writePointer((event.clientX - bounds.left) / bounds.width - .5, (event.clientY - bounds.top) / bounds.height - .5);
    };
    const reset = () => writePointer(0, 0);
    chapter.addEventListener('pointermove', move, { passive: true });
    chapter.addEventListener('pointerleave', reset);
    return () => {
      cancelAnimationFrame(frame);
      chapter.removeEventListener('pointermove', move);
      chapter.removeEventListener('pointerleave', reset);
    };
  }, [reduced, collections.length, arrivalReady]);

  return <section ref={root} className={styles.journey} data-journey data-active-index="0" aria-label={copy('From the elements to the everyday', 'از عناصر تا زندگی')}>
    <div className={styles.navigation}>
      <span className={styles.navCaption}>{copy('A RITE OF PASSAGE', 'یک آیین گذار')}</span>
      <nav aria-label={copy('Journey chapters', 'فصل‌های سفر')}>{chapterLinks.map(link => <a key={link.id} data-chapter-link href={`#${link.id}`}>{link.label}</a>)}</nav>
      <a className={styles.skip} href="#founder">{copy('Meet the artist', 'دیدار با هنرمند')}<ArrowDown size={15} /></a>
    </div>
    <div ref={track} className={styles.track}>
      {literaryElements.map((element, i) => <article id={`chapter-${element.id}`} tabIndex={-1} key={element.id} data-panel data-surface="light" className={`${styles.panel} ${styles.element}`}>
        <div className={styles.elementArt}>
          <span className={styles.giantWord} aria-hidden="true">{t(element.name, locale)}</span>
          <img src={`/media/four-mothers/${element.id}-key.webp`} alt="" width={1280} height={720} loading="lazy" decoding="async" />
          <span className={styles.artCaption}>MUGUETLI / {String(i + 1).padStart(2, '0')}</span>
        </div>
        <div className={styles.elementCopy}>
          <p className={styles.eyebrow} data-panel-reveal>{copy('THE FOUR MOTHERS', 'چهار مادر')} / {t(element.name, locale)}</p>
          <h2 data-panel-reveal>{t(element.title, locale)}</h2>
          <div className={styles.passage} data-panel-reveal><BookQuote excerpt={element.excerpt} locale={locale} compact /></div>
          <ElementFilm element={element.id} locale={locale} />
          <Link className={styles.textLink} href={`/${locale}/mythology#${element.id}`}>{copy('Inside the story', 'درون داستان')}<ArrowUpRight size={17} /></Link>
        </div>
      </article>)}

      {([['rust', 'red'], ['indigo', 'olive']] as const).map((ids, i) => <article key={ids[0]} id={i ? 'scarves' : 'collections'} tabIndex={-1} data-panel data-surface="light" className={`${styles.panel} ${styles.products}`}>
        <div className={styles.productIntro} data-panel-reveal>
          <p className={styles.eyebrow}>{copy('ART, IN ANOTHER FORM', 'هنر، در شکلی دیگر')}</p>
          <h2>{i ? copy('A world in every fold.', 'در هر تا، جهانی‌ست.') : copy('Wear the story.', 'داستان را بپوش.')}</h2>
          <p>{i ? copy('Illustrated worlds. Personal expression.', 'جهان‌های مصور. بیان شخصی.') : copy('Art leaves the frame. The next chapter is yours.', 'هنر از قاب بیرون می‌آید. فصل بعدی از آنِ توست.')}</p>
          <Link className={styles.textLink} href={`/${locale}/collections`}>{copy('Explore the collection', 'دیدن مجموعه')}<ArrowUpRight size={17} /></Link>
        </div>
        <div className={styles.scarves}><ScarfGallery locale={locale} ids={[...ids]} cinematic /></div>
      </article>)}

      {featuredCollections.length > 0 && <article id="connected-collections" tabIndex={-1} data-panel data-collection-chapter data-surface="light" className={`${styles.panel} ${styles.collectionChapter}`}>
        <div className={styles.collectionAtmosphere} aria-hidden="true">
          <span className={styles.pointerBloom} />
          <span className={`${styles.orbit} ${styles.orbitOne}`}><i /></span>
          <span className={`${styles.orbit} ${styles.orbitTwo}`}><i /></span>
          <span className={styles.drawnThread}><i /><i /><i /></span>
        </div>
        <header className={styles.collectionIntro} data-panel-reveal>
          <div>
            <p className={styles.eyebrow}>{copy('FOUR WORLDS / ONE INNER JOURNEY', 'چهار جهان / یک سفر درونی')}</p>
            <h2>{copy('The collections', 'مجموعه‌ها')}</h2>
          </div>
          <div className={styles.collectionStatement}>
            <p>{copy('Fire, earth, water and wind are not separate chapters. Together, they trace one passage from transformation to release.', 'آتش، خاک، آب و باد فصل‌های جدا از هم نیستند؛ کنار هم، مسیری از دگرگونی تا رهایی می‌سازند.')}</p>
            <Link className={styles.textLink} href={`/${locale}/collections`}>{copy('Enter all four worlds', 'ورود به چهار جهان')}<ArrowUpRight size={17} /></Link>
          </div>
        </header>
        <div className={styles.collectionRail}>
          {featuredCollections.map((collection, i) => <a className={styles.collectionCard} key={collection.id} href={collectionHref(collection)}>
            <span className={styles.collectionNumber}>{String(i + 1).padStart(2, '0')}</span>
            <CollectionSigil element={collection.name} index={i} />
            <span className={styles.collectionCardCopy}>
              <span><strong>{collectionLabel(collection)}</strong><small>{collection.localizedDescription ? t(collection.localizedDescription, locale) : collection.description}</small></span>
              <ArrowUpRight size={20} />
            </span>
          </a>)}
        </div>
        <p className={styles.collectionHint}>{copy('Scroll to move through the field', 'برای عبور از این میدان اسکرول کنید')} <span aria-hidden="true">→</span></p>
      </article>}

      <article id="books" tabIndex={-1} data-panel data-surface="light" className={`${styles.panel} ${styles.book}`}>
        <div className={styles.bookArtwork} data-panel-art>
          <picture>
            <source media="(max-width: 700px)" srcSet="/media/books/book-banner-mobile-v1.webp" width={1024} height={1536} />
            <img src="/media/books/book-banner-desktop-v1.webp" width={1536} height={1024} loading="lazy" decoding="async" alt={copy('Persian and English books on stone stands, surrounded by clouds, sea and lily of the valley', 'کتاب‌های فارسی و انگلیسی روی استندهای سنگی، میان ابرها، دریا و گل‌های موگه')} />
          </picture>
        </div>
        <div className={styles.bookCopy}>
          <div className={styles.bookIdentity} data-panel-reveal>
            <p className={styles.eyebrow}>{copy('THE STORY BEFORE THE SILK', 'داستان، پیش از پوشیدن')}</p>
            <h2 lang="fa" dir="rtl">{book?.originalTitle || 'زنگله‌ام'}</h2>
            {!fa && <p className={styles.transliteration}>Zangole’am</p>}
            <p className={styles.subtitle}>{book && t(book.subtitle, locale)}</p>
            <span className={styles.byline}>{book && t(book.author, locale)} · {copy('Originally written in Persian', 'به زبان فارسی')}</span>
            <Link href={`/${locale}/books`} className={styles.textLink}>{copy('Enter the book', 'ورود به جهان کتاب')}<ArrowUpRight size={17} /></Link>
          </div>
          <div className={styles.bookPassage} data-panel-reveal>
            <p>{book && t(book.synopsis, locale)}</p>
            <div className={styles.bookQuote}><p className={styles.eyebrow}>{copy('THE ALCHEMY OF SUFFERING', 'جواهرِ وجود و کیمیاگریِ رنج')}</p><BookQuote excerpt={bookExcerpts.rebirth} locale={locale} compact /></div>
          </div>
        </div>
      </article>
      <article id="editions" tabIndex={-1} data-panel data-surface="light" className={`${styles.panel} ${styles.editions}`}>
        <div className={styles.editionHeading}><p className={styles.eyebrow}>{copy('TWO WAYS INTO ONE WORLD', 'دو راه به یک جهان')}</p><h2>{copy('Keep the story close.', 'داستان را نزدیک نگه دار.')}</h2></div>
        <div className={styles.editionGrid}>{[
          { name: copy('The physical book', 'کتاب چاپی'), title: copy('To hold.', 'برای لمس‌کردن.'), text: copy('A place on your bookshelf. A world to return to.', 'جایی در کتابخانه‌ات؛ جهانی برای بازگشتن.'), url: book?.url, href: `/${locale}/books`, icon: BookOpen },
          { name: copy('The eBook', 'کتاب الکترونیکی'), title: copy('To take along.', 'برای همراه‌داشتن.'), text: copy('The same world, wherever you find a moment to read.', 'همان جهان، هر کجا که فرصتی برای خواندن پیدا کنی.'), url: book?.ebookUrl, href: `/${locale}/ebook`, icon: Tablet },
        ].map((edition, i) => <div key={edition.name} className={styles.edition} data-panel-reveal>
          <div className={styles.editionTop}><span>0{i + 1} / {edition.name}</span><edition.icon size={27} strokeWidth={1} /></div>
          <h3>{edition.title}</h3><p>{edition.text}</p><small>{copy('Persian text', 'متن فارسی')}</small>
          {edition.url ? <a href={edition.url} className={styles.textLink}>{copy(i ? 'Get the eBook' : 'Buy the book', i ? 'دریافت کتاب' : 'خرید کتاب')}<ArrowUpRight size={17} /></a> : <><p className={styles.availability}>{copy(i ? 'Download not yet available' : 'Purchase not yet available', i ? 'دانلود هنوز در دسترس نیست' : 'خرید هنوز در دسترس نیست')}</p><Link className={styles.textLink} href={edition.href}>{copy('Read about this edition', 'دربارهٔ این نسخه')}<ArrowUpRight size={17} /></Link></>}
        </div>)}</div>
        <a className={styles.continue} href="#founder">{copy('Behind this world, a woman.', 'پشت این جهان، یک زن.')}<ArrowDown size={18} /></a>
      </article>
    </div>
    <div className={styles.progress} aria-hidden="true"><span /></div>
  </section>;
}
