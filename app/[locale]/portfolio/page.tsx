import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import PortfolioClient from "./PortfolioClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = getPageSeo(locale, "portfolio");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    keywords: ["Nat Tatss", "Nat tattoo", "tattoo portfolio", "tattoo Roma", "tattoo Rome"],
    alternates: buildAlternates("/portfolio", locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${locale}/portfolio`,
      siteName: "Nat Tattoo",
      locale: locale,
      type: "website",
    },
  };
}

export default function Portfolio() {
  return <PortfolioClient />;
}
