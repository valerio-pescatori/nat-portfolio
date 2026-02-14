import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import BookASessionClient from "./BookASessionClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export async function generateMetadata(params: Promise<{ locale: Locale }>): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo(locale, "book");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    keywords: [
      "Nat Tatss",
      "Nat tattoo",
      "book tattoo",
      "tattoo Roma",
      "tattoo Rome",
    ],
    alternates: buildAlternates("/book-a-session", locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${locale}/book-a-session`,
      siteName: "Nat Tattoo",
      locale: locale,
      type: "website",
    },
  };
}

export default function BookASession() {
  return <BookASessionClient />;
}
