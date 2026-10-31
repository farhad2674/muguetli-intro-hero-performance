'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Copy, MessageCircle } from 'lucide-react';
import { buildProductInquiry } from '@/lib/inquiry';
import type { CollectionId, SizeCode } from '@/lib/catalog';
import type { Locale } from '@/lib/muguetli';
import styles from './product-detail.module.css';

export function ProductInquiry({ locale, designId, collection, size }: { locale: Locale; designId: string; collection: CollectionId; size: SizeCode }) {
  const fa = locale === 'fa';
  const [customerName, setCustomerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [manualMessage, setManualMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, '');

  const message = (name = customerName) => buildProductInquiry({
    designId,
    collection,
    size,
    type: size === '50x50' ? 'pocket-square' : size === '90x90' ? 'square-scarf' : 'long-shawl',
    pageUrl: new URL(`${window.location.pathname}?size=${size}`, process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).href,
    customerName: name,
  });

  const openWhatsApp = () => {
    if (!number) return;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message())}`, '_blank', 'noopener,noreferrer');
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message());
      setManualMessage('');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      setManualMessage(message());
    }
  };

  return <section className={styles.inquiry} aria-labelledby="product-inquiry-title">
    <span>{fa ? 'یک گفت‌وگوی خصوصی' : 'A PRIVATE CONVERSATION'}</span>
    <h2 id="product-inquiry-title">{fa ? 'اثر را با نامش صدا بزنید.' : 'Begin with this artwork.'}</h2>
    <p>{fa ? 'ارجاع طرح، مجموعه و اندازهٔ انتخابی در پیام شما آماده است. پیش از ارسال می‌توانید متن را مرور کنید.' : 'Your design reference, collection and selected size are prepared in a Persian message for the artist. Review it before sending.'}</p>
    <label htmlFor="product-customer-name">{fa ? 'نام شما (اختیاری)' : 'Your name (optional)'}</label>
    <input id="product-customer-name" value={customerName} onChange={event => { setCustomerName(event.target.value); if (previewMessage) setPreviewMessage(message(event.target.value)); }} maxLength={80} autoComplete="name" placeholder={fa ? 'نام' : 'Name'} />
    <button type="button" className={styles.previewInquiry} aria-expanded={Boolean(previewMessage)} aria-controls="inquiry-preview" onClick={() => setPreviewMessage(previewMessage ? '' : message())}>{fa ? 'مرور متن پرسش' : 'Preview inquiry message'}</button>
    {previewMessage && <div id="inquiry-preview" className={styles.manualMessage}><label htmlFor="preview-inquiry">{fa ? 'متن آمادهٔ ارسال' : 'Your prepared message'}</label><textarea id="preview-inquiry" readOnly value={previewMessage} rows={7} dir="rtl" /></div>}
    <div className={styles.inquiryActions}>
      {number ? <button type="button" onClick={openWhatsApp}><MessageCircle size={18} />{fa ? 'مرور و ارسال در واتس‌اپ' : 'Review in WhatsApp'}<ArrowUpRight size={17} /></button> : <button type="button" onClick={copyMessage}><Copy size={18} />{copied ? (fa ? 'متن کپی شد' : 'Message copied') : (fa ? 'کپی متن پرسش' : 'Copy inquiry text')}</button>}
      <Link href={`/${locale}/contact`}>{fa ? 'راه‌های دیگر ارتباط' : 'Other ways to get in touch'}<ArrowUpRight size={17} /></Link>
    </div>
    <span role="status" className="sr-only">{copied ? (fa ? 'متن کپی شد' : 'Message copied') : ''}</span>
    {manualMessage && <div className={styles.manualMessage}><label htmlFor="manual-inquiry">{fa ? 'کپی خودکار ممکن نشد. متن را از اینجا کپی کنید.' : 'Automatic copying is unavailable. Copy your message below.'}</label><textarea id="manual-inquiry" readOnly value={manualMessage} rows={7} dir="rtl" onFocus={event => event.currentTarget.select()} /></div>}
    {!number && <small>{fa ? 'شمارهٔ رسمی واتس‌اپ هنوز تأیید و متصل نشده است.' : 'The official WhatsApp number has not been connected yet.'}</small>}
  </section>;
}
