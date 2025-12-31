"use client";
import clsx from "clsx";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import { useRef, useState } from "react";

export default function Home() {
  const [rotation, setRotation] = useState(0);
  const TOTAL_ELEMENTS = 8;

  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<LenisRef | null>(null);

  const getRadius = () => {
    const cardSize = 520;
    const spacing = 1.4;
    const radius = (cardSize * spacing * TOTAL_ELEMENTS) / (2 * Math.PI);
    return radius;
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
      setRotation((r) => r + delta * 0.25);
    },
    [blocks]
  );

  return (
    <>
      <ReactLenis
        root="asChild"
        className="text-3xl w-full relative h-screen"
        ref={lenisRef}
        onTouchStart={() => (lastAnimatedScroll.current = 0)}
        options={{ infinite: true, syncTouch: true, touchMultiplier: 0.4, lerp: 0.04 }}
      >
        <div
          id="wrapper"
          className="pointer-events-none absolute inset-0 top-1/2"
          style={{ rotate: `${rotation}deg`, translate: `-${getRadius()}px -50%` }}
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
                  "w-3/4 bg-white aspect-square border-2 rounded-lg flex items-center justify-center",
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
