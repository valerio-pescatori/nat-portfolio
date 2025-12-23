"use client";
import clsx, { ClassValue } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { JSX } from "react";

export function EmblaCarousel({ slides, className }: { slides: JSX.Element[]; className?: ClassValue }) {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <div className={clsx("overflow-hidden shadow-xl", className)} ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, i) => (
          <div key={`image-${i}`} className="min-w-0 flex-none basis-full">
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
