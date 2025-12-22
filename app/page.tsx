import Image from "next/image";
import separator from "./assets/sep.png";
import { EmblaCarousel } from "./components/Embla";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen text-3xl w-full max-w-3xl flex-col items-center py-16 px-8 sm:items-start">
        <h1 className="text-7xl">NAT</h1>
        <div className="text-center mt-4">
          <p>
            Tattoo artist with five years of experience, specialized in realistic and micro-realistic tattoos, based in
            Rome.
          </p>
          {/* PHILOSPHY & SHOWCASE */}
          <Image src={separator} alt="separator" />
          <section className="flex gap-4 mt-4">
            <div className="text-xl w-1/2">
              <h3 className="text-3xl">Tattoo philosophy</h3>
              <p className="mt-2">
                Precision and respect: every tattoo reflects my artistic dedication and an impeccable professional work
                ethic.
              </p>
            </div>
            <EmblaCarousel className="border rounded h-48 w-1/2" slides={[<div>1</div>, <div>2</div>]}></EmblaCarousel>
          </section>
        </div>
      </main>
    </div>
  );
}
