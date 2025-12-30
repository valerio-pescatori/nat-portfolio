"use client";
import { extractTranslate } from "@/utils/extractTranslate ";
import clsx from "clsx";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import { useCallback, useEffect, useRef } from "react";

export default function Home() {
  const TOTAL_ELEMENTS = 8;
  const RADIUS_MULTIPLIER = 0.5;

  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<LenisRef | null>(null);

  const getRadius = () => {
    const viewportWidth = window.innerWidth;
    return viewportWidth * RADIUS_MULTIPLIER;
  };

  const placeSquares = useCallback((delta = 0) => {
    const r = getRadius();

    blocks.current.forEach((block, i) => {
      if (!block) return;
      // angolo di origine
      let angle = ((2 * Math.PI) / TOTAL_ELEMENTS) * i;
      const currentTranslate = extractTranslate(block.style.transform);
      // if res exists, extract the angle
      if (currentTranslate) {
        angle = Math.atan2(currentTranslate.y, currentTranslate.x);
      }

      // posizione del blocco tramite seno e coseno
      const x = r * Math.cos(angle + delta);
      const y = r * Math.sin(angle + delta);

      if (i === 1) {
        // console.log(`block: ${i}, x: ${x}, y: ${y}\ndelta: ${delta}`);
      }
      block.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, []);

  useEffect(() => {
    // initial position
    placeSquares();
  }, [blocks, placeSquares]);

  const lastAnimatedScroll = useRef<number>(0);
  const lastDirection = useRef<number>(0);

  useLenis(
    (x) => {
      if (!x.isScrolling) return;
      // update position
      const r = getRadius();
      // animatedScroll mi da la distanza dall'inizio dell'azione di scroll.
      // io posiziono ogni elemento sommando l'angolo attuale alla distanza dall'inizio dello scrol.
      // devo invece prendere come delta solo la differenza tra l'animatedScrollAttuale e quello dell'esecuzione precedente.
      let deltaAnimatedScroll = x.animatedScroll - lastAnimatedScroll.current;
      if (
        // se inizio una nuova scrollAction
        (deltaAnimatedScroll < 0 && x.direction === 1) ||
        (deltaAnimatedScroll > 0 && x.direction === -1)
      ) {
        // uso il valore pure come delta
        deltaAnimatedScroll = x.animatedScroll;
      }
      // // se cambio direzione
      // if (x.direction !== lastDirection.current){
        
      // }
        console.log(`
        lastAnimatedScroll: ${lastAnimatedScroll.current}
        animatedScroll: ${x.animatedScroll}
        deltaAnimatedScroll: ${deltaAnimatedScroll}
        lastDirection: ${lastDirection.current}
        direction: ${x.direction}
        `);
      const scrollTop = deltaAnimatedScroll * 0.00002;
      lastDirection.current = x.direction;
      lastAnimatedScroll.current = x.animatedScroll;
      const deltaRad = scrollTop * r;
      placeSquares(deltaRad);
    },
    [blocks]
  );

  return (
    <ReactLenis
      root="asChild"
      className="text-3xl w-full relative h-screen overflow-auto"
      ref={lenisRef}
      options={{ infinite: true, syncTouch: true }}
    >
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
