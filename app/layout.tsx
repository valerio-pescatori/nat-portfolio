import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import clsx from "clsx";

const banxors = localFont({
  src: "./fonts/Banxors.otf",
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
    <html lang="en">
      <body
        className={clsx(
          banxors.className,
          "antialiased",
          "bg-[linear-gradient(rgba(0,0,0,0.2)),url(./assets/hearts_bg.jpg)] bg-cover bg-center"
        )}
      >
        {children}
      </body>
    </html>
  );
}
