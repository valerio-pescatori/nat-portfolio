import type { MetadataRoute } from "next";
import { getSiteUrl, SUPPORTED_LOCALES, toLocalePath } from "@/utils/seo";

const ROUTES = ["/", "/portfolio", "/book-a-session"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of ROUTES) {
      const path = toLocalePath(locale, route);
      entries.push({
        url: new URL(path, siteUrl).toString(),
        lastModified: now,
      });
    }
  }

  return entries;
}
