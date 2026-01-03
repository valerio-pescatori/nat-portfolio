import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import PortfolioClient from "./PortfolioClient";
import { buildAlternates, getPageSeo, getSiteUrl } from "@/utils/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const seo = getPageSeo(params.locale, "portfolio");

  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    keywords: [
      "Nat Tatss",
      "Nat tattoo",
      "tattoo portfolio",
      "tattoo Roma",
      "tattoo Rome",
    ],
    alternates: buildAlternates("/portfolio", params.locale),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/${params.locale}/portfolio`,
      siteName: "Nat Tattoo",
      locale: params.locale,
      type: "website",
    },
  };
}

export default function Portfolio() {
  return <PortfolioClient />;
}
