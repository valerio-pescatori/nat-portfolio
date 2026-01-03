"use client";

import AnimatedLink from "./AnimatedLink";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";

export default function Header() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;
    if (!overlay || !menu) return;

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

    tl.from(
      menu.querySelectorAll("a"),
      { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.36, ease: "power2.out" },
      0.12
    );

    tl.eventCallback("onReverseComplete", () => {
      overlay.style.pointerEvents = "none";
    });

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
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
  }, [open]);

  return (
    <nav className="fixed w-full top-0 left-0 z-50 p-4 font-readable">
      <div className="flex justify-end">
        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/60 opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      />

      <aside
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-primary shadow-lg translate-x-full"
        aria-hidden={!open}
      >
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
            <X />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-6 pl-6 text-2xl">
          <AnimatedLink href="/" onClick={() => setOpen(false)} className="">
            Home
          </AnimatedLink>
          <AnimatedLink href="/portfolio" onClick={() => setOpen(false)} className="">
            Portfolio
          </AnimatedLink>
          <AnimatedLink href="/book-a-session" onClick={() => setOpen(false)} className="">
            Book a session
          </AnimatedLink>
        </nav>
      </aside>
    </nav>
  );
}
