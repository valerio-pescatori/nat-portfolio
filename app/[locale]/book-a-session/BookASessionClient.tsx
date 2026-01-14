"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Send } from "lucide-react";
import clsx from "clsx";
import { useLocale } from "@/utils/locale";

export default function BookASessionClient() {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    gsap.set([titleRef.current, descriptionRef.current, formRef.current], {
      opacity: 0,
      y: 0,
      clearProps: "all",
    });

    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    tl.from(
      descriptionRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    tl.from(
      formRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleButtonHover = (entering: boolean) => {
    gsap.to(buttonRef.current, {
      y: entering ? -4 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value.trim()) return;

    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
    });

    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      delay: 0.1,
    });

    setSubmitted(true);

    const encodedText = encodeURI(value);
    window.location.href = `https://wa.me/393891589441?text=${encodedText}`;
  };

  return (
    <div ref={containerRef} className={`font-readable min-h-dvh flex items-center justify-center px-4 py-20`}>
      <div className="w-full max-w-2xl">
        <h1 ref={titleRef} className="text-7xl font-banxors md:text-9xl text-center mb-8">
          {t("book_a_session")}
        </h1>

        <p ref={descriptionRef} className="text-lg md:text-xl text-center mb-12 text-foreground">
          {t("book_description")}
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              name="text"
              placeholder={t("placeholder_tattoo_idea")}
              className={clsx(
                "w-full p-4 rounded-lg border-2 border-detail bg-primary/10",
                "font-inter text-base placeholder-foreground/40",
                "focus:outline-none focus:border-foreground",
                "transition-all duration-300 resize-none",
                "min-h-40"
              )}
            />
            <div
              className={clsx(
                "absolute bottom-3 right-3 text-sm text-foreground/50",
                value.length > 0 && "text-primary"
              )}
            >
              {value.length} / 500
            </div>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={!value.trim() || submitted}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
            className={clsx(
              "py-4 px-8 rounded-full font-semibold text-lg",
              "bg-primary border-2 border-detail shadow-lg",
              "flex items-center justify-center gap-2",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-xl active:scale-95",
              value.trim() && !submitted && "cursor-pointer"
            )}
          >
            <span>{submitted ? t("sending") : t("send_message")}</span>
            <Send size={20} />
          </button>
        </form>

        {submitted && (
          <p className="mt-8 text-center text-primary font-semibold text-lg animate-fade-in">{t("redirecting")}</p>
        )}
      </div>
    </div>
  );
}
