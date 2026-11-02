import { collectionMeta, sizeOptions, type InquiryContext } from './catalog';

/** The message is intentionally Persian in either site locale, as specified by the owner. */
export function buildProductInquiry(context: InquiryContext): string {
  const size = sizeOptions[context.size];
  const name = context.customerName?.trim().replace(/[\r\n]+/g, ' ');
  return [
    context.productName ? `سلام، به اثر «${context.productName}» از موگه‌تلی علاقه‌مندم.` : 'سلام، دربارهٔ یکی از آثار موگه‌تلی پرسش دارم.',
    name ? `نام: ${name}` : '',
    `ارجاع طرح: ${context.designId}`,
    `مجموعه: ${collectionMeta[context.collection].name.fa}`,
    `فرم: ${size.label.fa}`,
    `اندازه: ${size.widthCm} × ${size.heightCm} سانتی‌متر`,
    'لطفاً دربارهٔ قیمت، موجودی و نحوهٔ سفارش راهنمایی‌ام کنید.',
    `صفحهٔ اثر: ${context.pageUrl}`,
  ].filter(Boolean).join('\n');
}
