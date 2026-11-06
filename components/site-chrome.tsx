'use client';

import { Suspense, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { navigation, t, type Locale } from '@/lib/muguetli';
import { collectionIds, collectionMeta, type CollectionId } from '@/lib/catalog';
import { MotionToggle, useMotionPreference } from './motion-preference';
import { useArrivalReady } from './arrival-ready';
import styles from './site-chrome.module.css';

const navigationIcons: Record<string, string> = {
  products: 'shop', journal: 'article', consulting: 'fashion', about: 'about-me', contact: 'contact',
};

function BrandIcon({ name, className = '' }: { name: string; className?: string }) {
  return <Image src={`/icons/brand/${name}.svg`} alt="" aria-hidden="true" width={32} height={32} unoptimized className={`${styles.brandIcon} ${className}`} />;
}

function rememberLocale(locale: Locale) {
  document.cookie = `muguetli_locale=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function LanguageLink({ path, targetLocale, children, className, ariaLabel }: { path: string; targetLocale: Locale; children: ReactNode; className?: string; ariaLabel?: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = `${path}${query ? `?${query}` : ''}`;
  const switchLocale = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    rememberLocale(targetLocale);
    window.location.assign(`${path}${window.location.search}${window.location.hash}`);
  };
  return <Link className={className} href={href} onClick={switchLocale} aria-label={ariaLabel}>{children}</Link>;
}

function LanguageSwitch(props: { path: string; targetLocale: Locale; children: ReactNode; className?: string; ariaLabel?: string }) {
  const fallback = <Link className={props.className} href={props.path} aria-label={props.ariaLabel}>{props.children}</Link>;
  return <Suspense fallback={fallback}><LanguageLink {...props} /></Suspense>;
}

export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const fa = locale === 'fa';
  const home = `/${locale}`;
  const other = fa ? 'en' : 'fa';
  const otherPath = pathname.replace(/^\/(?:en|fa)(?=\/|$)/, `/${other}`);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();
  const arrivalReady = useArrivalReady();
  const copy = (en: string, faText: string) => fa ? faText : en;
  const collectionHref = (collection: CollectionId) => `${home}/collections/${collection}`;
  const collectionLabel = (collection: CollectionId) => t(collectionMeta[collection].name, locale);
  const primaryNavigation = [navigation[2], navigation[1], navigation[3], navigation[4], navigation[5]];
  const productForms = [
    { id: 'pocket-square', icon: 'pocket-square', size: '50 × 50', en: 'Pocket square', fa: 'دستمال جیبی' },
    { id: 'square-scarf', icon: 'square-scarf', size: '90 × 90', en: 'Square scarf', fa: 'روسری مربع' },
    { id: 'long-shawl', icon: 'long-shawl', size: '180 × 70', en: 'Long shawl', fa: 'شال بلند' },
  ];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, '') || '989125278389';
  const socialLinks = [
    { icon: 'instagram', label: copy('Instagram', 'اینستاگرام'), href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#' },
    { icon: 'youtube', label: copy('YouTube', 'یوتیوب'), href: process.env.NEXT_PUBLIC_YOUTUBE_URL || '#' },
    { icon: 'whatsapp', label: copy('WhatsApp', 'واتساپ'), href: `https://wa.me/${whatsappNumber}` },
  ].filter((item): item is { icon: string; label: string; href: string } => item.href === '#' || Boolean(item.href?.startsWith('https://')));
  const isActive = (slug: string) => pathname === `${home}/${slug}` || pathname.startsWith(`${home}/${slug}/`);

  useEffect(() => {
    if (reduced || !arrivalReady || !footerRef.current) return;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !footerRef.current) return;
      const { gsap } = gsapModule;
      gsap.registerPlugin(triggerModule.ScrollTrigger);
      const context = gsap.context(() => {
        gsap.fromTo('[data-footer-mark]', { y: 24 }, { y: 0, ease: 'none', scrollTrigger: { trigger: footerRef.current, start: 'top bottom', end: 'top 75%', scrub: true } });
      }, footerRef);
      cleanup = () => context.revert();
    });
    return () => { cancelled = true; cleanup(); };
  }, [arrivalReady, reduced]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    rememberLocale(locale);
  }, [fa, locale]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      headerRef.current?.style.setProperty('--header-progress', String(Math.min(1, scrollY / 220)));
    };
    const queueUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', queueUpdate, { passive: true });
    return () => { removeEventListener('scroll', queueUpdate); cancelAnimationFrame(frame); };
  }, []);

  return <>
    <a href="#main-content" className={styles.skipContent}>{copy('Skip navigation', 'عبور از ناوبری')}</a>
    <header ref={headerRef} className={styles.header} dir={fa ? 'rtl' : 'ltr'}>
      <Link className={styles.brand} href={home} aria-label={copy('Muguetli home', 'صفحهٔ اصلی موگه‌تلی')}>
        <span className={styles.wordmark}>MUGUETLI</span>
        <span className={styles.brandLine}>{copy('Narrative textile & image architecture', 'معماری روایت، منسوجات و تصویر')}</span>
      </Link>

      <nav className={styles.desktopNavigation} aria-label={copy('Primary navigation', 'ناوبری اصلی')}>
        {primaryNavigation.map((item) => (
          <Link href={`${home}/${item.slug}`} className={styles.navLink} data-active={isActive(item.slug) || undefined} aria-current={isActive(item.slug) ? 'page' : undefined} key={item.slug}>
            <BrandIcon name={navigationIcons[item.slug]} className={styles.headerIcon} />
            <span>{t(item.label, locale)}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.utilities}>
        <LanguageSwitch className={styles.language} path={otherPath} targetLocale={other} ariaLabel={copy('Switch to Persian', 'تغییر زبان به انگلیسی')}>{fa ? 'EN' : 'FA'}</LanguageSwitch>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={styles.menuButton} aria-label={copy('Open navigation menu', 'باز کردن فهرست')} aria-expanded={open} aria-controls="muguetli-menu">
            <span className={styles.menuLabel}>{copy('Menu', 'فهرست')}</span>
            <BrandIcon name="menu" className={styles.menuIcon} />
          </SheetTrigger>
          <SheetContent id="muguetli-menu" side={fa ? 'left' : 'right'} showCloseButton={false} className={styles.menuPanel} dir={fa ? 'rtl' : 'ltr'} onClick={event => {
            if (event.target instanceof Element && event.target.closest('a[href]')) setOpen(false);
          }}>
            <div className={styles.menuTop}>
              <div>
                <SheetTitle className={styles.menuWordmark}>MUGUETLI</SheetTitle>
                <SheetDescription className={styles.menuDescription}>{copy('Browse the world of Muguetli', 'مسیر خود را در جهان موگه‌تلی پیدا کنید')}</SheetDescription>
              </div>
              <SheetClose className={styles.closeButton} aria-label={copy('Close navigation menu', 'بستن فهرست')}><span>{copy('Close', 'بستن')}</span><span className={styles.closeGlyph} aria-hidden="true" /></SheetClose>
            </div>

            <div className={styles.menuBody}>
              <section className={styles.wearableMenu} aria-labelledby="wearable-menu-title">
                <div className={styles.menuHeading}>
                  <BrandIcon name="shop" />
                  <div><p>{copy('Wearable art', 'هنر پوشیدنی')}</p><h2 id="wearable-menu-title">{copy('Scarves & textiles', 'روسری و منسوجات')}</h2></div>
                  <Link href={`${home}/products`} className={styles.viewAll}>{copy('View all', 'دیدن همه')} <ArrowUpRight size={16} /></Link>
                </div>

                <div className={styles.browsePaths}>
                  <div className={styles.browseGroup}>
                    <h3>{copy('Browse by collection', 'بر اساس مجموعه')}</h3>
                    <div className={styles.collectionLinks}>
                      {collectionIds.map((collection) => (
                        <Link href={collectionHref(collection)} key={collection}>
                          <BrandIcon name={collection === 'calligraphy' ? 'writing' : collection} /><strong>{collectionLabel(collection)}</strong><ArrowUpRight size={17} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className={styles.browseGroup}>
                    <h3>{copy('Browse by form', 'بر اساس فرم و اندازه')}</h3>
                    <div className={styles.formLinks}>
                      {productForms.map(form => (
                        <Link href={`${home}/products?type=${form.id}`} key={form.id}>
                          <BrandIcon name={form.icon} /><span className={styles.formLabel}>{fa ? form.fa : form.en}<small className={styles.formSize}>{form.size}</small></span><ArrowUpRight size={17} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <nav className={styles.menuNavigation} aria-label={copy('All sections', 'همهٔ بخش‌ها')}>
                {primaryNavigation.slice(1).map((item) => (
                  <Link href={`${home}/${item.slug}`} key={item.slug}>
                    <BrandIcon name={navigationIcons[item.slug]} /><strong>{t(item.label, locale)}</strong><ArrowUpRight size={18} />
                  </Link>
                ))}
              </nav>
            </div>

            <div className={styles.menuBottom}>
              <div className={styles.menuUtilities}>
                <MotionToggle locale={locale} />
                <LanguageSwitch path={otherPath} targetLocale={other}>{fa ? 'English' : 'فارسی'} ↗</LanguageSwitch>
                <Link href={`${home}/size-guide`}>{copy('Size guide', 'راهنمای اندازه')} ↗</Link>
              </div>
              <p>{copy('Matter · Memory · Metamorphosis', 'ماده · حافظه · دگرگونی')}</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>

    <div id="main-content" tabIndex={-1}>{children}</div>

    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerIdentity}><Link href={home} className={styles.footerLogo} data-footer-mark>MUGUETLI</Link><p>{copy('A world to wear. A story to live.', 'جهانی برای پوشیدن. داستانی برای زیستن.')}</p><a className={styles.backToTop} href="#main-content">{copy('Back to top', 'بازگشت به بالا')} ↑</a></div>
        <nav aria-label={copy('Sitemap', 'نقشهٔ سایت')} className={styles.footerMap}><h2>{copy('SITEMAP', 'نقشهٔ سایت')}</h2><div><Link href={home}>{copy('Home', 'خانه')}</Link><Link href={`${home}/products`}><BrandIcon name="shop" />{copy('Wearable art', 'هنر پوشیدنی')}</Link><Link href={`${home}/journal`}><BrandIcon name="article" />{copy('Philosophy & journal', 'فلسفه و ژورنال')}</Link><Link href={`${home}/about`}><BrandIcon name="about-me" />{copy('About Elnaz Bakhtiari', 'دربارهٔ الناز بختیاری')}</Link><Link href={`${home}/consulting`}><BrandIcon name="fashion" />{copy('Form & embodiment', 'فرم و تجسّم')}</Link><Link href={`${home}/books`}><BrandIcon name="book" />{copy('Zangole’am', 'زنگله‌ام')}</Link><Link href={`${home}/nfts`}><BrandIcon name="nft" />{copy('Digital art', 'هنر دیجیتال')}</Link><Link href={`${home}/mythology`}><BrandIcon name="earth" />{copy('The four mothers', 'چهار مادر')}</Link></div></nav>
        <nav aria-label={copy('Information', 'اطلاعات')} className={styles.footerInfo}><h2>{copy('INFORMATION', 'اطلاعات')}</h2><Link href={`${home}/contact`}><BrandIcon name="contact" />{copy('Private inquiries', 'پرسش خصوصی')}</Link><Link href={`${home}/size-guide`}>{copy('Size guide', 'راهنمای اندازه')}</Link><Link href={`${home}/privacy`}>{copy('Privacy', 'حریم خصوصی')}</Link><Link href={`${home}/accessibility`}>{copy('Accessibility', 'دسترسی‌پذیری')}</Link><Link href={`${home}/cookies`}>{copy('Cookies', 'کوکی‌ها')}</Link></nav>
      </div>
      <nav className={styles.footerSocials} aria-label={copy('Social media', 'شبکه‌های اجتماعی')}>
        {socialLinks.map(social => <a key={social.icon} href={social.href} target={social.href === '#' ? undefined : '_blank'} rel={social.href === '#' ? undefined : 'noopener noreferrer'}><span className={styles.socialIcon}><BrandIcon name={social.icon} /></span><span>{social.label}</span><ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </nav>
      <div className={styles.footerBottom}><span>© {new Date().getFullYear()} MUGUETLI</span><span>{copy('NARRATIVE TEXTILE & IMAGE ARCHITECTURE', 'معماری روایت، منسوجات و تصویر')}</span><LanguageSwitch path={otherPath} targetLocale={other}>{fa ? 'English' : 'فارسی'} ↗</LanguageSwitch></div>
    </footer>
  </>;
}
