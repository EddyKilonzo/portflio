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
  cyber:       "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
  engineering: "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
  web:         "border-l-accent shadow-[inset_4px_0_0_0_rgba(var(--rgb-accent),0.8)]",
};

const accentLabel: Record<string, string> = {
  cyber:       "text-accent border-accent/30",
  engineering: "text-accent border-accent/30",
  web:         "text-accent border-accent/30",
};

const companyLogo: Record<string, string> = {
  "attache-teach2give": "/logos/teach2give.png",
  "trainee-eldohub":    "/logos/eldohub.jfif",
};

/* ── Animated timeline dot ───────────────────────────────────────────────── */
function AnimatedDot({ isFirst }: { isFirst: boolean }) {
  const dotRef  = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot) return;

    // Start hidden — will be revealed by IntersectionObserver
    gsap.set(dot, { scale: 0, opacity: 0 });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();

        // Spring pop-in with overshoot
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(2.2)",
          delay: 0.18,
        });

        // One-shot ripple ring expands and fades
        if (ring) {
          gsap.fromTo(
            ring,
            { scale: 0.8, opacity: 0.75 },
            { scale: 3.2, opacity: 0, duration: 0.85, ease: "power2.out", delay: 0.22 },
          );
        }
      },
      { threshold: 0.4 },
    );

    io.observe(dot);
    return () => io.disconnect();
  }, []);

  return (
    <span
      className="absolute -left-[1.35rem] top-7 flex items-center justify-center md:-left-[2.15rem]"
      aria-hidden
    >
      {/* One-shot ripple — plays once when dot reveals */}
      <span
        ref={ringRef}
        className="absolute h-3.5 w-3.5 rounded-full bg-accent opacity-0"
      />
      {/* Persistent slow ping on the most-recent entry */}
      {isFirst && (
        <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-accent/35" />
      )}
      {/* Dot */}
      <span
        ref={dotRef}
        className="relative z-10 h-3.5 w-3.5 rounded-full border-2 border-bg bg-accent"
        style={{
          boxShadow: isFirst
            ? "0 0 0 2px rgba(168,217,184,0.2), 0 0 12px rgba(13,138,61,0.65)"
            : "0 0 0 2px rgba(168,217,184,0.15)",
        }}
      />
    </span>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function ExperienceSection() {
  const sectionRef  = useSectionReveal(7);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const lineGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = (sectionRef as { current: HTMLElement | null }).current;
    const fill = lineFillRef.current;
    const glow = lineGlowRef.current;
    if (!sectionEl || !fill) return;

    gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });
    if (glow) gsap.set(glow, { scaleY: 0, transformOrigin: "top center" });

    const targets = [fill, glow].filter(Boolean) as HTMLElement[];
    const tween = gsap.to(targets, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionEl,
        start: "top 72%",
        end: "bottom 30%",
        scrub: 0.8,
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
          {/* Static background track */}
          <div className="absolute bottom-0 left-2 top-0 w-px bg-gradient-to-b from-highlight/12 via-highlight/8 to-transparent md:left-5" />

          {/* Scroll-driven fill */}
          <div
            ref={lineFillRef}
            className="absolute left-[5px] top-0 w-[3px] rounded-full bg-accent md:left-[18px]"
            style={{ height: "100%" }}
          />

          {/* Glow layer — slightly wider, blurred, sits behind the fill visually */}
          <div
            ref={lineGlowRef}
            className="absolute left-[4px] top-0 w-[5px] rounded-full md:left-[17px]"
            style={{
              height: "100%",
              background: "rgba(13,138,61,0.4)",
              filter: "blur(5px)",
              pointerEvents: "none",
            }}
          />

          <div className="space-y-6">
            {experience.map((ex, idx) => (
              <ExpCard key={ex.id} ex={ex} index={idx} isFirst={idx === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */
const COLLAPSED_COUNT = 3;

function ExpCard({
  ex,
  index,
  isFirst,
}: {
  ex: (typeof experience)[number];
  index: number;
  isFirst: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const responsibilities = ex.responsibilities;
  const visible  = expanded ? responsibilities : responsibilities.slice(0, COLLAPSED_COUNT);
  const hasMore  = responsibilities.length > COLLAPSED_COUNT;
  const yearLabel = ex.duration.split("—")[0]?.trim() ?? ex.duration;
  const roleTag   = ex.accent === "cyber" ? "CyberSec" : "Developer";

  return (
    <article
      className="exp-card relative"
      data-aos="fade-left"
      data-aos-delay={Math.min(index * 70, 140)}
    >
      <AnimatedDot isFirst={isFirst} />

      {/* Year label — desktop margin */}
      <span className="absolute -left-[5.5rem] top-5 hidden rounded border border-highlight/15 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70 md:inline-block">
        {yearLabel}
      </span>

      <div
        className={`glass-card w-full rounded-2xl border-l-4 p-6 transition-all duration-300 hover:border-l-[5px] hover:shadow-lg ${accentBorder[ex.accent]}`}
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl text-highlight">{ex.title}</h3>
              {/* Year pill — mobile only */}
              <span className="inline-block rounded border border-highlight/15 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/70 md:hidden">
                {yearLabel}
              </span>
            </div>
            <p className="font-mono text-sm text-accent">{ex.company}</p>
            <p className="mt-0.5 font-mono text-xs text-highlight/65">
              {ex.duration} · {ex.location}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${accentLabel[ex.accent]}`}>
              {roleTag}
            </span>
            {companyLogo[ex.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogo[ex.id]}
                alt={`${ex.company} logo`}
                className="h-24 w-24 shrink-0 rounded-xl bg-white/10 object-contain p-2"
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

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 font-mono text-[11px] text-accent/70 transition-colors hover:text-accent"
          >
            {expanded ? "Show less ↑" : `+${responsibilities.length - COLLAPSED_COUNT} more ↓`}
          </button>
        )}

        {ex.impact && (
          <p className="mt-4 rounded-lg border border-accent/20 bg-accent/[0.04] px-3 py-2 font-mono text-xs text-accent">
            ↘ {ex.impact}
          </p>
        )}

        {ex.tools.length > 0 && (
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
        )}
      </div>
    </article>
  );
}
