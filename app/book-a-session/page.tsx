"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Send } from "lucide-react";
import clsx from "clsx";
import { Pirata_One } from "next/font/google";

const pirata = Pirata_One({ subsets: ["latin"], display: "swap", weight: "400" });

export default function BookASession() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    // Reset all elements to their initial state
    gsap.set([titleRef.current, descriptionRef.current, formRef.current], {
      opacity: 0,
      y: 0,
      clearProps: "all",
    });

    const tl = gsap.timeline();

    // Animate title
    tl.from(titleRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate description
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

    // Animate form
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

    // Animate button on submit
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

    // Redirect after animation
    setTimeout(() => {
      const encodedText = encodeURI(value);
      window.location.href = `https://wa.me/393207528036?text=${encodedText}`;
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      className={`${pirata.className} min-h-screen flex items-center justify-center px-4 py-20`}
    >
      <div className="w-full max-w-2xl">
        {/* Title */}
        <h1 ref={titleRef} className={`text-5xl md:text-7xl font-semibold text-center mb-8`}>
          Book a session
        </h1>

        {/* Description */}
        <p ref={descriptionRef} className="text-lg md:text-xl text-center mb-12 text-foreground/80">
          Tell me about your idea below and hit send — you&apos;ll start a WhatsApp chat with me directly.
        </p>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              name="text"
              placeholder="Describe your tattoo idea..."
              className={clsx(
                "w-full p-4 rounded-lg border-2 border-detail bg-primary/10",
                "font-inter text-base placeholder-foreground/40",
                "focus:outline-none focus:border-foreground focus:ring-2 focus:ring-primary/30",
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

          {/* Submit Button */}
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
            <span>{submitted ? "Sending..." : "Send message"}</span>
            <Send size={20} />
          </button>
        </form>

        {/* Success message */}
        {submitted && (
          <p className={`mt-8 text-center text-primary font-semibold text-lg animate-fade-in`}>
            ✓ Redirecting to WhatsApp...
          </p>
        )}
      </div>
    </div>
  );
}
