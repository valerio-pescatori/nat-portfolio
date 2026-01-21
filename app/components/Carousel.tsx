"use client";
import clsx from "clsx";
import { ReactLenis, useLenis } from "lenis/react";
import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsClient, useWindowSize } from "usehooks-ts";

export type CarouselProps = {
  images: StaticImageData[];
  onClick?: (image: StaticImageData) => void;
};

export default function Carousel({ images, onClick }: CarouselProps) {
  const [rotation, setRotation] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isClient = useIsClient();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<(HTMLButtonElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibileBlocks = useRef<Set<number>>(new Set());
  const lastAnimatedScroll = useRef(0);

  const totalElements = images.length;

  const radius = useMemo(() => {
    if (!isClient) return 0;
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
  }, [totalElements, windowWidth, isClient]);

  const updateBlocksRotation = useCallback(() => {
    if (!windowWidth || !windowHeight) return;
    const viewportWidth = windowWidth;
    const viewportHeight = windowHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    const transforms = blocksRef.current.map((block, index) => {
      if (!block) return;
      // only update visible blocks
      if (!visibileBlocks.current.has(index)) return;

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
      return {
        rotationX,
        rotationY,
        rotationZ,
      };
    });

    // optimization: read values then batch updates
    const translateValues = blocksRef.current.map((b) => b?.style.translate);

    transforms.forEach((transform, index) => {
      const block = blocksRef.current[index];
      const translateValue = translateValues[index];
      if (!block || !transform || !translateValue) return;

      const { rotationX, rotationY, rotationZ } = transform;

      block.setAttribute(
        "style",
        `
        translate: ${translateValue};
        --rotationX: ${rotationX}deg;
        --rotationY: ${rotationY}deg;
        --rotationZ: ${-rotation + rotationZ}deg;
      `,
      );
    });
  }, [rotation, windowWidth, windowHeight]);

  // Initialize IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = blocksRef.current.indexOf(entry.target as HTMLButtonElement);
        if (entry.isIntersecting) {
          visibileBlocks.current.add(index);
          return;
        }
        visibileBlocks.current.delete(index);
      });
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Calculate visibility based on viewport position
  useEffect(() => {
    updateBlocksRotation();

    const handleResizeVisibility = () => {
      updateBlocksRotation();
    };

    // Update on window resize
    window.addEventListener("resize", handleResizeVisibility);
    return () => window.removeEventListener("resize", handleResizeVisibility);
  }, [updateBlocksRotation]);

  // Lenis scroll handler
  useLenis(
    (e) => {
      // first render
      if (e.direction === 0) {
        updateBlocksRotation();
        e.scrollTo(-100, {
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
    [blocksRef],
  );

  const memoizedBlocks = useMemo(
    () =>
      images.map((src, i) => {
        const angle = (360 / totalElements) * i;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        return (
          <button
            className={clsx(
              "bg-white aspect-square shadow-2xl border overflow-hidden flex items-center justify-center will-change-[transform,translate]",
              "absolute top-1/2 left-1/2",
              "rotate-x-(--rotationX) rotate-y-(--rotationY) rotate-z-(--rotationZ)",
              `w-[min(80%,550px)] contain-content`,
            )}
            style={{
              translate: `calc(-50% - ${x}px) calc(-50% - ${y}px)`,
            }}
            key={i}
            ref={(element) => {
              if (!element) return;
              blocksRef.current[i] = element;
              observerRef.current?.observe(element);
            }}
            onClick={() => onClick?.(src)}
          >
            <Image
              src={src}
              alt={`image-${i}`}
              className="w-full grayscale-75 h-full object-cover bg-transparent"
              placeholder="blur"
              priority={i < 3}
            />
          </button>
        );
      }),
    [images, totalElements, radius, onClick],
  );

  if (!isClient) return null;

  return (
    <>
      <ReactLenis
        root="asChild"
        autoRaf
        className="text-3xl w-full relative h-dvh"
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
          ref={wrapperRef}
          className="absolute inset-0 top-1/2 will-change-[rotate,translate]"
          style={{
            rotate: `${rotation}deg`,
            translate: `-${radius}px -50%`,
          }}
        >
          {memoizedBlocks}
        </div>
      </ReactLenis>
    </>
  );
}
