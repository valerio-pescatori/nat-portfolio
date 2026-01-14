"use client";

import { getLocalizedPath, useLocale } from "@/utils/locale";
import clsx from "clsx";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import propic from ".././../public/propic.jpg";
import AnimatedLink from "../components/AnimatedLink";
import AnimatedText from "../components/AnimatedText";

export default function HomeClient() {
  const { t, locale } = useLocale();
  const textRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gradientPos = { x: 0, y: 0 };
    const parallaxPos = { x: 40, y: 40 };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const parallaxX = 40 + (distanceX / window.innerWidth) * 10;
      const parallaxY = 40 + (distanceY / window.innerHeight) * 10;

      gsap.to(gradientPos, {
        x: clientX,
        y: clientY,
        duration: 2,
        ease: "power4.out",
        onUpdate: () => {
          if (mainRef.current) {
            mainRef.current.style.background = `radial-gradient(circle at ${gradientPos.x}px ${gradientPos.y}px, var(--primary), var(--dark-secondary))`;
          }
        },
      });

      gsap.to(parallaxPos, {
        x: parallaxX,
        y: parallaxY,
        duration: 2,
        ease: "power4.out",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.style.backgroundPosition = `${parallaxPos.x}% ${parallaxPos.y}%`;
          }
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className={clsx("h-dvh relative flex flex-col", "md:bg-none")}
      style={{
        background: `radial-gradient(circle at 0 0, var(--primary), var(--dark-secondary))`,
      }}
    >
      <div className="pointer-events-none block md:hidden absolute inset-0 z-10 bg-linear-to-b from-primary/0 via-primary md:via-60% lg:via-80% xl:via-100% via-40% to-secondary" />
      <Image
        src={propic}
        alt="Nat tattoo artist portrait"
        className="block md:hidden w-full animate-fade-in"
        priority
      />

      <div className="z-10 text-center absolute top-1/2 left-1/2 -translate-1/2">
        <AnimatedText className="animate-rise-and-fade">
          <h1
            className={clsx(
              "text-[15rem] leading-64 md:text-[30rem] md:leading-124",
              "text-inherit md:text-transparent",
              "bg-none md:bg-[url(/propic.jpg)] bg-clip-text [-webkit-text-stroke:4px_var(--foreground)] ",
            )}
            data-before="Nat"
            ref={textRef}
            style={{
              backgroundPosition: "40% 40%",
              animationFillMode: "backwards",
            }}
          >
            Nat
            <span className="sr-only">Tattoo</span>
          </h1>
        </AnimatedText>
        <div className="font-readable flex flex-col gap-2">
          <AnimatedText className="animation-delay-1500">
            <h2 className="text-6xl font-banxors">{t("tattoo_artist")}</h2>
          </AnimatedText>
          <AnimatedLink
            href={getLocalizedPath(locale, "/portfolio")}
            className="text-lg transition-opacity animate-fade-in animation-delay-2000"
            style={{ animationFillMode: "backwards" }}
          >
            {t("portfolio")}
          </AnimatedLink>
          <AnimatedLink
            href={getLocalizedPath(locale, "/book-a-session")}
            className="text-lg transition-opacity animate-fade-in animation-delay-2500"
            style={{ animationFillMode: "backwards" }}
          >
            {t("book_a_session")}
          </AnimatedLink>
        </div>
      </div>
    </main>
  );
}
