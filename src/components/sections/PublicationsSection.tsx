"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { publications, type PublicationKind } from "@/content/portfolio";
import { useMemo, useState } from "react";

const kindLabel: Record<PublicationKind, string> = {
  paper: "Paper",
  blog: "Blog",
  talk: "Talk",
};

export function PublicationsSection() {
  const sectionRef = useSectionReveal(13);
  const [kind, setKind] = useState<"all" | PublicationKind>("all");

  const visible = useMemo(() => {
    return kind === "all" ? publications : publications.filter((p) => p.kind === kind);
  }, [kind]);

  return (
    <section
      ref={sectionRef}
      id="publications"
      data-section="publications"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="13" sectionId="publications" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl" data-aos="fade-right">
            Publications & Writing
          </h2>
          <p className="mt-2 max-w-3xl font-sans text-highlight/70" data-aos="fade-up" data-aos-delay="100">
            Papers, talks, and practical writeups that connect engineering decisions to security-first outcomes.
          </p>
        </ParallaxDrift>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {(["all", "paper", "blog", "talk"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
                kind === k
                  ? "border-accent bg-surface/30 text-accent"
                  : "border-highlight/20 text-highlight/70"
              }`}
            >
              {k === "all" ? "All" : kindLabel[k]}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visible.map((p, idx) => (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-delay={idx * 60}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-wide text-accent/90">
                  {kindLabel[p.kind]}
                </span>
                <span className="font-mono text-[10px] text-highlight/60">{p.date}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl text-highlight">{p.title}</h3>
              <p className="mt-2 font-sans text-sm text-highlight/75">{p.summary}</p>
              <div className="mt-4">
                {p.url ? (
                  <a href={p.url} className="text-accent underline" target="_blank" rel="noreferrer">
                    Read / watch -&gt;
                  </a>
                ) : (
                  <span className="font-mono text-xs text-highlight/50">Link coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

