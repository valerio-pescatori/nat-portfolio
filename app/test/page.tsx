"use client";
import ReactLenis, { useLenis } from "lenis/react";

export default function Test() {
  useLenis((x) => {
    console.log(x);
  });

  return (
    <div>
      <ReactLenis className="h-screen overflow-auto" root="asChild">
        <div className="h-99999">scrollable</div>
      </ReactLenis>
    </div>
  );
}
