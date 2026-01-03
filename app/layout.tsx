import clsx from "clsx";
import "lenis/dist/lenis.css";
import type { Metadata } from "next";
import { UnifrakturMaguntia } from "next/font/google";
import localFont from "next/font/local";
import Header from "./components/Header";
import "./globals.css";

const banxors = localFont({
  variable: "--font-banxors",
  src: "./assets/fonts/Banxors.otf",
});

const readable = UnifrakturMaguntia({
  variable: "--font-readable",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nat tattoo",
  description: "Nat's personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(banxors.variable, readable.variable, "overflow-hidden")}>
      <body
        className={clsx(
          "font-banxors antialiased",
          "min-h-screen overflow-hidden",
          "bg-linear-to-b from-primary to-secondary"
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
