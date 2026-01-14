"use client";

import Image, { StaticImageData } from "next/image";
import tattoo_1 from "../../assets/images/tattoos/tattoo_1.jpg";
import tattoo_2 from "../../assets/images/tattoos/tattoo_2.jpg";
import tattoo_3 from "../../assets/images/tattoos/tattoo_3.jpg";
import tattoo_4 from "../../assets/images/tattoos/tattoo_4.jpg";
import tattoo_5 from "../../assets/images/tattoos/tattoo_5.jpg";
import tattoo_6 from "../../assets/images/tattoos/tattoo_6.jpg";
import tattoo_7 from "../../assets/images/tattoos/tattoo_7.jpg";
import tattoo_8 from "../../assets/images/tattoos/tattoo_8.jpg";
import tattoo_9 from "../../assets/images/tattoos/tattoo_9.jpg";
import tattoo_10 from "../../assets/images/tattoos/tattoo_10.jpg";
import tattoo_11 from "../../assets/images/tattoos/tattoo_11.jpg";
import tattoo_12 from "../../assets/images/tattoos/tattoo_12.jpg";
import tattoo_13 from "../../assets/images/tattoos/tattoo_13.jpg";
import tattoo_14 from "../../assets/images/tattoos/tattoo_14.jpg";
import tattoo_15 from "../../assets/images/tattoos/tattoo_15.jpg";
import tattoo_16 from "../../assets/images/tattoos/tattoo_16.jpg";
import tattoo_17 from "../../assets/images/tattoos/tattoo_17.jpg";
import tattoo_18 from "../../assets/images/tattoos/tattoo_18.jpg";
import tattoo_19 from "../../assets/images/tattoos/tattoo_19.jpg";
import tattoo_20 from "../../assets/images/tattoos/tattoo_20.jpg";
import Carousel from "../../components/Carousel";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { CircleX } from "lucide-react";
import clsx from "clsx";
import gsap from "gsap";

const IMAGES = [
  tattoo_1,
  tattoo_2,
  tattoo_3,
  tattoo_4,
  tattoo_5,
  tattoo_6,
  tattoo_7,
  tattoo_8,
  tattoo_9,
  tattoo_10,
  tattoo_11,
  tattoo_12,
  tattoo_13,
  tattoo_14,
  tattoo_15,
  tattoo_16,
  tattoo_17,
  tattoo_18,
  tattoo_19,
  tattoo_20,
];

function getPortfolioAlt(index: number) {
  return `Nat tattoo portfolio image ${index + 1}`;
}

export default function PortfolioClient() {
  const [isOpenState, setIsOpenState] = useState<"open" | "closed" | "openComplete" | "closedComplete" | null>(null);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const pathData = useMemo(
    () => ({
      closed: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
      mid: "M 0 0 V 85 Q 50 50 100 85 V 0 Z",
      open: "M 0 0 V 100 Q 50 100 100 100 V 0 z",
    }),
    []
  );

  useLayoutEffect(() => {
    const tl = gsap.timeline({ delay: 0, defaults: { duration: 0.8 } });
    if (isOpenState === null) return;

    if (isOpenState === "open") {
      tl.to(pathRef.current, {
        attr: { d: pathData.mid },
        ease: "power2.in",
      })
        .to(
          pathRef.current,
          {
            attr: { d: pathData.open },
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          "#image",
          {
            duration: 0.4,
            translateY: 0,
            opacity: 1,
            ease: "power2.out",
            onComplete: () => {
              setIsOpenState("openComplete");
            },
          },
          "-=0.2"
        );
    } else if (isOpenState === "closed") {
      tl.to("#image", {
        duration: 0.4,
        translateY: "-100%",
        opacity: 0,
        ease: "power2.in",
      })
        .to(
          pathRef.current,
          {
            attr: { d: pathData.mid },
            ease: "power2.in",
          },
          "-=0.4"
        )
        .to(
          pathRef.current,
          {
            attr: { d: pathData.closed },
            ease: "power2.out",
            onComplete: () => {
              setSelectedImage(null);
              setIsOpenState("closedComplete");
            },
          },
          "-=0.1"
        );
    }
    return () => {
      tl.kill();
    };
  }, [isOpenState, pathData]);

  return (
    <section id="portfolio">
      <h1 className="sr-only">Nat Tattoo Portfolio</h1>

      <div className="lg:hidden">
        <Carousel
          images={IMAGES}
          onClick={(image) => {
            setSelectedImage(image);
            setIsOpenState("open");
          }}
        />
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-4 py-6 container mx-auto mt-12">
        {IMAGES.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg animate-rise-and-fade"
            style={{ animationDelay: `${250 * index}ms`, animationFillMode: "backwards" }}
            onClick={() => {
              setSelectedImage(image);
              setIsOpenState("open");
            }}
          >
            <Image
              src={image}
              alt={getPortfolioAlt(index)}
              className="h-dvh grayscale-75 shadow-lg object-cover hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>
        ))}
      </div>

      <div
        className={clsx(
          "fixed inset-0 flex items-center justify-center z-20",
          (isOpenState === "closedComplete" || !isOpenState) && "hidden"
        )}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="fixed inset-0 pointer-events-none fill-black/80"
          preserveAspectRatio="none"
        >
          <path ref={pathRef} vectorEffect="non-scaling-stroke" d="M 0 0 V 0 Q 50 0 100 0 V 0 Z" />
        </svg>
        <div className="z-20">
          <button
            className="absolute right-6 bottom-6 z-30 text-white"
            onClick={() => {
              setIsOpenState("closed");
            }}
            aria-label="Close image"
          >
            <CircleX />
          </button>
          {selectedImage && (
            <Image src={selectedImage} id="image" className="-translate-y-full grayscale-75 opacity-0 h-dvh object-contain" alt="Selected tattoo" />
          )}
        </div>
      </div>
    </section>
  );
}
