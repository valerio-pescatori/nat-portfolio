'use client';

import Image from 'next/image';
import propic from '../assets/images/propic2.jpg';
import AnimatedLink from '../components/AnimatedLink';
import AnimatedText from '../components/AnimatedText';
import { useLocale, getLocalizedPath } from '@/utils/locale';

export default function Home() {
  const { t, locale } = useLocale();

  return (
    <>
      <main className="h-screen relative flex flex-col">
        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-primary/0 via-primary md:via-60% lg:via-80% xl:via-100% via-40% to-secondary" />
        {/* Content */}
        <Image src={propic} alt="propic" className="w-full animate-fade-in" />
        <div className="z-10 text-center absolute top-1/2 left-1/2 -translate-1/2">
          <AnimatedText>
            <h1 className="text-[15rem] leading-60">Nat</h1>
          </AnimatedText>
          <div className="font-readable flex flex-col gap-2">
            <AnimatedText className="animation-delay-1500">
              <h2 className="text-2xl ">{t('tattoo_artist')}</h2>
            </AnimatedText>
            <AnimatedLink
              href={getLocalizedPath(locale, '/portfolio')}
              className="text-lg transition-opacity animate-fade-in animation-delay-2000"
              style={{ animationFillMode: 'backwards' }}
            >
              {t('portfolio')}
            </AnimatedLink>
            <AnimatedLink
              href={getLocalizedPath(locale, '/book-a-session')}
              className="text-lg transition-opacity animate-fade-in animation-delay-2500"
              style={{ animationFillMode: 'backwards' }}
            >
              {t('book_a_session')}
            </AnimatedLink>
          </div>
        </div>
      </main>
    </>
  );
}
