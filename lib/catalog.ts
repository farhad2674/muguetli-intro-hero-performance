import type { LocalizedText } from './muguetli';
import manifest from './catalog-manifest.json';
import supplements from './catalog-supplement.json';
import modeledImages from './catalog-models.json';

export const collectionIds = ['fire', 'earth', 'water', 'wind', 'calligraphy'] as const;
export type CollectionId = (typeof collectionIds)[number];
export const productTypes = ['pocket-square', 'square-scarf', 'long-shawl'] as const;
export type ProductType = (typeof productTypes)[number];
export const sizeCodes = ['50x50', '90x90', '180x70'] as const;
export type SizeCode = (typeof sizeCodes)[number];

export interface SourceReference {
  file: string;
  page: number | null;
  panel: string | null;
  position?: number;
  crop?: number[];
}

export interface MediaAsset {
  src: string;
  kind: 'artwork' | 'product' | 'model' | 'generated-model';
  width: number | null;
  height: number | null;
  alt?: LocalizedText;
  sourceFile?: string;
}

export interface SizeOption {
  code: SizeCode;
  type: ProductType;
  widthCm: number;
  heightCm: number;
  label: LocalizedText;
}

export interface InquiryContext {
  designId: string;
  productName?: string;
  collection: CollectionId;
  size: SizeCode;
  type: ProductType;
  pageUrl: string;
  customerName?: string;
}

export interface Design {
  id: string;
  slug: string;
  collection: CollectionId;
  number: number;
  shape: 'square' | 'long';
  title: LocalizedText;
  media: MediaAsset[];
  sourceReferences: SourceReference[];
  options: SizeOption[];
  needsReview: boolean;
  published: boolean;
}

interface SourcePanel {
  id: string;
  collection: CollectionId;
  shape: 'square' | 'rectangle';
  page: number;
  position: number;
  crop: number[];
  src: string;
  width: number;
  height: number;
  kind: 'artwork' | 'product-photo';
  matchedPhoto?: string;
  mergeInto?: string;
  reviewFlag?: string;
}

interface SupplementalMedia {
  designId: string;
  media: MediaAsset[];
}

export const collectionMeta: Record<CollectionId, { name: LocalizedText; statement: LocalizedText; index: string }> = {
  fire: { name: { en: 'Fire', fa: 'آتش' }, statement: { en: 'Creation through conscious burning.', fa: 'آفرینش از راه سوختن آگاهانه.' }, index: '01' },
  earth: { name: { en: 'Earth', fa: 'خاک' }, statement: { en: 'Rooting in truth.', fa: 'ریشه‌دواندن در حقیقت.' }, index: '02' },
  water: { name: { en: 'Water', fa: 'آب' }, statement: { en: 'At one with the inner world.', fa: 'یگانگی با روان.' }, index: '03' },
  wind: { name: { en: 'Wind', fa: 'باد' }, statement: { en: 'From the heights we came, to the heights we ascend.', fa: 'ما ز بالاییم و بالا می‌رویم.' }, index: '04' },
  calligraphy: { name: { en: 'Calligraphy', fa: 'خوشنویسی' }, statement: { en: 'Three rectangular designs, each presented as a shawl.', fa: 'سه طرح مستطیل، هرکدام در فرم شال.' }, index: '05' },
};

export const sizeOptions: Record<SizeCode, SizeOption> = {
  '50x50': { code: '50x50', type: 'pocket-square', widthCm: 50, heightCm: 50, label: { en: 'Pocket square', fa: 'دستمال جیبی' } },
  '90x90': { code: '90x90', type: 'square-scarf', widthCm: 90, heightCm: 90, label: { en: 'Square scarf', fa: 'روسری مربع' } },
  '180x70': { code: '180x70', type: 'long-shawl', widthCm: 180, heightCm: 70, label: { en: 'Long shawl', fa: 'شال بلند' } },
};

export function isCollectionId(value: string): value is CollectionId {
  return collectionIds.includes(value as CollectionId);
}

export function isProductType(value: string): value is ProductType {
  return productTypes.includes(value as ProductType);
}

export function isSizeCode(value: string): value is SizeCode {
  return sizeCodes.includes(value as SizeCode);
}

const panels = manifest.panels as SourcePanel[];
const supplementalMedia = supplements as SupplementalMedia[];
const generatedMedia = modeledImages as { designId: string; media: MediaAsset }[];
const counters = Object.fromEntries(collectionIds.map(id => [id, 0])) as Record<CollectionId, number>;

/** Stable neutral numbering follows the owner's PDF. These are not product names or SKUs. */
export const designs: Design[] = panels.filter(panel => !panel.mergeInto).map(panel => {
  const number = ++counters[panel.collection];
  const id = `${panel.collection}-${String(number).padStart(2, '0')}`;
  const name = collectionMeta[panel.collection].name;
  const related = [panel, ...panels.filter(other => other.mergeInto === panel.id)];
  const media: MediaAsset[] = related.map(source => ({
    src: source.src,
    kind: source.kind === 'artwork' ? 'artwork' : 'product',
    width: source.width,
    height: source.height,
    sourceFile: manifest.sourceFile,
  }));
  if (panel.matchedPhoto) media.push({ src: panel.matchedPhoto, kind: 'product', width: 1280, height: 1280, sourceFile: 'matched Water photograph' });
  media.push(...(supplementalMedia.find(entry => entry.designId === id)?.media ?? []));
  const styling = generatedMedia.find(entry => entry.designId === id);
  if (styling) media.splice(1, 0, styling.media);
  const options = panel.shape === 'rectangle' ? [sizeOptions['180x70']] : [sizeOptions['50x50'], sizeOptions['90x90']];
  return {
    id,
    slug: id,
    collection: panel.collection,
    number,
    shape: panel.shape === 'rectangle' ? 'long' : 'square',
    title: { en: `${name.en} / Design ${String(number).padStart(2, '0')}`, fa: `${name.fa} / طرح ${new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(number)}` },
    media,
    sourceReferences: related.map(source => ({ file: manifest.sourceFile, page: source.page, panel: source.id, position: source.position, crop: source.crop })),
    options,
    needsReview: Boolean(panel.reviewFlag),
    published: media.length > 0,
  };
});
export const publishedDesigns = designs.filter(design => design.published);

export function designsFor(collection?: CollectionId, type?: ProductType): Design[] {
  return publishedDesigns.filter(design =>
    (!collection || design.collection === collection) &&
    (!type || design.options.some(option => option.type === type))
  );
}

export function designBySlug(slug: string): Design | undefined {
  return publishedDesigns.find(design => design.slug === slug);
}

export function artworkFor(design: Design): MediaAsset | undefined {
  return design.media.find(asset => asset.kind === 'artwork');
}

export function stylingFor(design: Design): MediaAsset | undefined {
  return design.media.find(asset => asset.kind === 'generated-model');
}

export function coverFor(design: Design): MediaAsset | undefined {
  return design.media.find(asset => asset.kind === 'product' && asset.sourceFile?.startsWith('elnaz new/'))
    ?? design.media.find(asset => asset.kind === 'model' && asset.sourceFile?.startsWith('elnaz new/'))
    ?? design.media.find(asset => asset.kind === 'product')
    ?? artworkFor(design)
    ?? design.media[0];
}

export function productHref(locale: 'en' | 'fa', design: Design, size?: SizeCode): string {
  const path = `/${locale}/products/${design.slug}`;
  return size ? `${path}?size=${size}` : path;
}
