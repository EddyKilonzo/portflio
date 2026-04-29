"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";

const nowItems = [
  {
    title: "Building",
    lines: [
      "Portfolio UX v2: compare mode, tray navigation, and case-study carousel.",
      "Production-ready content architecture for faster updates.",
    ],
  },
  {
    title: "Learning",
    lines: [
      "PWA optimization workflows and offline-first shell patterns.",
      "Advanced accessibility audit practices for dynamic interfaces.",
    ],
  },
  {
    title: "Improving",
    lines: [
      "Reducing first-load JS for smoother mobile startup.",
      "Tighter analytics signals for user journey decisions.",
    ],
  },
];

const changelog = [
  { date: "2026-04-29", item: "Added theme mode system + improved startup hydration." },
  { date: "2026-04-29", item: "Introduced command palette, subtle ambient controls, cursor toggle." },
  { date: "2026-04-29", item: "Shipped branded not-found/offline states and stronger metadata." },
];

export function NowSection() {
  const sectionRef = useSectionReveal(16);

  return (
    <section
      ref={sectionRef}
      id="now"
      data-section="now"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="16" sectionId="now" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
            Now
          </h2>
          <p className="mt-2 max-w-3xl font-sans text-highlight/70">
            Snapshot of what I am building, learning, and improving this month.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {nowItems.map((item, idx) => (
            <article
              key={item.title}
              className="glass-card rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-delay={idx * 80}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {item.title}
              </p>
              <ul className="mt-3 space-y-2 font-sans text-sm text-highlight/80">
                {item.lines.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 glass-card rounded-2xl p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Changelog</p>
          <ul className="mt-3 space-y-2 text-sm text-highlight/80">
            {changelog.map((entry) => (
              <li key={entry.item}>
                <span className="mr-2 font-mono text-[11px] text-highlight/55">{entry.date}</span>
                {entry.item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

