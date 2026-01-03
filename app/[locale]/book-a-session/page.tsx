import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import BookASessionClient from "./BookASessionClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const seo = getPageSeo(params.locale, "book");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    alternates: buildAlternates("/book-a-session", params.locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${params.locale}/book-a-session`,
      siteName: "Nat Tattoo",
      locale: params.locale,
      type: "website",
    },
  };
}

export default function BookASession() {
  return <BookASessionClient />;
}
