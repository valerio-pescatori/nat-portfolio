import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import HomeClient from "./HomeClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const seo = getPageSeo(params.locale, "home");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    alternates: buildAlternates("/", params.locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${params.locale}`,
      siteName: "Nat Tattoo",
      locale: params.locale,
      type: "website",
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
