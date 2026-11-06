import Link from 'next/link';
import { t, type Locale } from '@/lib/muguetli';
import { literaryElements } from '@/lib/book-story';
import { JournalIcon } from './journal-icon';
import styles from './brand-story-feature.module.css';

export function BrandStoryFeature({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  return <section className={styles.story} aria-labelledby="flower-story-title">
    <div className={styles.introduction}>
      <div className={styles.image}>
        <img src="/media/journal/white-bells.webp" alt={fa ? 'زنگوله‌های سفید گل موگه در کنار بازتاب و بافتی به رنگ آلو' : 'White lily-of-the-valley bells beside a reflection and plum textile'} width={1536} height={1024} loading="lazy" />
        <span className={styles.flowerMark}><JournalIcon kind="flower" /></span>
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{fa ? 'نامی از یک گل؛ جهانی از دگرگونی' : 'A name from a flower. A world of transformation.'}</p>
        <h2 id="flower-story-title">{fa ? 'زنگوله‌ای کوچک، چرخه‌ای بی‌پایان' : 'A small bell, an endless cycle'}</h2>
        <p>{fa ? 'موگه، با زنگوله‌های سفید و تضادهایش، نقطهٔ آغاز نام موگه‌تلی است. این گل در جهان زنگله‌ام به نشانه‌ای برای عبور، بیداری و دوباره شکفتن بدل می‌شود.' : 'The white bells and contradictions of lily of the valley are the starting point of the Muguetli name. In the world of Zangole’am, the flower becomes a symbol of passage, awakening and blooming again.'}</p>
        <Link className={styles.read} href={`/${locale}/journal/white-bells-and-the-eternal-cycle`}>{fa ? 'راز نام موگه‌تلی را بخوانید' : 'Read the story behind the name'} <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
    <div className={styles.cycleHeading}><span className={styles.eyebrow}>{fa ? 'یک گل، چهار مادر' : 'One flower. Four mothers.'}</span><p>{fa ? 'سوختن، ریشه‌گرفتن، جاری‌شدن، رهاشدن؛ هر پایان، آغازی دیگر.' : 'Burning, rooting, flowing, releasing. Each ending opens another beginning.'}</p></div>
    <ol className={styles.elements}>{literaryElements.map((element, index) => <li key={element.id}>
      <Link href={`/${locale}/mythology#${element.id}`}>
        <div className={styles.elementTop}><span>{new Intl.NumberFormat(fa ? 'fa-IR' : 'en', { minimumIntegerDigits: 2 }).format(index + 1)}</span><JournalIcon kind={element.id === 'air' ? 'wind' : element.id} /></div>
        <h3>{t(element.name, locale)}</h3><p>{t(element.title, locale)}</p><span className={styles.elementLink}>{fa ? 'ورود به این فصل' : 'Enter the chapter'} <span aria-hidden="true">↗</span></span>
      </Link>
    </li>)}</ol>
    <p className={styles.returnLine}><JournalIcon kind="flower" /><span>{fa ? 'و دوباره، شکفتن.' : 'And once again, a bloom.'}</span><span aria-hidden="true">↶</span></p>
  </section>;
}
