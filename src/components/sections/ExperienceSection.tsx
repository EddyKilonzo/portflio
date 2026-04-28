"use client";

import { experience } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

gsap.registerPlugin(ScrollTrigger);

const accentBorder: Record<string, string> = {
  cyber: "border-l-cyber shadow-[inset_4px_0_0_0_#FF4C4C]",
  engineering: "border-l-eng shadow-[inset_4px_0_0_0_#4C9EFF]",
  web: "border-l-highlight shadow-[inset_4px_0_0_0_#A8D9B8]",
};

export function ExperienceSection() {
  const sectionRef = useSectionReveal(7);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = (sectionRef as { current: HTMLElement | null }).current ?? null;
    if (sectionEl && lineFillRef.current) {
      gsap.fromTo(
        lineFillRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 72%",
            end: "bottom 30%",
            scrub: 0.7,
          },
        },
      );
    }

    const cards = document.querySelectorAll(".exp-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 22, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: index * 0.04,
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
          },
        },
      );
      const bullets = card.querySelectorAll(".exp-bullet");
      gsap.fromTo(
        bullets,
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        },
      );
    });
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-section="experience"
      className="relative overflow-hidden bg-bg py-24"
    >
      <SectionNumber n="10" sectionId="experience" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <div className="mb-8" data-aos="fade-up">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Experience
            </h2>
            <p className="mt-2 max-w-3xl font-sans text-highlight/70">
              Career time trail from support and frontend foundations to software engineering
              and security leadership.
            </p>
          </div>
        </ParallaxDrift>

        <div className="relative pb-4 pl-6 md:pl-12">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-gradient-to-b from-accent/80 via-highlight/35 to-transparent md:left-5" />
          <div
            ref={lineFillRef}
            className="absolute left-[5px] top-0 w-[3px] rounded-full bg-accent/85 md:left-[18px]"
            style={{ height: "100%", transform: "scaleY(0)", transformOrigin: "top center" }}
          />
          <div className="space-y-7">
            {experience.map((ex) => (
              <ExpCard key={ex.id} ex={ex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpCard({
  ex,
}: {
  ex: (typeof experience)[number];
}) {
  const dotTone =
    ex.accent === "cyber"
      ? "bg-cyber"
      : ex.accent === "engineering"
        ? "bg-eng"
        : "bg-highlight";
  const yearLabel = ex.duration.split("—")[0]?.trim() ?? ex.duration;
  return (
    <article className="exp-card relative">
      <span
        className={`absolute -left-[1.45rem] top-7 h-3.5 w-3.5 rounded-full border-2 border-bg shadow-[0_0_0_2px_rgba(168,217,184,0.2)] md:-left-[2.2rem] ${dotTone}`}
      />
      <span className="absolute -left-[4.9rem] top-5 hidden rounded-full border border-highlight/20 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/80 md:inline-block">
        {yearLabel}
      </span>
      <div
        className={`glass-card w-full rounded-2xl border-l-4 p-6 ${accentBorder[ex.accent]}`}
      >
      <header>
        <h3 className="font-display text-2xl text-highlight">{ex.title}</h3>
        <p className="font-mono text-sm text-accent">{ex.company}</p>
        <p className="font-mono text-xs text-highlight/50">
          {ex.duration} · {ex.location}
        </p>
      </header>
      <ul className="mt-4 space-y-2 font-sans text-sm text-highlight/80">
        {ex.responsibilities.map((r) => (
          <li key={r} className="exp-bullet">
            {r}
          </li>
        ))}
      </ul>
      {ex.impact ? (
        <p className="mt-3 font-mono text-xs text-accent">↘ {ex.impact}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70">
          Milestone
        </span>
        <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70">
          Career Trail
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ex.tools.map((t) => (
          <span
            key={t}
            className="rounded-full border border-highlight/15 px-2 py-0.5 font-mono text-[10px]"
          >
            {t}
          </span>
        ))}
      </div>
      </div>
    </article>
  );
}
