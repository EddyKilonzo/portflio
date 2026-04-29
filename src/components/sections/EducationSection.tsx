"use client";

import { education } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

export function EducationSection() {
  const sectionRef = useSectionReveal(5);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [active, setActive] = useState<string | null>(education[0]?.id ?? null);
  const detailRef = useRef<HTMLDivElement>(null);
  const item = education.find((e) => e.id === active);
  const coursework = (item?.coursework ?? []).map((c) => c.trim()).filter(Boolean);
  const technologies = (item?.technologies ?? []).map((t) => t.trim()).filter(Boolean);

  useEffect(() => {
    const el = detailRef.current;
    if (!el || !item) return;
    const ch = Array.from(el.children);
    if (!ch.length) return;
    try {
      animate(ch, {
        opacity: [0, 1],
        y: [30, 0],
        delay: stagger(120),
        duration: 600,
        ease: "out(4)",
      });
    } catch (cause) {
      console.warn("[Education] detail animation failed:", cause);
    }
  }, [item]);

  return (
    <section
      ref={sectionRef}
      id="education"
      data-section="education"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="07" sectionId="education" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <h2 
            className="glitch-hover mb-8 font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Education
          </h2>
        </ParallaxDrift>

        {/* Pointer capture keeps drag smooth when the cursor leaves the strip mid-gesture. */}
        <div
          ref={railRef}
          className="cursor-grab select-none overflow-x-auto pb-4 active:cursor-grabbing"
          onPointerDown={(e) => {
            // Let card buttons handle their own clicks / focus.
            if ((e.target as HTMLElement).closest("button")) return;
            const el = railRef.current;
            if (!el) return;
            try {
              el.setPointerCapture(e.pointerId);
            } catch (cause) {
              console.warn("[Education] setPointerCapture failed:", cause);
              return;
            }
            dragRef.current = {
              active: true,
              startX: e.clientX,
              scrollLeft: el.scrollLeft,
            };
          }}
          onPointerMove={(e) => {
            if (!dragRef.current.active) return;
            const el = railRef.current;
            if (!el) return;
            el.scrollLeft =
              dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX);
          }}
          onPointerUp={(e) => {
            const rail = railRef.current;
            if (!rail?.hasPointerCapture(e.pointerId)) return;
            try {
              rail.releasePointerCapture(e.pointerId);
            } catch (cause) {
              console.warn("[Education] releasePointerCapture failed:", cause);
            }
            dragRef.current.active = false;
          }}
          onPointerCancel={(e) => {
            try {
              railRef.current?.releasePointerCapture(e.pointerId);
            } catch {
              /* ignore */
            }
            dragRef.current.active = false;
          }}
        >
          <StaggerReveal className="flex min-w-max gap-4" stagger={0.1} from="up" distance={20}>
            {education.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setActive(e.id)}
                className={`relative flex h-24 w-36 shrink-0 flex-col justify-end rounded-xl border p-3 text-left transition-colors ${
                  active === e.id
                    ? "border-accent bg-surface/30"
                    : "border-highlight/15 bg-surface/10"
                }`}
              >
                <span className="font-mono text-[10px] text-highlight/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base leading-tight text-highlight">
                  {e.institution}
                </span>
                <span className="font-mono text-[11px] text-accent">{e.year}</span>
              </button>
            ))}
          </StaggerReveal>
        </div>

        {item ? (
          <div
            key={item.id}
            ref={detailRef}
            data-aos="fade-up"
            className="glass-card mt-8 rounded-2xl border-t-2 border-accent p-6"
          >
            <h3 className="font-display text-3xl text-highlight will-change-transform">
              {item.degree}
            </h3>
            <p className="font-mono text-sm text-accent">{item.institution}</p>
            <p className="mt-2 font-mono text-xs text-highlight/60">
              {item.year}
              {item.gpa ? ` · GPA ${item.gpa}` : ""}
              {item.honors ? ` · ${item.honors}` : ""}
            </p>
            {coursework.length ? (
              <>
                <p className="mt-4 font-mono text-xs text-highlight/50">
                  Coursework
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-highlight/80">
                  {coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {item.thesis ? (
              <p className="mt-4 font-sans text-sm text-highlight/80">
                <span className="font-mono text-xs text-highlight/50">
                  Thesis / capstone:{" "}
                </span>
                {item.thesis}
              </p>
            ) : null}
            {technologies.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/55 px-2 py-0.5 font-mono text-[10px] text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
