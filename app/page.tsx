"use client";
import clsx from "clsx";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import { useRef, useState } from "react";

export default function Home() {
  const [rotation, setRotation] = useState(0);
  const TOTAL_ELEMENTS = 8;
  const RADIUS_MULTIPLIER = 0.5;

  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<LenisRef | null>(null);

  const getRadius = () => {
    const viewportWidth = window.innerWidth;
    return viewportWidth * RADIUS_MULTIPLIER;
  };

  const lastAnimatedScroll = useRef(0);

  useLenis(
    (e) => {
      if (!e.isScrolling) {
        lastAnimatedScroll.current = 0;
        return;
      }
      // update rotation
      const delta = e.animatedScroll - lastAnimatedScroll.current;
      lastAnimatedScroll.current = e.animatedScroll;
      setRotation((r) => r + delta * 0.5);
    },
    [blocks]
  );

  return (
    <>
      <ReactLenis
        root="asChild"
        className="text-3xl w-full relative h-screen overflow-auto"
        ref={lenisRef}
        options={{ infinite: true, syncTouch: true }}
      >
        <div
          id="wrapper"
          className="pointer-events-none absolute inset-0 top-1/2 -translate-1/2"
          style={{ rotate: `${rotation}deg` }}
        >
          {Array.from({ length: TOTAL_ELEMENTS }).map((_, i) => {
            const r = getRadius();
            const angle = (360 / TOTAL_ELEMENTS) * i;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * r;
            const y = Math.sin(radian) * r;

            return (
              <div
                className={clsx(
                  "w-32 bg-white aspect-square border-2 rounded-lg flex items-center justify-center",
                  "absolute top-1/2 left-1/2"
                )}
                style={{ rotate: `${-rotation}deg`, translate: `calc(-50% - ${x}px) calc(-50% - ${y}px)` }}
                key={i}
                ref={(element) => {
                  blocks.current[i] = element;
                }}
              >
                {i}
              </div>
            );
          })}
        </div>
      </ReactLenis>
    </>
  );
}
