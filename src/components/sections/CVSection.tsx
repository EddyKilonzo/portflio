"use client";

import { cvVariants } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import { useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

type Variant = keyof typeof cvVariants;

export function CVSection() {
  const sectionRef = useSectionReveal(9);
  const [v, setV] = useState<Variant>("developer");
  const planeRef = useRef<SVGSVGElement>(null);

  const download = () => {
    const el = planeRef.current;
    if (el) {
      animate(el, {
        translateX: typeof window !== "undefined" ? window.innerWidth * 0.6 : 400,
        translateY: -200,
        rotate: 45,
        opacity: [1, 0],
        duration: 1200,
        ease: "in(4)",
      });
    }
    window.print();
  };

  return (
    <section
      ref={sectionRef}
      id="cv"
      data-section="cv"
      className="relative overflow-hidden py-24 section-bg print:bg-white print:text-black"
    >
      <SectionNumber n="11" sectionId="cv" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-4xl px-6 print:max-w-none">
        <ParallaxDrift speed={0.1}>
          <h2 
            className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl print:text-black"
            data-aos="fade-right"
          >
            CV dashboard
          </h2>
        </ParallaxDrift>

        <div 
          className="mb-6 flex flex-wrap gap-2 print:hidden"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {(Object.keys(cvVariants) as Variant[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setV(k)}
              className={`rounded-full border px-4 py-1 font-mono text-xs capitalize ${
                v === k ? "border-accent text-accent" : "border-highlight/20"
              }`}
            >
              {k}
            </button>
          ))}
          <button type="button" className="btn-ghost ml-auto text-xs" onClick={download}>
            Download CV (PDF)
          </button>
        </div>

        <div 
          className="glass-card cv-print rounded-2xl p-8 print:border print:shadow-none"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <pre className="whitespace-pre-wrap font-mono text-sm text-highlight/90 print:text-black">
            {cvVariants[v]}
          </pre>
        </div>

        <svg
          ref={planeRef}
          className="pointer-events-none fixed bottom-10 left-10 h-8 w-8 text-accent opacity-0 print:hidden"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
        </svg>
      </div>
    </section>
  );
}
