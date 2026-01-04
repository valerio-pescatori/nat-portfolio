"use client";
import { useMounted } from "@/utils/hooks/useMounted";
import clsx from "clsx";
import { ReactLenis, useLenis } from "lenis/react";
import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type CarouselProps = {
  images: StaticImageData[];
  onClick?: (image: StaticImageData) => void;
};

export default function Carousel({ images, onClick }: CarouselProps) {
  const [rotation, setRotation] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number | null>(
    typeof window !== "undefined" ? window.innerWidth : null
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

  const updateVisibility = useCallback(() => {
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
  }, [rotation]);

  // Set initial window width and listen for resize using useLayoutEffect
  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate visibility based on viewport position
  useEffect(() => {
    updateVisibility();

    const handleResizeVisibility = () => {
      updateVisibility();
    };

    // Update on window resize
    window.addEventListener("resize", handleResizeVisibility);
    return () => window.removeEventListener("resize", handleResizeVisibility);
  }, [updateVisibility]);

  useLenis(
    (e) => {
      // first render
      if (e.direction === 0) {
        updateVisibility();
        e.scrollTo(-1000, {
          programmatic: true,
          lerp: 0.03,
        });
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
    [blocks]
  );

  if (!isMounted) return null;

  return (
    <>
      <ReactLenis
        root="asChild"
        autoRaf
        className="text-3xl w-full relative h-screen"
        onTouchStart={() => (lastAnimatedScroll.current = 0)}
        options={{
          infinite: true,
          syncTouch: true,
          touchMultiplier: 0.2,
          lerp: 0.08,
          syncTouchLerp: 0.08,
          virtualScroll: (data) => {
            data.deltaY *= -1;
            return true;
          },
        }}
      >
        <div
          id="wrapper"
          className="absolute inset-0 top-1/2"
          style={{ rotate: `${rotation}deg`, translate: `-${radius}px -50%` }}
        >
          {images.map((src, i) => {
            const angle = (360 / totalElements) * i;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <button
                className={clsx(
                  "bg-white aspect-square shadow-2xl border overflow-hidden flex items-center justify-center",
                  "absolute top-1/2 left-1/2"
                )}
                style={{
                  translate: `calc(-50% - ${x}px) calc(-50% - ${y}px)`,
                  width: "min(80%, 550px)",
                }}
                key={i}
                ref={(element) => {
                  blocks.current[i] = element;
                }}
                onClick={() => onClick?.(src)}
              >
                <Image src={src} alt={`image-${i}`} className="w-full grayscale-75 h-full object-cover bg-transparent" />
              </button>
            );
          })}
        </div>
      </ReactLenis>
    </>
  );
}
