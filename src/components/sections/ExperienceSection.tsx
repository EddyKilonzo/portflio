"use client";

import { experience } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

gsap.registerPlugin(ScrollTrigger);

const accentBorder: Record<string, string> = {
  cyber: "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
  engineering: "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
  web: "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
};

const accentDot: Record<string, string> = {
  cyber: "bg-accent",
  engineering: "bg-accent",
  web: "bg-accent",
};

const accentLabel: Record<string, string> = {
  cyber: "text-accent border-accent/30",
  engineering: "text-accent border-accent/30",
  web: "text-accent border-accent/30",
};

const companyLogo: Record<string, string> = {
  "attache-teach2give": "/logos/teach2give.png",
  "trainee-eldohub":    "/logos/eldohub.jfif",
};

export function ExperienceSection() {
  const sectionRef = useSectionReveal(7);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = (sectionRef as { current: HTMLElement | null }).current ?? null;
    if (!sectionEl || !lineFillRef.current) return;

    gsap.set(lineFillRef.current, { scaleY: 0, transformOrigin: "top center" });
    const tween = gsap.to(lineFillRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl,
        start: "top 72%",
        end: "bottom 30%",
        scrub: 0.7,
      },
    });
    return () => { tween.kill(); };
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-section="experience"
      className="relative overflow-hidden bg-bg py-24"
    >
      <SectionNumber n="07" sectionId="experience" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <div className="mb-10" data-aos="fade-up">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Experience
            </h2>
            <p className="mt-2 max-w-3xl font-mono text-xs text-highlight/55">
              Career timeline — from support foundations to software engineering and security leadership.
            </p>
          </div>
        </ParallaxDrift>

        <div className="relative pb-4 pl-6 md:pl-14">
          {/* Timeline track */}
          <div className="absolute bottom-0 left-2 top-0 w-px bg-gradient-to-b from-accent/60 via-highlight/20 to-transparent md:left-5" />
          {/* Scroll-driven fill */}
          <div
            ref={lineFillRef}
            className="absolute left-[5px] top-0 w-[3px] rounded-full bg-accent/80 md:left-[18px]"
            style={{ height: "100%" }}
          />

          <div className="space-y-6">
            {experience.map((ex, idx) => (
              <ExpCard key={ex.id} ex={ex} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const COLLAPSED_COUNT = 3;

function ExpCard({
  ex,
  index,
}: {
  ex: (typeof experience)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const responsibilities = ex.responsibilities;
  const visible = expanded ? responsibilities : responsibilities.slice(0, COLLAPSED_COUNT);
  const hasMore = responsibilities.length > COLLAPSED_COUNT;
  const yearLabel = ex.duration.split("—")[0]?.trim() ?? ex.duration;
  const roleTag = ex.accent === "cyber" ? "CyberSec" : "Developer";

  return (
    <article
      className="exp-card relative"
      data-aos="fade-up"
      data-aos-delay={Math.min(index * 60, 120)}
    >
      {/* Timeline dot */}
      <span
        className={`absolute -left-[1.45rem] top-7 h-3.5 w-3.5 rounded-full border-2 border-bg shadow-[0_0_0_2px_rgba(168,217,184,0.15)] md:-left-[2.2rem] ${accentDot[ex.accent] ?? "bg-highlight"}`}
      />
      {/* Year label — desktop only */}
      <span className="absolute -left-[5.5rem] top-5 hidden rounded border border-highlight/15 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70 md:inline-block">
        {yearLabel}
      </span>

      <div
        className={`glass-card w-full rounded-2xl border-l-4 p-6 transition-all duration-300 hover:border-l-[5px] hover:shadow-lg ${accentBorder[ex.accent]}`}
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="font-display text-xl text-highlight">{ex.title}</h3>
              {/* Year pill — visible on mobile (desktop shows it in the timeline margin) */}
              <span className="inline-block rounded border border-highlight/15 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70 md:hidden">
                {yearLabel}
              </span>
            </div>
            <p className="font-mono text-sm text-accent">{ex.company}</p>
            <p className="mt-0.5 font-mono text-xs text-highlight/65">
              {ex.duration} · {ex.location}
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-3">
            <span className={`self-start rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${accentLabel[ex.accent]}`}>
              {roleTag}
            </span>
            {companyLogo[ex.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogo[ex.id]}
                alt={`${ex.company} logo`}
                className="h-24 w-24 shrink-0 rounded-xl object-contain bg-white/10 p-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
        </header>

        <ul className="mt-4 space-y-2">
          {visible.map((r) => (
            <li key={r} className="flex gap-2 font-sans text-sm text-highlight/75">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              {r}
            </li>
          ))}
        </ul>

        {hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 font-mono text-[11px] text-accent/70 hover:text-accent transition-colors"
          >
            {expanded ? "Show less ↑" : `+${responsibilities.length - COLLAPSED_COUNT} more ↓`}
          </button>
        ) : null}

        {ex.impact ? (
          <p className="mt-4 rounded-lg border border-accent/20 bg-accent/[0.04] px-3 py-2 font-mono text-xs text-accent">
            ↘ {ex.impact}
          </p>
        ) : null}

        {ex.tools.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ex.tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
