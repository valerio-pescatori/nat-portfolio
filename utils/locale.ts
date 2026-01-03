'use client';

import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import en from '@/locales/en.json';
import it from '@/locales/it.json';

export type Locale = 'en' | 'it';

const LOCALES: Locale[] = ['en', 'it'];
const DEFAULT_LOCALE: Locale = 'it';
const MESSAGES = { en, it };

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return LOCALES.includes(firstSegment as Locale) ? (firstSegment as Locale) : DEFAULT_LOCALE;
}

export function setLocaleCookie(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
  }
}

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const currentLocale = getLocaleFromPath(pathname);

  // Remove current locale prefix if present
  let cleanPath = pathname;
  if (currentLocale !== DEFAULT_LOCALE && pathname.startsWith(`/${currentLocale}`)) {
    cleanPath = pathname.slice(currentLocale.length + 1) || '/';
  }

  // Add new locale prefix if not default
  if (locale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  return `/${locale}${cleanPath}`;
}

export function useLocale() {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);
  const messages = MESSAGES[locale];

  const t = useCallback(
    (key: keyof typeof en) => {
      return (messages as Record<string, string>)[key] || key;
    },
    [messages]
  );

  const switchLocale = useCallback(
    (targetLocale: Locale) => {
      // Save locale preference to cookie
      setLocaleCookie(targetLocale);

      // Extract the clean path by removing any locale prefix
      let cleanPath = pathname;
      const firstSegment = pathname.split('/')[1];
      if (LOCALES.includes(firstSegment as Locale)) {
        cleanPath = pathname.slice(firstSegment.length + 1) || '/';
      }

      // Always return a locale-prefixed path
      return `/${targetLocale}${cleanPath}`;
    },
    [pathname]
  );

  return {
    locale,
    pathname,
    t,
    switchLocale,
  };
}

export default useLocale;
