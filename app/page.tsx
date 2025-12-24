import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import propic from "./assets/images/propic.jpg";
import separator from "./assets/images/sep.png";
import { EmblaCarousel } from "./components/Embla";

export default function Home() {
  const Separator = <Image src={separator} alt="separator" className="scale-75 mt-4" />;

  const videoSlides: JSX.Element[] = [
    <video key={`video-${1}`} autoPlay loop muted controls={false} playsInline preload="none">
      <source src="./videos/angel.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>,
    <video key={`video-${2}`} autoPlay loop muted controls={false} playsInline preload="none">
      <source src="./videos/jinx.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>,
  ];

  return (
    <main className="min-h-screen text-3xl w-full max-w-3xl">
      {/* TITLE */}
      <section className="flex justify-between gap-2 px-4">
        <div className="text-left">
          <h1 className="text-7xl">NAT</h1>
          <h2 className="mt-4">
            Tattoo artist with five years of experience. Specialized in realistic and micro-realistic tattoos, based in
            Rome.
          </h2>
        </div>
        <Image
          className="max-w-1/2 rounded-lg shadow-lg border border-detail object-cover"
          src={propic}
          alt="Profile picture"
        />
      </section>
      {/* PRESENTATION */}
      <section className="mt-4 px-4">
        {/* PHILOSPHY & SHOWCASE */}
        {Separator}
        <div className="flex flex-col gap-4">
          <h3 className="text-center">Tattoo philosophy & Personal style</h3>
          <p className="mt-2 text-base font-inter">
            I specialize in realistic and micro-realistic tattoos, with a focus on detail and attention to the smallest
            elements. My work is a reflection of my passion for art and my dedication to quality.
          </p>
        </div>
      </section>
      <section>
        {/* MEDIA */}
        <EmblaCarousel className="mt-4" slides={videoSlides}></EmblaCarousel>
      </section>
      {Separator}
      {/* BOOK A SESSION */}
      <section className="px-4 text-center">
        <h3>Book a session</h3>
        <p className="text-base font-inter">
          Already have an idea for your next project? Book a session now and I&apos;ll be happy to help you develop your
          idea!
        </p>
        <Link
          href="/book-a-session"
          className={clsx(
            "inline-block px-6 py-4 rounded-full bg-primary border border-detail w-3/4 mt-4 shadow-lg",
            "hover:scale-110 focus:scale-110 active:scale-90 transition-transform"
          )}
        >
          Book now
        </Link>
      </section>
    </main>
  );
}
