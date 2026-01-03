import type { Locale } from "@/utils/locale";

export const DEFAULT_LOCALE: Locale = "it";
export const SUPPORTED_LOCALES: Locale[] = ["it", "en"];

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return new URL("https://www.nat-tatss.ink");
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
      title: isIt ? "Nat Tatss | Tattoo a Roma" : "Nat Tatss | Tattoo Artist in Rome",
      description: isIt
        ? "Nat Tatss: tattoo a Roma. Guarda il portfolio e prenota una sessione."
        : "Nat Tatss: tattoo artist in Rome. Explore the portfolio and book a session.",
    };
  }

  if (page === "portfolio") {
    return {
      title: isIt ? "Portfolio | Nat Tatss (Tattoo Roma)" : "Portfolio | Nat Tatss (Tattoo Rome)",
      description: isIt
        ? "Portfolio tatuaggi di Nat Tatss a Roma: una selezione di lavori e stili."
        : "Nat Tatss tattoo portfolio in Rome: a selection of work and styles.",
    };
  }

  return {
    title: isIt ? "Prenota una sessione | Nat Tatss (Roma)" : "Book a session | Nat Tatss (Rome)",
    description: isIt
      ? "Prenota una sessione tattoo a Roma con Nat Tatss e invia la tua idea su WhatsApp."
      : "Book a tattoo session in Rome with Nat Tatss and send your idea on WhatsApp.",
  };
}
