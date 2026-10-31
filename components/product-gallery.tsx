'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, ZoomIn } from 'lucide-react';
import { t, type Locale } from '@/lib/muguetli';
import type { Design, MediaAsset } from '@/lib/catalog';
import styles from './product-detail.module.css';

function label(asset: MediaAsset, fa: boolean) {
  if (asset.kind === 'generated-model') return fa ? 'تصویرسازی استایل با هوش مصنوعی' : 'AI styling visualization';
  if (asset.kind === 'artwork') return fa ? 'نمای کامل اثر' : 'Full artwork';
  return fa ? 'عکس اصلی' : 'Original photograph';
}
export function ProductGallery({ design, locale, pocket }: { design: Design; locale: Locale; pocket: boolean }) {
  const fa = locale === 'fa';
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const asset = design.media[active];
  const move = (delta: number) => { setActive(value => (value + delta + design.media.length) % design.media.length); setZoom(false); };
  useEffect(() => {
    if (window.location.hash === '#styling') {
      const index = design.media.findIndex(item => item.kind === 'generated-model');
      if (index >= 0) setActive(index);
    }
  }, [design]);
  if (!asset) return null;
  const alt = asset.alt ? t(asset.alt, locale) : `${t(design.title, locale)} — ${label(asset, fa)}`;
  const swipe = (end: { clientX: number; clientY: number }) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClickUntil.current = Date.now() + 600;
      move(dx < 0 ? 1 : -1);
    }
  };
  return <section className={styles.gallery} id="styling" aria-label={fa ? 'گالری اثر' : 'Artwork gallery'}>
    <div className={styles.galleryStage} onTouchCancel={() => { touch.current = null; }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => swipe(event.changedTouches[0])}>
      <button className={styles.openImage} aria-label={fa ? 'بزرگ‌نمایی تصویر' : 'Enlarge image'} onClick={() => { if (Date.now() < suppressClickUntil.current) return; dialog.current?.showModal(); setZoom(false); }}><img src={asset.src} alt={alt} width={asset.width ?? 900} height={asset.height ?? 900} fetchPriority="high" /><span><ZoomIn size={18} />{fa ? 'از نزدیک' : 'A closer look'}</span></button>
      <div className={styles.galleryArrows}><button onClick={() => move(-1)} aria-label={fa ? 'تصویر قبلی' : 'Previous image'}><ArrowLeft size={20} /></button><button onClick={() => move(1)} aria-label={fa ? 'تصویر بعدی' : 'Next image'}><ArrowRight size={20} /></button></div>
    </div>
    <div className={styles.galleryCaption} aria-live="polite"><span>{label(asset, fa)}</span><span dir="ltr">{String(active + 1).padStart(2, '0')} / {String(design.media.length).padStart(2, '0')}</span></div>
    <div className={styles.thumbnails}>{design.media.map((item, index) => <button key={`${item.src}-${index}`} aria-label={`${fa ? 'نمایش تصویر' : 'Show image'} ${index + 1}: ${label(item, fa)}`} aria-pressed={active === index} onClick={() => { setActive(index); setZoom(false); }}><img src={item.src} alt="" width={80} height={100} loading="lazy" /></button>)}</div>
    {pocket && asset.kind === 'generated-model' && <p className={styles.stylingNote}>{fa ? 'این تصویر فرم روسری مربع همین طرح را نشان می‌دهد، نه دستمال جیبی.' : 'This styling image shows the square scarf, not the pocket square.'}</p>}
    <dialog ref={dialog} aria-label={fa ? 'نمای بزرگ اثر' : 'Enlarged artwork'} className={styles.lightbox} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } }}>
      <div className={styles.lightboxHeader}><span>{label(asset, fa)} · {active + 1} / {design.media.length}</span><button autoFocus aria-label={fa ? 'بستن گالری' : 'Close gallery'} onClick={() => dialog.current?.close()}><X /></button></div>
      <button className={styles.zoomImage} data-zoom={zoom} aria-label={fa ? 'تغییر بزرگ‌نمایی' : 'Toggle zoom'} onClick={() => { if (Date.now() >= suppressClickUntil.current) setZoom(!zoom); }} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => { if (!zoom) swipe(event.changedTouches[0]); else touch.current = null; }} onTouchCancel={() => { touch.current = null; }}><img src={asset.src} alt={alt} /></button>
      <div className={styles.lightboxControls}><button aria-label={fa ? 'تصویر قبلی' : 'Previous image'} onClick={() => move(-1)}><ArrowLeft /></button><span>{fa ? 'برای جزئیات، روی تصویر بزنید' : 'Tap the image to explore the details'}</span><button aria-label={fa ? 'تصویر بعدی' : 'Next image'} onClick={() => move(1)}><ArrowRight /></button></div>
    </dialog>
  </section>;
}
