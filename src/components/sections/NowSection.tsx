"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { nowItems, changelog } from "@/content/portfolio";
import { useSanityFetch } from "@/hooks/useSanityFetch";
import { getNowItems, getChangelog } from "@/lib/sanityQueries";

export function NowSection() {
  const nowData = useSanityFetch(getNowItems, nowItems);
  const changelogData = useSanityFetch(getChangelog, changelog);
  const sectionRef = useSectionReveal(16);

  return (
    <section
      ref={sectionRef}
      id="now"
      data-section="now"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="03" sectionId="now" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl" data-aos="fade-right">
            Now
          </h2>
          <p className="mt-2 max-w-3xl font-sans text-highlight/70" data-aos="fade-up" data-aos-delay="100">
            Snapshot of what I am building, learning, and improving this month.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {nowData.map((item, idx) => (
            <article
              key={item.title}
              className="glass-card rounded-2xl p-8 min-h-[220px] flex flex-col"
              data-aos="fade-up"
              data-aos-delay={Math.min(idx * 80, 160)}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {item.title}
              </p>
              <ul className="mt-4 space-y-3 font-sans text-sm text-highlight/80 flex-1">
                {item.lines.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 glass-card rounded-2xl p-6" data-aos="fade-up" data-aos-delay="200">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Changelog</p>
          <ul className="mt-3 space-y-2 text-sm text-highlight/80">
            {changelogData.map((entry) => (
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

