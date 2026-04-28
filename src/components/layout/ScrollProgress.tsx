"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        el.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[9998] h-0.5 origin-left bg-surfaceMid/30"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-accent will-change-transform"
      />
    </div>
  );
}
