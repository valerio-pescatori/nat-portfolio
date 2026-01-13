import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import HomeClient from "./HomeClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export async function generateMetadata(params: Promise<{ locale: Locale }>): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo(locale, "home");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    keywords: ["Nat Tatss", "Nat tattoo", "Nat tattoos", "tattoo Roma", "tattoo Rome", "tattoo artist Rome"],
    alternates: buildAlternates("/", locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${locale}`,
      siteName: "Nat Tattoo",
      locale: locale,
      type: "website",
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
