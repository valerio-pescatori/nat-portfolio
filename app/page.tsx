"use client";
import clsx from "clsx";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

export default function Home() {
  const TOTAL_ELEMENTS = 10;
  const RADIUS_MULTIPLIER = 0.5;

  const spacer = useRef<HTMLDivElement | null>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<LenisRef | null>(null);

  const getRadius = () => {
    const viewportWidth = window.innerWidth;
    return viewportWidth * RADIUS_MULTIPLIER;
  };

  useEffect(() => {
    // scoll to midway point
    const l = lenisRef?.current?.lenis;
    if (!l) return;
    l.scrollTo(l.limit / 2, { immediate: true });
  }, [lenisRef]);

  useEffect(() => {
    // initial position
    placeSquares();
  }, [blocks]);

  useLenis(
    (x) => {
      console.log(x)
      if(!x.isScrolling) return;
      // update position
      const r = getRadius();
      const scrollTop = x.animatedScroll * 0.00002;
      const deltaRad = scrollTop * r;
      placeSquares(deltaRad);
    },
    [blocks]
  );

  const placeSquares = (delta = 0) => {
    const r = getRadius();

    blocks.current.forEach((block, i) => {
      const angle = ((2 * Math.PI) / TOTAL_ELEMENTS) * i;

      // posizione del blocco tramite seno e coseno
      const x = r * Math.cos(angle + delta);
      const y = r * Math.sin(angle + delta);

      block!.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  return (
    <ReactLenis
      root="asChild"
      className="text-3xl w-full relative h-screen overflow-auto"
      ref={lenisRef}
      options={{ infinite: true }}
    >
      <div className="fixed w-px bg-black h-full left-1/2 top-0 -transform-x-1/2" />
      <div id="wrapper" className="pointer-events-none fixed inset-0 top-1/2 -translate-y-1/2">
        {Array.from({ length: TOTAL_ELEMENTS }).map((_, i) => (
          <div
            className={clsx(
              "w-32 bg-white aspect-square border-2 rounded-lg flex items-center justify-center",
              "absolute"
            )}
            key={i}
            ref={(element) => {
              blocks.current[i] = element;
            }}
          >
            {i}
          </div>
        ))}
      </div>
    </ReactLenis>
  );
}
