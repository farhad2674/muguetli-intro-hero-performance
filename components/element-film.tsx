'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X } from 'lucide-react';
import type { Locale } from '@/lib/muguetli';
import styles from './element-film.module.css';

const films = {
  fire: { en: 'Fire', fa: 'آتش', file: 'fire' },
  earth: { en: 'Earth', fa: 'خاک', file: 'earth' },
  water: { en: 'Water', fa: 'آب', file: 'water' },
  air: { en: 'Wind', fa: 'باد', file: 'wind' },
  wind: { en: 'Wind', fa: 'باد', file: 'wind' },
} as const;

export function ElementFilm({ element, locale }: { element: string; locale: Locale }) {
  const film = films[element as keyof typeof films];
  const [requested, setRequested] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const fa = locale === 'fa';

  useEffect(() => {
    if (!requested || !film) return;
    const modal = dialog.current;
    const player = video.current;
    const button = trigger.current;
    if (!modal || !player) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    // The source is attached only after an explicit request, never on mount or scroll.
    player.src = `/media/elements/${film.file}.mp4`;
    void player.play().catch(() => { /* Native controls remain available if play is blocked. */ });
    return () => {
      player.pause();
      player.removeAttribute('src');
      player.load();
      modal.close();
      document.body.style.overflow = overflow;
      if (button?.isConnected) button.focus({ preventScroll: true });
    };
  }, [requested, film]);

  if (!film) return null;
  const title = fa ? `فیلم ${film.fa}` : `${film.en} film`;
  return <>
    <button ref={trigger} type="button" className={styles.trigger} aria-haspopup="dialog" onClick={() => { setStatus('loading'); setRequested(true); }}>
      <Play size={18} aria-hidden="true" />
      <span>{fa ? `تماشای فیلم ${film.fa}` : `Watch ${film.en.toLowerCase()} film`}</span>
    </button>
    {requested && createPortal(<dialog ref={dialog} className={styles.dialog} dir={fa ? 'rtl' : 'ltr'} aria-labelledby={titleId} data-lenis-prevent onCancel={event => { event.preventDefault(); setRequested(false); }} onClose={() => setRequested(false)}>
      <div className={styles.content}>
        <header className={styles.header}><h2 id={titleId}>{title}</h2><button type="button" autoFocus className={styles.close} aria-label={fa ? 'بستن فیلم' : 'Close film'} onClick={() => setRequested(false)}><X size={22} aria-hidden="true" /></button></header>
        {/* Supplied element films contain no audio track or spoken content. */}
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={video} className={styles.video} controls playsInline preload="none" aria-label={title} onWaiting={() => setStatus('loading')} onCanPlay={() => setStatus('ready')} onPlaying={() => setStatus('ready')} onError={() => setStatus('error')} />
        <output className={styles.status}>{status === 'loading' ? (fa ? 'در حال بارگذاری فیلم…' : 'Loading film…') : status === 'error' ? (fa ? 'فیلم بارگذاری نشد. ببندید و دوباره امتحان کنید.' : 'The film could not load. Close and try again.') : (fa ? 'پخش را از کنترل‌های فیلم تنظیم کنید.' : 'Use the player controls for playback.')}</output>
      </div>
    </dialog>, document.body)}
  </>;
}
