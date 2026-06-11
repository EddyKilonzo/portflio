"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

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

    // Start invisible — will fade in on entry
    gsap.set(el, { opacity: 0 });

    // Entry: fade in + brief scale-down for a "landing" feel
    const entry = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 1.18 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
        );
      },
    });

    // Parallax scrub
    const parallax = gsap.to(el, {
      y: -120,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      entry.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, [sectionId]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute -left-2 top-8 z-0 select-none font-display text-[8rem] font-bold leading-none text-highlight/[0.1] will-change-transform md:text-[11rem]"
      aria-hidden
    >
      {n}
    </div>
  );
}
