'use client';

import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { scarfStudies } from '@/lib/editorial';
import { t, type Locale } from '@/lib/muguetli';
import styles from './scarf-gallery.module.css';

export function ScarfGallery({ locale, ids, cinematic = false }: { locale: Locale; ids?: string[]; cinematic?: boolean }) {
  const fa = locale === 'fa';
  const catalogIds: Record<string, string> = { rust: 'water-21', red: 'water-05', indigo: 'water-18', olive: 'water-03' };
  return <div className={`${styles.grid} ${cinematic ? styles.cinematic : ''}`}>
    {scarfStudies.filter(scarf => !ids || ids.includes(scarf.id)).map((scarf) => <article key={scarf.id} className={styles.card} id={`scarf-${scarf.id}`}>
      <Dialog>
        <div className={styles.imageMotion} data-scarf data-panel-art={cinematic || undefined}>
          <DialogTrigger className={styles.imageButton} aria-label={`${fa ? 'نمای نزدیک' : 'View scarf'}: ${t(scarf.name, locale)}`}>
            <img src={scarf.image} alt={t(scarf.description, locale)} width={1280} height={1280} loading="lazy" decoding="async" />
            <span className={styles.view}>{fa ? 'از نزدیک' : 'A closer look'}<ArrowUpRight size={18} /></span>
          </DialogTrigger>
        </div>
        <div className={styles.caption}>
          <span className={styles.index}>{new Intl.NumberFormat(fa ? 'fa-IR' : 'en', { minimumIntegerDigits: 2 }).format(scarfStudies.indexOf(scarf) + 1)}</span>
          <div><h3>{t(scarf.name, locale)}</h3><p>{t(scarf.description, locale)}</p></div>
          <span className={styles.swatch} style={{ background: scarf.color }} aria-hidden="true" />
        </div>
        <DialogContent className={styles.dialog} showCloseButton={false} dir={fa ? 'rtl' : 'ltr'}>
          <DialogClose className={styles.close} aria-label={fa ? 'بستن' : 'Close'}><X size={21} /></DialogClose>
          <img className={styles.detailImage} src={scarf.image} alt={t(scarf.description, locale)} width={1280} height={1280} loading="lazy" decoding="async" />
          <div className={styles.details}>
            <span className={styles.detailLabel}>MUGUETLI / {fa ? 'روسری' : 'SCARVES'}</span>
            <DialogTitle className={styles.title}>{t(scarf.name, locale)}</DialogTitle>
            <DialogDescription className={styles.description}>{t(scarf.description, locale)}</DialogDescription>
            <p className={styles.availability}>{fa ? 'فرم‌ها و اندازه‌های ثبت‌شده را در صفحهٔ اثر ببینید. جنس و موجودی پس از تأیید اعلام می‌شود.' : 'See documented forms and sizes on the artwork page. Fabric and availability await confirmation.'}</p>
            <Link className={styles.productLink} href={`/${locale}/products/${catalogIds[scarf.id]}`}>{fa ? 'دیدن صفحهٔ اثر' : 'View artwork page'}<ArrowUpRight size={17} /></Link>
          </div>
        </DialogContent>
      </Dialog>
    </article>)}
  </div>;
}
