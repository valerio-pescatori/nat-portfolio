"use client";

import type { Locale } from "@/utils/locale";
import { setLocaleCookie, useLocale } from "@/utils/locale";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnimatedLink from "./AnimatedLink";

export default function Header() {
  const router = useRouter();
  const { t, locale, pathname } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

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

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;
    if (!overlay || !menu) return;

    const items = menu.querySelectorAll(".animated-link-item");

    // Normalize base (closed) state before creating the new timeline.
    // This avoids stale inline styles after locale/layout remounts.
    gsap.set(overlay, { autoAlpha: 0 });
    overlay.style.pointerEvents = "none";
    gsap.set(menu, { x: "100%" });
    if (items.length) {
      gsap.set(items, { autoAlpha: 0, y: 18 });
    }

    const tl = gsap.timeline({ paused: true });

    tl.to(
      overlay,
      {
        autoAlpha: 1,
        duration: 0.25,
        ease: "power1.out",
        onStart: () => {
          overlay.style.pointerEvents = "auto";
        },
      },
      0
    );

    tl.fromTo(menu, { x: "100%" }, { x: "0%", duration: 0.5, ease: "power3.out" }, 0);

    // Target the stable class for animated links so remounts don't break selection
    tl.to(
      items,
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.36,
        ease: "power2.out",
      },
      0.12
    );

    tl.eventCallback("onReverseComplete", () => {
      overlay.style.pointerEvents = "none";
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 18 });
      }
    });

    tlRef.current = tl;

    // If the menu is currently open (e.g. locale switch while open), keep the UI consistent.
    tl.progress(openRef.current ? 1 : 0).pause();

    return () => {
      tl.kill();
      const cleared = menu.querySelectorAll(".animated-link-item");
      if (cleared.length) gsap.set(cleared, { clearProps: "opacity,visibility,transform" });
    };
  }, [locale]);

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

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      tl.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.reverse();
      document.body.style.overflow = "";
    }
  }, [open, locale]);

  return (
    <nav
      ref={navRef}
      className={`fixed w-full top-0 left-0 z-20 p-4 font-readable transition-colors duration-200 ${
        scrolled ? "bg-primary" : ""
      }`}
    >
      <div className="flex justify-end items-center gap-4">
        {/* Locale switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setLocaleCookie("it");
              router.push(getLocalizeHref("it"));
            }}
            className={`cursor-pointer px-2 py-1 text-sm rounded transition-opacity ${
              locale === "it" ? "font-semibold" : "opacity-70 hover:opacity-100"
            }`}
          >
            IT
          </button>
          <button
            onClick={() => {
              setLocaleCookie("en");
              router.push(getLocalizeHref("en"));
            }}
            className={`cursor-pointer px-2 py-1 text-sm rounded transition-opacity ${
              locale === "en" ? "font-semibold" : "opacity-70 hover:opacity-100"
            }`}
          >
            EN
          </button>
        </div>

        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md cursor-pointer"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/60 opacity-0 pointer-events-none"
      />

      <aside
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-primary shadow-lg translate-x-full"
        aria-hidden={!open}
      >
        <div className="p-6 flex items-center justify-between">
          <h3 className="font-banxors text-4xl">Menu</h3>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 cursor-pointer">
            <X />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-6 pl-6 text-2xl" key={locale}>
          <AnimatedLink href={`/${locale}`} onClick={() => setOpen(false)}>
            {t("home")}
          </AnimatedLink>
          <AnimatedLink href={`/${locale}/portfolio`} onClick={() => setOpen(false)}>
            {t("portfolio")}
          </AnimatedLink>
          <AnimatedLink href={`/${locale}/book-a-session`} onClick={() => setOpen(false)}>
            {t("book_a_session")}
          </AnimatedLink>
        </nav>
      </aside>
    </nav>
  );
}
