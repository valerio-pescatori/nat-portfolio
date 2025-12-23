import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import separator from "./assets/images/sep.png";
import { EmblaCarousel } from "./components/Embla";
import { JSX } from "react";

export default function Home() {
  const Separator = <Image src={separator} alt="separator" className="scale-75 mt-4" />;

  const videoSlides: JSX.Element[] = [
    <video autoPlay loop muted controls={false} playsInline preload="none">
      <source src="./videos/angel.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>,
    <video autoPlay loop muted controls={false} playsInline preload="none">
      <source src="./videos/jinx.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>,
  ];

  return (
    <main className="flex min-h-screen text-3xl w-full max-w-3xl flex-col items-center ">
      {/* TITLE */}
      <h1 className="text-7xl">NAT</h1>
      {/* PRESENTATION */}
      <div className="mt-4">
        <h2>
          Tattoo artist with five years of experience, specialized in realistic and micro-realistic tattoos, based in
          Rome.
        </h2>
        {/* PHILOSPHY & SHOWCASE */}
        {Separator}
        <section className="flex flex-col gap-4">
          <div>
            <h3>Tattoo philosophy</h3>
            <p className="mt-2 text-base font-inter">
              Precision and respect: every tattoo reflects my artistic dedication and an impeccable professional work
              ethic.
            </p>
          </div>
          <EmblaCarousel className="border border-detail rounded-xl" slides={videoSlides}></EmblaCarousel>
        </section>
      </div>
      {Separator}
      {/* BOOK A SESSION */}
      <h3>Book a session</h3>
      <p className="text-base font-inter">
        Already have an idea for your next project? Book a session now and I'll be happy to help you develop your idea!
      </p>
      <Link
        href="/book-a-session"
        className={clsx(
          "px-6 py-4 rounded-full bg-primary border border-detail w-3/4 mt-4 shadow-lg",
          "hover:scale-110 focus:scale-110 active:scale-90 transition-transform"
        )}
      >
        Book now
      </Link>
    </main>
  );
}
