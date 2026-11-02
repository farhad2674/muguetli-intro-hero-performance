'use client';

import { useSyncExternalStore } from 'react';
import { ArrowUpRight, ChevronDown, Mail } from 'lucide-react';
import { buildProductInquiry } from '@/lib/inquiry';
import { sizeOptions, type CollectionId, type SizeCode } from '@/lib/catalog';
import { t, type LocalizedText, type Locale } from '@/lib/muguetli';
import styles from './product-detail.module.css';

const subscribeToOrigin = () => () => {};
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => '';

function WhatsAppIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8A8.5 8.5 0 1 1 20.5 11.6Z" /><path d="m8.2 7.4 1.2 2.4-.9 1.1c.8 1.7 2 2.9 3.7 3.7l1.1-.9 2.4 1.2c.2.1.3.4.2.6-.4 1-1.3 1.5-2.3 1.2-3.6-1-6.6-4-7.4-7.4-.2-.9.4-1.7 1.3-2.1.3-.1.6 0 .7.2Z" /></svg>;
}

export function ProductInquiry({ locale, designId, productName, productPath, collection, size }: { locale: Locale; designId: string; productName: LocalizedText; productPath: string; collection: CollectionId; size: SizeCode }) {
  const fa = locale === 'fa';
  const browserOrigin = useSyncExternalStore(subscribeToOrigin, getBrowserOrigin, getServerOrigin);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || browserOrigin;
  const pageUrl = origin ? new URL(productPath, origin).href : productPath;
  const message = buildProductInquiry({ designId, productName: productName.fa, collection, size, type: sizeOptions[size].type, pageUrl });
  const whatsappHref = `https://wa.me/989125278389?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:shop@muguetli.com?subject=${encodeURIComponent(`MUGUETLI — ${t(productName, locale)} — ${size}`)}&body=${encodeURIComponent(message)}`;

  return <section className={styles.inquiry} aria-labelledby="product-inquiry-title">
    <h2 id="product-inquiry-title">{fa ? 'این اثر را پسندیدید؟' : 'Drawn to this artwork?'}</h2>
    <p>{fa ? 'برای قیمت، موجودی یا راهنمایی در انتخاب، به ما پیام بدهید. نام اثر و اندازهٔ انتخابی در پیام شما آماده است.' : 'Ask us about pricing, availability or choosing your piece. Your artwork and selected size are already in the message.'}</p>
    <div className={styles.inquirySelection}>
      <span>{t(productName, locale)}</span>
      <span dir="ltr">{sizeOptions[size].widthCm} × {sizeOptions[size].heightCm} cm</span>
    </div>
    <div className={styles.contactActions}>
      <a className={styles.whatsappAction} href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon /><span>{fa ? 'پرسش در واتس‌اپ' : 'Ask us on WhatsApp'}</span><ArrowUpRight size={18} aria-hidden="true" />
      </a>
      <a className={styles.emailAction} href={emailHref}>
        <Mail size={20} aria-hidden="true" /><span>{fa ? 'ارسال ایمیل' : 'Send an email'}</span><ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </div>
    <small className={styles.contactHint}>{fa ? 'پیش از ارسال، می‌توانید پیام را در واتس‌اپ یا ایمیل ویرایش کنید.' : 'You can edit the message in WhatsApp or email before sending.'}</small>
    <details className={styles.messagePreview}>
      <summary>{fa ? 'دیدن متن پیام' : 'Preview your message'}<ChevronDown size={16} aria-hidden="true" /></summary>
      <div className={styles.manualMessage}><label htmlFor="preview-inquiry">{fa ? 'پیام آمادهٔ شما' : 'Your prepared message (in Persian)'}</label><textarea id="preview-inquiry" readOnly value={message} rows={8} dir="rtl" /></div>
    </details>
  </section>;
}
