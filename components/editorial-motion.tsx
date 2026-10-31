'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreference } from './motion-preference';
import { useArrivalReady } from './arrival-ready';
import type { Locale } from '@/lib/muguetli';
import styles from './editorial-motion.module.css';

export function EditorialMotion({ children, locale = 'en' }: { children: React.ReactNode; locale?: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced: paused } = useMotionPreference();
  const arrivalReady = useArrivalReady();

  useEffect(() => {
    if (paused || !arrivalReady || !ref.current) return;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !ref.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, (context) => {
      if (!context.conditions?.motion) return;
      const desktop = context.conditions.desktop;
      const root = ref.current!;
      root.dataset.motion = 'active';
      const scoped = gsap.context(() => {
        root.querySelectorAll('[data-ribbon]').forEach(section => {
          const line = section.querySelector<HTMLElement>('[data-ribbon-line]');
          if (!line) return;
          const direction = locale === 'fa' ? 1 : -1;
          gsap.fromTo(line, { x: 0 }, { x: () => direction * Math.min(line.scrollWidth / 2, innerWidth * .8), ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.fromTo(el, { y: desktop ? 65 : 28, opacity: 0.15 }, {
            y: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 66%', scrub: true, invalidateOnRefresh: true },
          });
        });
        root.querySelectorAll<HTMLElement>('[data-scarf]').forEach((el, i) => {
          if (el.closest('[data-journey]')) return;
          gsap.fromTo(el, { x: (i % 2 ? 1 : -1) * (desktop ? 85 : 22), y: 65, rotation: (i % 2 ? 1 : -1) * 5, opacity: 0.25 }, {
            x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top 95%', end: 'top 30%', scrub: true, invalidateOnRefresh: true },
          });
        });
        root.querySelectorAll<HTMLElement>('[data-line]').forEach(el => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-portrait]').forEach(el => {
          gsap.fromTo(el, { clipPath: 'inset(10% 12% 10% 12%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 15%', scrub: true },
          });
          gsap.fromTo(el.querySelector('img'), { scale: 1.12, yPercent: -3 }, {
            scale: 1, yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
        const intro = root.querySelector<HTMLElement>('[data-intro]');
        if (intro) {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: intro, start: 'top 80%', end: desktop ? 'bottom bottom' : 'top 10%', scrub: true, invalidateOnRefresh: true } });
          timeline.fromTo(intro.querySelectorAll('[data-intro-line]'), { yPercent: 65, opacity: 0.2 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'none' }, 0);
          timeline.fromTo(intro.querySelector('[data-float-left]'), { xPercent: -32, yPercent: 20, rotation: -19 }, { xPercent: 8, yPercent: -10, rotation: -8, duration: 1, ease: 'none' }, 0);
          timeline.fromTo(intro.querySelector('[data-float-right]'), { xPercent: 32, yPercent: -15, rotation: 19 }, { xPercent: -8, yPercent: 10, rotation: 8, duration: 1, ease: 'none' }, 0);
        }
        root.querySelectorAll<HTMLElement>('[data-edition]').forEach((el, i) => {
          gsap.fromTo(el, { y: i ? 95 : 45, opacity: 0.2 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top 90%', end: 'top 35%', scrub: true } });
        });
      }, root);
      return () => { scoped.revert(); delete root.dataset.motion; };
      });
      let alive = true;
      const refresh = () => { if (alive) ScrollTrigger.refresh(); };
      void document.fonts.ready.then(refresh);
      const images = Array.from(ref.current.querySelectorAll('img'));
      images.forEach(img => img.addEventListener('load', refresh));
      window.addEventListener('pageshow', refresh);
      cleanup = () => {
        alive = false;
        images.forEach(img => img.removeEventListener('load', refresh));
        window.removeEventListener('pageshow', refresh);
        media.revert();
      };
    });
    return () => { cancelled = true; cleanup(); };
  }, [paused, locale, arrivalReady]);

  return <div ref={ref} className={styles.root}>
    {children}
  </div>;
}
