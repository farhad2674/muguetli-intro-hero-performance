import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './globals.css';
import 'lenis/dist/lenis.css';
import { SmoothScroll } from '@/components/smooth-scroll';
import { MotionPreference } from '@/components/motion-preference';

export const metadata: Metadata = {
  title: { default: 'MUGUETLI — Narrative Textile & Image Architecture', template: '%s — MUGUETLI' },
  description: 'From the heights we came, to the heights we ascend. A bilingual Muguetli world of narrative textiles, image and private inquiry.',
};

const localeBootstrap = `
  (() => {
    const locale = location.pathname.split('/')[1] === 'fa' ? 'fa' : 'en';
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: localeBootstrap }} /></head>
      {/* Browser extensions such as Grammarly add body attributes before hydration. */}
      <body suppressHydrationWarning><MotionPreference><SmoothScroll>{children}</SmoothScroll></MotionPreference></body>
    </html>
  );
}
