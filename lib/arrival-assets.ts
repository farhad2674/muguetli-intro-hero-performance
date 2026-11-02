import { FRAME_COUNT } from './hero-frames';
import { heroFrameUrl } from './hero-media';
import type { Locale } from './muguetli';

function deadline<T>(work: Promise<T>, milliseconds: number): Promise<T | undefined> {
  return new Promise(resolve => {
    const timer = window.setTimeout(() => resolve(undefined), milliseconds);
    void work.then(value => { clearTimeout(timer); resolve(value); }, () => { clearTimeout(timer); resolve(undefined); });
  });
}

/** Warm code and fonts without starting below-fold animation behind the film. */
export async function warmArrivalBootstrap(locale: Locale) {
  const fontNames = locale === 'fa' ? ['Dana Pro', 'Modam Pro'] : ['Inter Variable'];
  await Promise.all([
    deadline(Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]), 15000),
    deadline(Promise.all(fontNames.map(name => document.fonts.load(`400 18px "${name}"`, locale === 'fa' ? 'جهان موگه‌تلی' : 'MUGUETLI'))), 8000),
  ]);
}

/** Cache compressed image bytes; keep full-resolution decoding in the hero's nearby-frame window. */
export async function warmArrivalAssets(signal: AbortSignal, onProgress: (loaded: number, total: number) => void) {
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { reduced ||= localStorage.getItem('muguetli-reduced-motion') === 'true'; } catch { /* System preference remains available. */ }
  const desktop = matchMedia('(min-width: 769px)').matches && !reduced;
  const pageImages = Array.from(document.querySelectorAll<HTMLImageElement>('main img'))
    .filter(image => !image.closest('[data-arrival-preloader]'))
    .map(image => image.currentSrc || image.src);
  const sources = [...new Set([
    ...(desktop ? Array.from({ length: FRAME_COUNT }, (_, index) => heroFrameUrl(index)) : [heroFrameUrl(0)]),
    ...pageImages,
  ].map(src => new URL(src, location.origin).href))];
  let cursor = 0, loaded = 0, failed = 0;
  onProgress(0, sources.length);
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (!signal.aborted && cursor < sources.length && failed < 3) {
      const source = sources[cursor++];
      try {
        const response = await fetch(source, { cache: 'force-cache', priority: 'low', signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]) });
        if (!response.ok) throw new Error(`Asset unavailable: ${response.status}`);
        await response.arrayBuffer();
        loaded++;
      } catch { if (!signal.aborted) failed++; }
      if (!signal.aborted) onProgress(loaded, sources.length);
    }
  }));
  return { loaded, total: sources.length, failed };
}
