"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import {
  getParallaxScaleForWidth,
  getParallaxScrubForWidth,
  motionTokens,
} from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

const beats = [
  {
    title: "Discover",
    body: "Start with context-first sections that expose role, now-focus, and capability signals.",
  },
  {
    title: "Compare",
    body: "Filter and compare projects with case-study depth before committing attention.",
  },
  {
    title: "Act",
    body: "Move to certifications, trust evidence, and direct contact in a guided flow.",
  },
];

export function StorytellingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const { shouldReduce } = useMotionProfile();

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || shouldReduce) return;
    const scale = getParallaxScaleForWidth(window.innerWidth || 1024);
    const scrub = getParallaxScrubForWidth(window.innerWidth || 1024);
    const beatCards = Array.from(
      sectionEl.querySelectorAll<HTMLElement>("[data-story-beat]"),
    );
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top+=72",
      end: "+=180%",
      pin: "[data-story-pin]",
      scrub,
      onUpdate: (self) => {
        const next = Math.min(beats.length - 1, Math.floor(self.progress * beats.length));
        setActiveBeat(next);
        beatCards.forEach((card, idx) => {
          const amp =
            idx === 0
              ? motionTokens.parallax.story.beat1
              : idx === 1
                ? motionTokens.parallax.story.beat2
                : motionTokens.parallax.story.beat3;
          gsap.set(card, { y: -(amp * scale) * self.progress });
        });
      },
    });
    return () => st.kill();
  }, [shouldReduce]);

  return (
    <section
      ref={sectionRef}
      id="story"
      data-section="story"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="02" sectionId="story" />
      <DecorNetwork />
      <div data-story-pin className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Story flow</p>
          <h2 className="mt-3 font-display text-3xl text-highlight md:text-4xl">
            Guided narrative block
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {beats.map((beat, idx) => (
              <article
                key={beat.title}
                data-story-beat
                className={`rounded-xl border p-4 transition-all ${
                  idx === activeBeat
                    ? "border-accent/60 bg-surface/25"
                    : "border-highlight/15 bg-surface/10"
                }`}
              >
                <p className="font-mono text-[11px] text-highlight/55">0{idx + 1}</p>
                <h3 className="mt-1 font-display text-xl text-highlight">{beat.title}</h3>
                <p className="mt-2 text-sm text-highlight/75">{beat.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

