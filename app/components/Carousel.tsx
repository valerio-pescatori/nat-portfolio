"use client";
import { useMounted } from "@/utils/hooks/useMounted";
import clsx from "clsx";
import { ReactLenis, useLenis } from "lenis/react";
import Image, { StaticImageData } from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

export type CarouselProps = {
  images: readonly StaticImageData[];
  onClick?: (image: StaticImageData) => void;
};

export default function Carousel({ images, onClick }: CarouselProps) {
  const [rotation, setRotation] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number | null>(
    typeof window !== "undefined" ? window.innerWidth : null,
  );
  const isMounted = useMounted();
  const totalElements = images.length;

  const blocks = useRef<(HTMLButtonElement | null)[]>([]);
  const lastAnimatedScroll = useRef(0);

  const radius = useMemo(() => {
    if (typeof window === "undefined" || windowWidth === null) return 0;
    const cardSize = windowWidth * 0.8;

    // Dynamic spacing based on viewport width
    let spacing = 1.4; // Default for small screens (up to 650px)
    if (windowWidth > 650 && windowWidth <= 1024) {
      spacing = 1.2; // Medium screens
    } else if (windowWidth > 1024) {
      spacing = 1; // Large screens
    }

    const radius = (cardSize * spacing * totalElements) / (2 * Math.PI);
    return radius;
  }, [totalElements, windowWidth]);

  // Calculate which cards are visible based on rotation.
  // The wrapper (circle) center sits at x = viewportWidth/2 - radius.
  // After the wrapper rotates by (180 + rotation)°, each card's screen-x is:
  //   circleCenterX + radius * cos(cardAngle + rotation)
  // A card is visible when any part of it overlaps the viewport [0, viewportWidth].
  const visibleIndices = useMemo(() => {
    const indices = new Set<number>();
    if (windowWidth === null || radius === 0) return indices;

    const circleCenterX = windowWidth / 2 - radius;
    const cardWidth = Math.min(windowWidth * 0.8, 550);

    for (let i = 0; i < totalElements; i++) {
      const cardAngle = (360 / totalElements) * i;
      const effectiveRad = ((cardAngle + rotation) * Math.PI) / 180;
      const cardX = circleCenterX + radius * Math.cos(effectiveRad);

      // Card is visible if any part overlaps the viewport
      const isVisible = cardX + cardWidth / 2 > 0 && cardX - cardWidth / 2 < windowWidth;

      if (isVisible) {
        indices.add(i);
      }
    }
    return indices;
  }, [rotation, totalElements, windowWidth, radius]);

  // Set initial window width and listen for resize using useLayoutEffect
  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLenis(
    (e) => {
      // first render
      if (e.direction === 0) {
        // e.scrollTo(-1000, {
        //   programmatic: true,
        //   lerp: 0.03,
        // });
      }
      // on animation stop
      if (!e.isScrolling) {
        lastAnimatedScroll.current = 0;
        return;
      }
      // update rotation
      const delta = e.animatedScroll - lastAnimatedScroll.current;
      lastAnimatedScroll.current = e.animatedScroll;
      setRotation((r) => (r + delta * 0.25) % 360);
    },
    [blocks],
  );

  if (!isMounted) return null;

  return (
    <>
      <ReactLenis
        root="asChild"
        autoRaf
        className="text-3xl w-full relative h-dvh perspective-distant perspective-origin-center"
        onTouchStart={() => (lastAnimatedScroll.current = 0)}
        options={{
          infinite: true,
          syncTouch: true,
          touchMultiplier: 0.175,
          lerp: 0.05,
          syncTouchLerp: 0.05,
          virtualScroll: (data) => {
            data.deltaY *= -1;
            return true;
          },
        }}
      >
        <div
          id="wrapper"
          className="absolute inset-0 top-1/2 transform-3d"
          style={{
            rotate: `${180 + rotation}deg`,
            translate: `-${radius}px -50%`,
          }}
        >
          {images.map((src, i) => {
            // Skip rendering cards that aren't visible
            if (!visibleIndices.has(i)) {
              return null;
            }

            const angle = (360 / totalElements) * i;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <button
                className={clsx(
                  "bg-white aspect-square shadow-2xl border overflow-hidden flex items-center justify-center",
                  "absolute top-1/2 left-1/2 will-change-transform",
                  "backface-hidden",
                )}
                style={{
                  rotate: `${angle + 180}deg`,
                  translate: `calc(-50% - ${x}px) calc(-50% - ${y}px)`,
                  contain: "layout style paint",
                  width: "min(80%, 550px)",
                }}
                key={i}
                ref={(element) => {
                  blocks.current[i] = element;
                }}
                onClick={() => onClick?.(src)}
              >
                <Image
                  src={src}
                  alt={`image-${i}`}
                  className="w-full grayscale-75 h-full object-cover bg-transparent"
                />
              </button>
            );
          })}
        </div>
      </ReactLenis>
    </>
  );
}
