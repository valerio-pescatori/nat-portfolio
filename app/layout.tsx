import { getSiteUrl } from "@/utils/seo";
import clsx from "clsx";
import "lenis/dist/lenis.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const banxors = localFont({
  variable: "--font-banxors",
  src: "./assets/fonts/Banxors.otf",
});

const readable = Roboto({
  variable: "--font-readable",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Nat Tatss",
    template: "%s",
  },
  description: "Nat Tatss tattoo portfolio in Rome. Explore work and book a session.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = cookieLocale === "en" ? "en" : "it";

  return (
    <html lang={lang} className={clsx(banxors.variable, readable.variable, "overflow-hidden lg:overflow-auto")}>
      <body
        className={clsx(
          "font-banxors antialiased",
          "min-h-screen overflow-hidden",
          "bg-radial-[circle_at_0_0] from-primary to-dark-secondary"
        )}
      >
        {children}
      </body>
    </html>
  );
}
