"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const chapters = [
  { id: "hero", label: "Chapter 1: Intro" },
  { id: "story", label: "Chapter 2: Narrative" },
  { id: "projects", label: "Chapter 3: Work" },
];

export function NarrativeChapters() {
  const active = useActiveSection(chapters.map((c) => c.id), "hero");
  const [milestone, setMilestone] = useState<string | null>(null);
  const [milestoneMs, setMilestoneMs] = useState(1400);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const prevRef = useRef(active);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 1024) setMilestoneMs(900);
      else if (w <= 1280) setMilestoneMs(1100);
      else setMilestoneMs(1400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (prevRef.current === active) return;
    prevRef.current = active;
    const chapter = chapters.find((c) => c.id === active);
    if (!chapter) return;
    setMilestone(`${chapter.label} reached`);
    const node = chipRef.current;
    if (!node) return;
    gsap.fromTo(
      node,
      { opacity: 0, y: 8, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
    );
    const id = window.setTimeout(() => setMilestone(null), milestoneMs);
    return () => window.clearTimeout(id);
  }, [active, milestoneMs]);

  return (
    <div className="pointer-events-none fixed left-2 top-20 z-[9997] hidden lg:left-3 lg:top-24 lg:block xl:left-4 xl:top-24" aria-hidden>
      <div className="rounded-xl border border-highlight/20 bg-bg/70 px-3 py-2 backdrop-blur">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-highlight/60">
          Narrative Chapters
        </p>
        <div className="mt-2 space-y-1">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${chapter.id === active ? "bg-accent shadow-[0_0_10px_rgba(168,217,184,0.6)]" : "bg-highlight/30"}`}
              />
              <span className="font-mono text-[10px] text-highlight/70">{chapter.label}</span>
            </div>
          ))}
        </div>
      </div>
      {milestone ? (
        <div
          ref={chipRef}
          className="mt-2 rounded-full border border-accent/50 bg-surface/70 px-2.5 py-1 font-mono text-[10px] text-accent lg:px-3"
        >
          {milestone}
        </div>
      ) : null}
    </div>
  );
}

