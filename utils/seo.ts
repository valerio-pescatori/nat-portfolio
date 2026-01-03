import type { Locale } from "@/utils/locale";

export const DEFAULT_LOCALE: Locale = "it";
export const SUPPORTED_LOCALES: Locale[] = ["it", "en"];

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return new URL("http://localhost:3000");
  return new URL(raw);
}

export function toLocalePath(locale: Locale, pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function buildAlternates(pathname: string, currentLocale: Locale) {
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = toLocalePath(locale, pathname);
  }

  return {
    canonical: toLocalePath(currentLocale, pathname),
    languages,
  };
}

type SeoText = {
  title: string;
  description: string;
};

export function getPageSeo(locale: Locale, page: "home" | "portfolio" | "book"): SeoText {
  // Keep these simple and keyword-focused. You can tailor later with city/location.
  const isIt = locale === "it";

  if (page === "home") {
    return {
      title: isIt ? "Nat Tatss" : "Nat Tatss",
      description: isIt
        ? "Portfolio tatuaggi di Nat. Scopri lo stile, guarda i lavori e prenota una sessione."
        : "Nat tattoo portfolio. Explore work and book a session.",
    };
  }

  if (page === "portfolio") {
    return {
      title: isIt ? "Portfolio | Nat Tatss" : "Portfolio | Nat Tatss",
      description: isIt
        ? "Portfolio tatuaggi di Nat: una selezione di lavori e stili."
        : "Nat tattoo portfolio: a selection of work and styles.",
    };
  }

  return {
    title: isIt ? "Prenota una sessione | Nat Tatss" : "Book a session | Nat Tatss",
    description: isIt
      ? "Prenota una sessione con Nat Tatss e invia la tua idea su WhatsApp."
      : "Book a session with Nat Tatss and send your idea on WhatsApp.",
  };
}
