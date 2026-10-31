'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/muguetli';
import { useMotionPreference } from './motion-preference';
import { HERO_CRITICAL_READY_EVENT, isHeroCriticalReady, markArrivalComplete, markArrivalPending } from './arrival-ready';
import styles from './arrival-preloader.module.css';

const MIN_WAIT_MS = 6500;
const MAX_WAIT_MS = 7000;
const CLOSE_MS = 650;

export function ArrivalPreloader({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  const { reduced } = useMotionPreference();
  const [seconds, setSeconds] = useState(Math.ceil(MIN_WAIT_MS / 1000));
  const [unlocked, setUnlocked] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const finishStarted = useRef(false);

  const finish = useCallback(() => {
    if (finishStarted.current) return;
    finishStarted.current = true;
    markArrivalComplete();
    setClosing(true);
    window.setTimeout(() => setVisible(false), reduced ? 0 : CLOSE_MS);
  }, [reduced]);

  useEffect(() => {
    if (!visible || closing) return;
    markArrivalPending();
    const start = performance.now();
    if (dialogRef.current) dialogRef.current.dataset.started = 'true';
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const main = dialogRef.current?.parentElement;
    const background = [
      document.querySelector<HTMLElement>('header'),
      document.querySelector<HTMLElement>('footer'),
      document.querySelector<HTMLElement>('a[href="#main-content"]'),
      ...Array.from(main?.children || []).filter((child): child is HTMLElement => child instanceof HTMLElement && child !== dialogRef.current),
    ].filter((element): element is HTMLElement => Boolean(element));
    const previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    document.documentElement.style.overflow = 'hidden';
    dialogRef.current?.focus({ preventScroll: true });
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      const closeButton = dialogRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
      (closeButton || dialogRef.current)?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', keepFocus);
    let minimumElapsed = false;
    let heroReady = isHeroCriticalReady();
    const attemptFinish = () => { if (minimumElapsed && heroReady) finish(); };
    const heroBecameReady = () => { heroReady = true; attemptFinish(); };
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((MIN_WAIT_MS - (performance.now() - start)) / 1000));
      setSeconds(remaining);
      if (remaining === 0) window.clearInterval(timer);
    }, 100);
    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      setSeconds(0);
      setUnlocked(true);
      attemptFinish();
    }, MIN_WAIT_MS);
    const maximumTimer = window.setTimeout(finish, MAX_WAIT_MS);
    window.addEventListener(HERO_CRITICAL_READY_EVENT, heroBecameReady);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(maximumTimer);
      window.removeEventListener(HERO_CRITICAL_READY_EVENT, heroBecameReady);
      document.removeEventListener('keydown', keepFocus);
      document.documentElement.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      previousFocus?.focus({ preventScroll: true });
    };
  }, [closing, finish, visible]);

  useEffect(() => {
    if (!visible) return;
    const video = videoRef.current;
    if (!video || reduced) return;
    let cancelled = false;
    let started = false;
    // Let the hero's critical window finish before the decorative film requests bytes.
    const loadFilm = () => {
      if (cancelled || started || !video.isConnected) return;
      started = true;
      video.src = '/media/preloader/muguetli-arrival.mp4';
      video.load();
      void video.play().catch(() => {});
    };
    const heroReady = () => loadFilm();
    const fallback = window.setTimeout(loadFilm, 2000);
    if (isHeroCriticalReady()) loadFilm(); else window.addEventListener(HERO_CRITICAL_READY_EVENT, heroReady, { once: true });
    return () => { cancelled = true; window.clearTimeout(fallback); window.removeEventListener(HERO_CRITICAL_READY_EVENT, heroReady); video.pause(); video.removeAttribute('src'); video.load(); };
  }, [reduced, visible]);

  useEffect(() => {
    return () => {
      if (!finishStarted.current) markArrivalComplete();
    };
  }, []);

  const close = () => {
    if (!unlocked || closing) return;
    finish();
  };

  if (!visible) return null;
  return <dialog open ref={dialogRef} className={styles.overlay} data-arrival-preloader data-closing={closing || undefined} data-unlocked={unlocked || undefined} aria-modal="true" aria-label={fa ? 'ورود به جهان موگه‌تلی' : 'Entering the world of Muguetli'} tabIndex={-1} style={{ '--arrival-duration': `${MIN_WAIT_MS}ms` } as React.CSSProperties}>
    <div className={styles.topline}><span>MUGUETLI</span><span>{fa ? 'روایت / پارچه / تصویر' : 'NARRATIVE / TEXTILE / IMAGE'}</span></div>
    <div className={styles.content}>
      <p className={styles.eyebrow}>{fa ? 'چهار عنصر، یک جهان' : 'FOUR ELEMENTS, ONE WORLD'}</p>
      <div className={styles.film}>
        <video ref={videoRef} className={styles.video} poster={reduced ? '/media/preloader/muguetli-mark.webp' : '/media/preloader/muguetli-arrival-poster.webp'} muted playsInline preload="none" aria-hidden="true" />
        <span className={styles.filmEdge} aria-hidden="true" />
      </div>
      <p className={styles.caption}>{fa ? 'قصه همین‌جا جان می‌گیرد.' : 'The story begins to take shape.'}</p>
    </div>
    <div className={styles.footer}>
      <div className={styles.elements} aria-hidden="true"><span>WATER</span><i /><span>FIRE</span><i /><span>EARTH</span><i /><span>AIR</span></div>
      <div className={styles.exit}>
        <span className={styles.exitLabel} aria-live="polite">{unlocked ? (fa ? 'ورود به جهان موگه‌تلی' : 'ENTER THE WORLD') : (fa ? 'لحظه‌ای صبر کن' : 'A MOMENT TO UNFOLD')}</span>
        <button type="button" className={styles.close} onClick={close} disabled={!unlocked} aria-label={fa ? 'بستن پیش‌نمایش و ورود به سایت' : 'Close preloader and enter site'}>
          {unlocked ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg> : <span className={styles.count} aria-live="off">{fa ? new Intl.NumberFormat('fa-IR').format(seconds) : seconds}</span>}
        </button>
      </div>
    </div>
    <span className={styles.progress} aria-hidden="true" />
  </dialog>;
}
