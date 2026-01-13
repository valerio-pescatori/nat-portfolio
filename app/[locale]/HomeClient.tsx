"use client";

import { getLocalizedPath, useLocale } from "@/utils/locale";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Image from "next/image";
import propic from ".././../public/propic.jpg";
import AnimatedLink from "../components/AnimatedLink";
import AnimatedText from "../components/AnimatedText";
import clsx from "clsx";

export default function HomeClient() {
  const { t, locale } = useLocale();
  const textRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    // parallax effect with GSAP interpolation
    const { clientX, clientY } = event;
    const { left, top, width, height } = document.documentElement.getBoundingClientRect();

    const distanceX = clientX - (left + width / 2);
    const distanceY = clientY - (top + height / 2);
    const targetX = 40 + (distanceX / width) * 10; // adjust the multiplier for more/less movement
    const targetY = 40 + (distanceY / height) * 10;

    // Use GSAP to smoothly interpolate to the target values
    gsap.to(textRef.current, {
      attr: {
        style: `background-position: ${targetX}% ${targetY}%`,
      },
      duration: 2,
      ease: "power4.out",
    });

    gsap.to(mainRef.current, {
      background: `radial-gradient(circle at ${clientX}px ${clientY}px, var(--primary), var(--dark-secondary))`,
      duration: 3,
      ease: "power1.out",
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className={clsx("h-screen relative flex flex-col", "md:bg-none")}
      style={{ background: `radial-gradient(circle at top left, var(--primary), var(--dark-secondary))` }}
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
              "text-[15rem] leading-60 md:text-[30rem] md:leading-120",
              "text-inherit md:text-transparent",
              "bg-none md:bg-[url(/propic.jpg)] bg-clip-text "
            )}
            ref={textRef}
            style={{ backgroundPosition: "40% 40%", animationFillMode: "backwards" }}
          >
            Nat
            <span className="sr-only">Tattoo</span>
          </h1>
        </AnimatedText>
        <div className="font-readable flex flex-col gap-2">
          <AnimatedText className="animation-delay-1500">
            <h2 className="text-2xl ">{t("tattoo_artist")}</h2>
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
