'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/muguetli';
import { warmArrivalAssets, warmArrivalBootstrap } from '@/lib/arrival-assets';
import { ARRIVAL_FILM_MS, ARRIVAL_HOLD_MS, ARRIVAL_VISIT_KEY, canEnterArrival } from '@/lib/arrival-policy';
import { useMotionPreference } from './motion-preference';
import { HERO_CRITICAL_READY_EVENT, isHeroCriticalReady, markArrivalComplete, markArrivalPending } from './arrival-ready';
import styles from './arrival-preloader.module.css';

const CLOSE_MS = 650;

export function ArrivalPreloader({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  const { reduced } = useMotionPreference();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const [returning, setReturning] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [filmFallback, setFilmFallback] = useState(false);
  const [filmProgress, setFilmProgress] = useState(0);
  const [assetProgress, setAssetProgress] = useState(0);
  const [seconds, setSeconds] = useState(Math.ceil(ARRIVAL_FILM_MS / 1000));
  const [phase, setPhase] = useState<'film' | 'loading' | 'hold'>('film');
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const finishStarted = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const presentationStarted = useRef(0);
  const filmEndedAt = useRef<number | null>(null);
  const skipRequested = useRef(false);

  const completeFilm = useCallback(() => {
    if (filmEndedAt.current !== null) return;
    filmEndedAt.current = performance.now();
    document.documentElement.dataset.arrivalFilmEndedAt = String(filmEndedAt.current);
    setFilmProgress(1);
  }, []);

  const finish = useCallback(() => {
    if (finishStarted.current) return;
    finishStarted.current = true;
    try { localStorage.setItem(ARRIVAL_VISIT_KEY, '1'); } catch { /* The cookie also remembers a completed visit. */ }
    try { document.cookie = `${ARRIVAL_VISIT_KEY}=1; Max-Age=31536000; Path=/; SameSite=Lax`; } catch { /* A restricted browser can still enter normally. */ }
    document.documentElement.dataset.arrivalEnteredAt = String(performance.now());
    document.documentElement.dataset.arrivalSkipped = String(skipRequested.current);
    markArrivalComplete();
    setClosing(true);
    closeTimer.current = window.setTimeout(() => setVisible(false), reducedRef.current ? 0 : CLOSE_MS);
  }, []);

  useEffect(() => {
    markArrivalPending();
    presentationStarted.current = performance.now();
    delete document.documentElement.dataset.arrivalEnteredAt;
    delete document.documentElement.dataset.arrivalFilmEndedAt;
    delete document.documentElement.dataset.arrivalAssetsReady;
    delete document.documentElement.dataset.arrivalAssetsLoaded;
    let seen = false;
    try { seen = document.cookie.split('; ').includes(`${ARRIVAL_VISIT_KEY}=1`); } catch { /* Storage may still remember this visit. */ }
    try { seen ||= localStorage.getItem(ARRIVAL_VISIT_KEY) === '1'; } catch { /* Cookie fallback is optional. */ }
    setReturning(seen);
    document.documentElement.dataset.arrivalVisit = seen ? 'returning' : 'first';
    const controller = new AbortController();
    let bootstrapReady = false, assetsReady = false, heroReady = isHeroCriticalReady();
    const heroBecameReady = () => { heroReady = true; };
    window.addEventListener(HERO_CRITICAL_READY_EVENT, heroBecameReady);
    void warmArrivalBootstrap(locale).then(() => { if (!controller.signal.aborted) bootstrapReady = true; });
    void warmArrivalAssets(controller.signal, (loaded, total) => setAssetProgress(total ? loaded / total : 1)).then(result => {
      if (controller.signal.aborted) return;
      assetsReady = true;
      document.documentElement.dataset.arrivalAssetsReady = result.failed ? 'fallback' : 'true';
      document.documentElement.dataset.arrivalAssetsLoaded = `${result.loaded}/${result.total}`;
    });
    const timer = window.setInterval(() => {
      if (finishStarted.current) { clearInterval(timer); return; }
      const now = performance.now();
      const criticalReady = bootstrapReady && (heroReady || isHeroCriticalReady());
      if (filmEndedAt.current !== null) {
        setSeconds(Math.max(0, Math.ceil((ARRIVAL_HOLD_MS - (now - filmEndedAt.current)) / 1000)));
        setPhase(criticalReady && assetsReady ? 'hold' : 'loading');
      }
      if (canEnterArrival({ returning: seen, skipRequested: skipRequested.current, criticalReady, assetsReady, filmEndedAt: filmEndedAt.current, now })) finish();
    }, 50);
    return () => {
      controller.abort();
      clearInterval(timer);
      clearTimeout(closeTimer.current);
      window.removeEventListener(HERO_CRITICAL_READY_EVENT, heroBecameReady);
      if (!finishStarted.current) markArrivalComplete();
    };
  }, [finish, locale]);

  // Keep focus and scroll locked until the covering layer has actually disappeared.
  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const main = dialogRef.current?.parentElement;
    const background = [
      document.querySelector<HTMLElement>('header'), document.querySelector<HTMLElement>('footer'),
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
      (dialogRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)') || dialogRef.current)?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', keepFocus);
    return () => {
      document.removeEventListener('keydown', keepFocus);
      document.documentElement.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      previousFocus?.focus({ preventScroll: true });
    };
  }, [visible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;
    if (reduced || filmFallback) {
      video.pause();
      const timer = window.setTimeout(completeFilm, Math.max(0, ARRIVAL_FILM_MS - (performance.now() - presentationStarted.current)));
      return () => clearTimeout(timer);
    }
    if (video.ended) completeFilm();
    void video.play().catch(() => setFilmFallback(true));
    let lastTime = video.currentTime, lastProgress = performance.now();
    const watchdog = window.setInterval(() => {
      if (document.hidden || video.ended) return;
      if (video.currentTime !== lastTime) { lastTime = video.currentTime; lastProgress = performance.now(); }
      else if (performance.now() - lastProgress > 15000) setFilmFallback(true);
    }, 1000);
    return () => { clearInterval(watchdog); video.pause(); };
  }, [completeFilm, filmFallback, reduced, visible]);

  const skip = () => {
    if (!returning || finishStarted.current) return;
    skipRequested.current = true;
    setSkipping(true);
  };

  if (!visible) return null;
  const number = (value: number) => new Intl.NumberFormat(fa ? 'fa-IR' : 'en').format(value);
  const status = skipping || phase === 'loading'
    ? (fa ? 'در حال آماده‌شدن…' : 'PREPARING YOUR VISIT…')
    : phase === 'hold' ? (fa ? 'تا لحظه‌ای دیگر وارد می‌شوید' : 'ENTERING THE WORLD…')
    : returning ? (fa ? 'عبور از پیش‌نمایش' : 'SKIP INTRO') : (fa ? 'قصه در حال شکل‌گرفتن است' : 'A MOMENT TO UNFOLD');
  return <dialog open ref={dialogRef} className={styles.overlay} data-arrival-preloader data-visit={returning ? 'returning' : 'first'} data-phase={phase} data-closing={closing || undefined} aria-modal="true" aria-label={fa ? 'ورود به جهان موگه‌تلی' : 'Entering the world of Muguetli'} tabIndex={-1}>
    <div className={styles.topline}><span>MUGUETLI</span><span>{fa ? 'روایت / پارچه / تصویر' : 'NARRATIVE / TEXTILE / IMAGE'}</span></div>
    <div className={styles.content}>
      <p className={styles.eyebrow}>{fa ? 'چهار عنصر، یک جهان' : 'FOUR ELEMENTS, ONE WORLD'}</p>
      <div className={styles.film}>
        <video ref={videoRef} className={styles.video} src={!reduced && !filmFallback ? '/media/preloader/muguetli-arrival.mp4' : undefined} poster={reduced || filmFallback ? '/media/preloader/muguetli-mark.webp' : '/media/preloader/muguetli-arrival-poster.webp'} autoPlay muted playsInline preload="auto" aria-hidden="true" onEnded={completeFilm} onError={() => setFilmFallback(true)} onTimeUpdate={event => {
          if (filmEndedAt.current !== null) return;
          const video = event.currentTarget;
          if (Number.isFinite(video.duration) && video.duration > 0) { setFilmProgress(video.currentTime / video.duration); setSeconds(Math.ceil(Math.max(0, video.duration - video.currentTime))); }
        }} />
        <span className={styles.filmEdge} aria-hidden="true" />
      </div>
      <p className={styles.caption}>{fa ? 'قصه همین‌جا جان می‌گیرد.' : 'The story begins to take shape.'}</p>
    </div>
    <div className={styles.footer}>
      <div className={styles.elements} aria-hidden="true"><span>WATER</span><i /><span>FIRE</span><i /><span>EARTH</span><i /><span>AIR</span></div>
      <div className={styles.exit}>
        <div className={styles.exitCopy}><span className={styles.exitLabel} role="status">{status}</span><span className={styles.loadingLabel}>{fa ? 'آماده‌سازی جهان موگه‌تلی' : 'Preparing the Muguetli world'} · {number(Math.round(assetProgress * 100))}%</span></div>
        <button type="button" className={styles.close} onClick={skip} disabled={!returning || closing || skipping} aria-label={fa ? 'عبور از پیش‌نمایش و ورود به سایت' : 'Skip intro and enter site'}>
          {returning ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg> : <span className={styles.count} aria-live="off">{number(seconds)}</span>}
        </button>
      </div>
    </div>
    <span className={styles.progress} style={{ transform: `scaleX(${Math.min(filmProgress, assetProgress)})` }} aria-hidden="true" />
  </dialog>;
}
