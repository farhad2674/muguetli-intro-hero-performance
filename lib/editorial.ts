import type { LocalizedText } from './muguetli';

export interface Collection {
  id: number;
  name: string;
  localizedName?: LocalizedText;
  description: string;
  localizedDescription?: LocalizedText;
  image: string;
  url: string;
}
export interface JournalArticle { id: string; title: LocalizedText; excerpt: LocalizedText; category: LocalizedText; image: string; url: string; date?: string }
export interface Book { title: LocalizedText; originalTitle: string; subtitle: LocalizedText; author: LocalizedText; synopsis: LocalizedText; format: LocalizedText; language: LocalizedText; image?: string; url?: string; ebookUrl?: string }
// Only approved editorial records belong here. Missing records remain unpublished.
export const editorial: { founder: { name: LocalizedText; role: LocalizedText; image: string; copy: LocalizedText } | null; book: Book | null; articles: JournalArticle[] } = {
  founder: {
    name: { en: 'Elnaz Bakhtiari', fa: 'الناز بختیاری' },
    role: { en: 'Narrative Textile & Image Architect', fa: 'معمار روایت، منسوجات و تصویر' },
    image: '/media/collection/founder.webp',
    copy: {
      en: 'Elnaz Bakhtiari is a writer, artist and designer whose work brings Bakhtiari heritage, Persian mystical literature and the inner journey into a personal language of transformation. Muguetli gives that language form through words, images, textiles and lived form.',
      fa: 'الناز بختیاری نویسنده، هنرمند و طراح است. او میراث بختیاری، ادبیات عرفانی ایران و سفر درونی را به زبانی شخصی برای دگرگونی پیوند می‌دهد. موگه‌تلی این زبان را در کلمه، تصویر، منسوجات و فرمِ زیسته شکل می‌دهد.',
    },
  },
  book: {
    title: { en: 'Zangole’am', fa: 'زنگله‌ام' },
    originalTitle: 'زنگله‌ام',
    subtitle: { fa: 'سفری از سوگ تا بیداری و رهایی', en: 'A sacred journey from grief to awakening & liberation' },
    author: { fa: 'الناز بختیاری', en: 'Elnaz Bakhtiari' },
    language: { fa: 'زبان اصلی: فارسی', en: 'Originally written in Persian' },
    format: { fa: 'کتاب چاپی و الکترونیکی', en: 'Physical book & eBook' },
    synopsis: { fa: 'زنگله‌ام، سفر مقدس گل موگه، روایت گذر از سوگ به خودشناسی است؛ سفری در ۲۱ مرحله، از سوزش در آتش و ریشه‌گرفتن در خاک تا فرو‌رفتن در ناخودآگاهِ آب و رهایی با باد.', en: 'Zangole’am, The Sacred Journey of the Lily of the Valley, follows a passage from grief to self-discovery across 21 stages: burning in fire, rooting in earth, descending into the subconscious of water and finding liberation with the wind.' },
  },
  articles: [
    {
      id: 'how-to-wear-a-pocket-square',
      category: { en: 'Wearable Art / Guide', fa: 'هنر پوشیدنی / راهنما' },
      title: { en: 'A pocket square, folded like a small frame', fa: 'دستمال جیبی؛ قابی کوچک برای داستان' },
      excerpt: { en: 'A practical introduction to the 50 × 50 cm pocket square: proportion, fold and a little room for the artwork to breathe.', fa: 'راهنمایی ساده برای دستمال جیبی ۵۰×۵۰ سانتی‌متر؛ تناسب، تا و کمی فضا برای نفس‌کشیدن تصویر.' },
      image: '/media/collection/scarf-rust.webp',
      url: '/en/journal/how-to-wear-a-pocket-square',
    },
    {
      id: 'the-square-scarf',
      category: { en: 'Wearable Art / Guide', fa: 'هنر پوشیدنی / راهنما' },
      title: { en: 'The square scarf: one image, many gestures', fa: 'روسری مربع؛ یک تصویر، چند حرکت' },
      excerpt: { en: 'How a 90 × 90 cm square becomes a shoulder, neck or hair gesture without asking the artwork to disappear.', fa: 'چطور یک روسری ۹۰×۹۰ سانتی‌متر روی شانه، دور گردن یا در مو جان می‌گیرد؛ بی‌آنکه تصویر ناپدید شود.' },
      image: '/media/collection/scarf-red.webp',
      url: '/en/journal/the-square-scarf',
    },
    {
      id: 'the-long-shawl',
      category: { en: 'Wearable Art / Guide', fa: 'هنر پوشیدنی / راهنما' },
      title: { en: 'The long shawl and the architecture of a silhouette', fa: 'شال بلند و معماریِ سیلوئت' },
      excerpt: { en: 'A quiet guide to the 180 × 70 cm shawl: movement, proportion and the space between body and textile.', fa: 'راهنمایی آرام برای شال ۱۸۰×۷۰ سانتی‌متر؛ حرکت، تناسب و فاصلهٔ میان بدن و پارچه.' },
      image: '/media/collection/scarf-indigo.webp',
      url: '/en/journal/the-long-shawl',
    },
  ],
};

