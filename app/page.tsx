"use client";
import { useMounted } from "@/utils/hooks/useMounted";
import clsx from "clsx";
import { LenisRef, ReactLenis, useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import octopus from "./assets/images/octopus.jpg";

export default function Home() {
  const isMounted = useMounted();
  const [rotation, setRotation] = useState(0);
  const TOTAL_ELEMENTS = 10;

  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<LenisRef | null>(null);
  const lastAnimatedScroll = useRef(0);

  const getRadius = () => {
    const cardSize = window.innerWidth * 0.75;
    const spacing = 1.4;
    const radius = (cardSize * spacing * TOTAL_ELEMENTS) / (2 * Math.PI);
    return radius;
  };

  // Calculate visibility based on viewport position
  useEffect(() => {
    const updateVisibility = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;

      blocks.current.forEach((block) => {
        if (!block) return;

        const rect = block.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Calculate distance from viewport center
        const distanceX = cardCenterX - centerX;
        const distanceY = cardCenterY - centerY;

        // Maximum distance for fade calculation (adjust for desired effect range)
        const maxDistance = viewportWidth * 1.6;

        const normalizedDistanceX = Math.min(distanceX / maxDistance, 1);
        const normalizedDistanceY = Math.min(distanceY / maxDistance, 1);
        // Transform the normalizedDistance into positive X and negative Y rotation
        const rotationX = normalizedDistanceX * 45;
        const rotationY = -normalizedDistanceY * 45;
        const rotationZ = normalizedDistanceY * 15;

        block.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${-rotation + rotationZ}deg)`;
      });
    };

    updateVisibility();

    // Update on window resize
    window.addEventListener("resize", updateVisibility);
    return () => window.removeEventListener("resize", updateVisibility);
  }, [rotation]);

  useLenis(
    (e) => {
      if (!e.isScrolling) {
        lastAnimatedScroll.current = 0;
        return;
      }
      // update rotation
      const delta = e.animatedScroll - lastAnimatedScroll.current;
      lastAnimatedScroll.current = e.animatedScroll;
      setRotation((r) => (r + delta * 0.25) % 360);
    },
    [blocks]
  );

  if (!isMounted) return null;

  return (
    <>
      <ReactLenis
        root="asChild"
        autoRaf
        className="text-3xl w-full relative h-screen"
        ref={lenisRef}
        onTouchStart={() => (lastAnimatedScroll.current = 0)}
        options={{
          infinite: true,
          syncTouch: true,
          touchMultiplier: 0.4,
          lerp: 0.04,
          syncTouchLerp: 0.04,
          virtualScroll: (data) => {
            data.deltaY *= -1;
            return true;
          },
        }}
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
                  "bg-white aspect-square shadow-2xl border overflow-hidden rounded-lg flex items-center justify-center",
                  "absolute top-1/2 left-1/2"
                )}
                style={{
                  translate: `calc(-50% - ${x}px) calc(-50% - ${y}px)`,
                  width: "min(75%, 450px)",
                }}
                key={i}
                ref={(element) => {
                  blocks.current[i] = element;
                }}
              >
                <Image src={octopus} alt="image" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </ReactLenis>
    </>
  );
}
