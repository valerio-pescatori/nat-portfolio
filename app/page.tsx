import { ArrowRight } from "lucide-react";
import Image from "next/image";
import propic from "./assets/images/propic2.jpg";

import Link from "next/link";
import AnimatedText from "./components/AnimatedText";

export default function Home() {
  return (
    <>
      <main className="h-screen relative flex flex-col">
        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/0 via-primary via-40% to-secondary" />
        {/* Content */}
        <Image src={propic} alt="propic" className="aspect-square w-full" />
        <div className="z-10 text-center absolute top-1/2 left-1/2 -translate-1/2">
          <AnimatedText>
            <h1 className="text-[15rem] leading-60">Nat</h1>
          </AnimatedText>
          <div className="font-readable ">
            <AnimatedText className="animation-delay-1500">
              <h2 className="text-2xl ">tattoo artist</h2>
            </AnimatedText>
            <Link
              href="/portfolio"
              className="text-lg mt-6 transition-opacity underline animate-fade-in animation-delay-2000"
              style={{ animationFillMode: "backwards" }}
            >
              Portfolio
              <ArrowRight className="inline-block ml-2" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
