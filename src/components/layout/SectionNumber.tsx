"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

type Props = {
  n: string;
  sectionId: string;
};

export function SectionNumber({ n, sectionId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = document.getElementById(sectionId);
    if (!el || !section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const y = self.progress * -120;
        el.style.transform = `translateY(${y}px)`;
      },
    });

    return () => st.kill();
  }, [sectionId]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute -left-2 top-8 z-0 select-none font-display text-[8rem] font-bold leading-none text-highlight/[0.07] will-change-transform md:text-[11rem]"
      aria-hidden
    >
      {n}
    </div>
  );
}