export const editorialCollections: Collection[] = [
  {
    id: 1,
    name: 'Fire',
    localizedName: { en: 'Fire', fa: 'آتش' },
    description: 'Creation through conscious burning.',
    localizedDescription: { en: 'Creation through conscious burning.', fa: 'آفرینش از راه سوختن آگاهانه.' },
    image: '/media/four-mothers/fire-key.webp',
    url: '/en/collections/fire',
  },
  {
    id: 2,
    name: 'Earth',
    localizedName: { en: 'Earth', fa: 'خاک' },
    description: 'Rooting in truth.',
    localizedDescription: { en: 'Rooting in truth.', fa: 'ریشه‌دواندن در حقیقت.' },
    image: '/media/four-mothers/earth-key.webp',
    url: '/en/collections/earth',
  },
  {
    id: 3,
    name: 'Water',
    localizedName: { en: 'Water', fa: 'آب' },
    description: 'At one with the inner world.',
    localizedDescription: { en: 'At one with the inner world.', fa: 'یگانگی با روان.' },
    image: '/media/four-mothers/water-key.webp',
    url: '/en/collections/water',
  },
  {
    id: 4,
    name: 'Wind',
    localizedName: { en: 'Wind', fa: 'باد' },
    description: 'From the heights we came, to the heights we ascend.',
    localizedDescription: { en: 'From the heights we came, to the heights we ascend.', fa: 'ما ز بالاییم و بالا می‌رویم.' },
    image: '/media/four-mothers/air-key.webp',
    url: '/en/collections/wind',
  },
];

// Descriptive labels for supplied photographs, not official product names or SKUs.
export const scarfStudies = [
  { id: 'rust', image: '/media/collection/scarf-rust.webp', color: '#aa4329', name: { en: 'Rust border', fa: 'حاشیهٔ آجری' }, description: { en: 'An underwater world, framed in warm rust. A figure, two cats, and a sea of small stories.', fa: 'جهانی زیر آب، در قابی آجری؛ یک پیکر، دو گربه و دریایی از داستان‌های کوچک.' } },
  { id: 'red', image: '/media/collection/scarf-red.webp', color: '#d72e3c', name: { en: 'Scarlet border', fa: 'حاشیهٔ سرخ' }, description: { en: 'A closer encounter. A portrait surrounded by bright fish, coral and deep blue.', fa: 'دیداری از نزدیک؛ چهره‌ای در میان ماهی‌های رنگارنگ، مرجان‌ها و آبی ژرف.' } },
  { id: 'indigo', image: '/media/collection/scarf-indigo.webp', color: '#242c58', name: { en: 'Indigo border', fa: 'حاشیهٔ نیلی' }, description: { en: 'The underwater scene returns in indigo. A quieter frame for a richly imagined world.', fa: 'جهان زیر آب، این بار در قابی نیلی؛ حاشیه‌ای آرام برای دنیایی سرشار از خیال.' } },
  { id: 'olive', image: '/media/collection/scarf-olive.webp', color: '#888d28', name: { en: 'Olive border', fa: 'حاشیهٔ زیتونی' }, description: { en: 'A figure in motion, flowing ribbons and sea life. An olive edge holds the colour together.', fa: 'پیکری در حرکت، روبان‌های روان و زندگی دریایی؛ رنگ‌ها در حاشیه‌ای زیتونی به هم می‌رسند.' } },
];
export const moreLabel: LocalizedText = { en: 'More', fa: 'بیشتر' };
export const services = [
  { title: { en: 'Architectural Styling & Wardrobe Direction', fa: 'استایل معماری و هدایت کمد لباس' }, description: { en: 'A considered wardrobe language for the way you want to be seen.', fa: 'زبانی سنجیده برای کمد لباس و شیوه‌ای که می‌خواهید دیده شوید.' } },
  { title: { en: 'Hair Architecture & Image Direction', fa: 'معماری مو و هدایت تصویر' }, description: { en: 'Shape hair and image as one visible signature.', fa: 'مو و تصویر را به یک امضای دیداری پیوند می‌دهیم.' } },
  { title: { en: 'Bespoke Fashion & Silhouette Design', fa: 'طراحی اختصاصی لباس و سیلوئت' }, description: { en: 'A personal form built around your body, movement and mythology.', fa: 'فرمی شخصی بر اساس بدن، حرکت و اسطورهٔ زیستهٔ شما.' } },
  { title: { en: 'Bespoke Narrative Textile & Scarf Commission', fa: 'سفارش اختصاصی منسوجات روایی و شال' }, description: { en: 'A textile made for a story that belongs to you.', fa: 'منسوجی برای داستانی که به خود شما تعلق دارد.' } },
];
export const values: LocalizedText[] = [
  { en:'Bakhtiari heritage',fa:'میراث بختیاری' },{en:'Persian mystical literature',fa:'ادبیات عرفانی ایران'},
  { en:'The inner journey',fa:'سفر درونی'},
];
