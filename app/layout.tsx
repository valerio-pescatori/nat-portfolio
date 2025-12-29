import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import clsx from "clsx";
import { Inter } from "next/font/google";

const banxors = localFont({
  variable: "--font-banxors",
  src: "./assets/fonts/Banxors.otf",
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={clsx(banxors.variable, inter.variable)}>
      <body className={clsx("font-banxors antialiased", "min-h-screen", "bg-primary")}>{children}</body>
    </html>
  );
}
