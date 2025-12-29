"use client";

import { throttleTrailing } from "@/utils/throttle";
import clsx from "clsx";
import { useEffect, useRef } from "react";

export default function Home() {
  const TOTAL_ELEMENTS = 10;
  const spacer = useRef<HTMLDivElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!spacer.current || !scrollContainer.current) return;
    // scoll to midway
    console.log(spacer.current.scrollHeight);
    // NOT WORKING
    scrollContainer.current.scrollTo({
      top: spacer.current.scrollHeight / 2,
      behavior: "instant",
    });
  }, [spacer, scrollContainer]);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    // il raggio del cerchio è la metà della viewport
    const r = viewportWidth / 2;
    blocks.current.forEach((block, i) => {
      const angle = ((2 * Math.PI) / TOTAL_ELEMENTS) * i;

      // posizione del blocco tramite seno e coseno
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);

      block!.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, [blocks]);

  const handleScroll = () => {
    const viewportWidth = window.innerWidth;
    // il raggio del cerchio è la metà della viewport
    const r = viewportWidth / 2;
    const scrollTop = scrollContainer.current!.scrollTop;

    const deltaRad = scrollTop / r;
    // take the position of the block and add the rotation rad
    blocks.current.forEach((block, i) => {
      const angle = ((2 * Math.PI) / TOTAL_ELEMENTS) * i;
      const x = r * Math.cos(angle + deltaRad);
      const y = r * Math.sin(angle + deltaRad);
      block!.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  return (
    <main
      className="text-3xl w-full relative h-screen overflow-auto"
      ref={scrollContainer}
      onScroll={throttleTrailing(handleScroll, 100)}
    >
      <div className="fixed w-px bg-black h-full left-1/2 top-0 -transform-x-1/2" />
      <div className="h-9999999" ref={spacer} />
      <div id="wrapper" className="pointer-events-none fixed inset-0 top-1/2 -translate-y-1/2">
        {Array.from({ length: TOTAL_ELEMENTS }).map((_, i) => (
          <div
            className={clsx(
              "w-3/4 bg-white aspect-square transition-transform border-2 rounded-lg flex items-center justify-center",
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
    </main>
  );
}
