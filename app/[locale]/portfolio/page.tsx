"use client";
import Image, { StaticImageData } from "next/image";
import anchor from "../../assets/images/tattoos/anchor.jpg";
import knife from "../../assets/images/tattoos/knife.jpg";
import leo from "../../assets/images/tattoos/leo.jpg";
import octopus from "../../assets/images/tattoos/octopus.jpg";
import shark from "../../assets/images/tattoos/shark.jpg";
import statue from "../../assets/images/tattoos/statue.jpg";
import tempus from "../../assets/images/tattoos/tempus.jpg";
import Carousel from "../../components/Carousel";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { CircleX } from "lucide-react";
import clsx from "clsx";
import gsap from "gsap";

export default function Portfolio() {
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
      // OPENING ANIMATION
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
      // CLOSING ANIMATION (Pull back up)
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
      <div className="lg:hidden">
        <Carousel
          images={[anchor, knife, leo, octopus, shark, statue, tempus]}
          onClick={(image) => {
            setSelectedImage(image);
            setIsOpenState("open");
          }}
        />
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-4 py-6 px-4 mt-12">
        {[anchor, knife, leo, octopus, shark, statue, tempus].map((image, index) => (
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
              alt={`tattoo-${index}`}
              className="size-full shadow-lg object-cover hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>
        ))}
      </div>

      {/* Image modal */}
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
          {/* cross */}
          <button
            className="absolute right-6 bottom-6 z-30 text-white"
            onClick={() => {
              setIsOpenState("closed");
            }}
          >
            <CircleX />
          </button>
          {selectedImage && (
            <Image src={selectedImage} id="image" className="-translate-y-full opacity-0" alt="selected image" />
          )}
        </div>
      </div>
    </section>
  );
}
