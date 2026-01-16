"use client";

import type { Locale } from "@/utils/locale";
import { setLocaleCookie, useLocale } from "@/utils/locale";
import clsx from "clsx";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const router = useRouter();
  const { locale, pathname } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Set cookie when locale changes
  useEffect(() => {
    setLocaleCookie(locale as Locale);
  }, [locale]);

  const getLocalizeHref = (targetLocale: Locale) => {
    // Extract clean path by removing current locale prefix
    let cleanPath = pathname;
    const firstSegment = pathname.split("/")[1];
    if (["en", "it"].includes(firstSegment)) {
      cleanPath = pathname.slice(firstSegment.length + 1) || "/";
    }
    return `/${targetLocale}${cleanPath}`;
  };

  // Toggle nav background when scrolling past the nav height
  useEffect(() => {
    const onScroll = () => {
      const navEl = navRef.current;
      if (!navEl) return;
      const navHeight = navEl.offsetHeight;
      setScrolled(window.scrollY > navHeight);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={clsx(
        "fixed w-full bottom-0 top-auto md:top-0 md:bottom-auto right-0 md:left-0 z-20 p-4 font-readable transition-colors duration-200",
        scrolled && "bg-primary"
      )}
    >
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={() => {
            setLocaleCookie("it");
            router.push(getLocalizeHref("it"));
          }}
          className={clsx(
            "cursor-pointer px-2 text-sm rounded transition-opacity",
            locale === "it" ? "font-semibold" : "opacity-70 hover:opacity-100"
          )}
        >
          IT
        </button>
        <button
          onClick={() => {
            setLocaleCookie("en");
            router.push(getLocalizeHref("en"));
          }}
          className={clsx(
            "cursor-pointer px-2 text-sm rounded transition-opacity",
            locale === "en" ? "font-semibold" : "opacity-70 hover:opacity-100"
          )}
        >
          EN
        </button>
        {pathname !== `/${locale}` && (
          <Link href={`/${locale}`} className="px-2">
            <Undo2 size={18} />
          </Link>
        )}
      </div>
    </nav>
  );
}
