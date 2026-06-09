"use client";

import { cvVariants } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import { useRef } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

export function CVSection() {
  const sectionRef = useSectionReveal(9);
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
          <div
            className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden"
            data-aos="fade-up"
          >
            <div>
              <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl print:text-black">
                CV
              </h2>
              <p className="mt-2 font-sans text-sm text-highlight/60">
                Cybersecurity analyst track — print or download as PDF.
              </p>
            </div>
            {cvVariants.cyber && (
              <button type="button" className="btn-ghost text-xs" onClick={download}>
                ↓ Download CV (PDF)
              </button>
            )}
          </div>
        </ParallaxDrift>

        <div
          className="glass-card cv-print rounded-2xl p-8 print:border print:shadow-none"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          {cvVariants.cyber ? (
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-highlight/90 print:text-black">
              {cvVariants.cyber}
            </pre>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="font-mono text-3xl text-accent/30">◎</span>
              <p className="font-mono text-sm text-highlight/40">CV coming soon</p>
              <p className="font-sans text-xs text-highlight/25">Check back shortly — the full document will be available here.</p>
            </div>
          )}
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
