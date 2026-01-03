import Header from "@/app/components/Header";
import type { Locale } from "@/utils/locale";
import { getSiteUrl } from "@/utils/seo";
import { ReactNode } from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js 16 types `params` as a Promise in some runtimes/tooling.
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "it") as Locale;
  const siteUrl = getSiteUrl().toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: "Nat Tatss",
    url: siteUrl,
    areaServed: {
      "@type": "City",
      name: "Rome",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rome",
      addressCountry: "IT",
    },
    telephone: "+393891589441",
    inLanguage: locale,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      {children}
    </>
  );
}
