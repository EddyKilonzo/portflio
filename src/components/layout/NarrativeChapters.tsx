"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const chapters = [
  { id: "hero",       label: "Chapter 1: Intro"      },
  { id: "about",      label: "Chapter 2: Background" },
  { id: "experience", label: "Chapter 3: Experience" },
  { id: "projects",   label: "Chapter 4: Work"       },
  { id: "cyber",      label: "Chapter 5: Security"   },
];

export function NarrativeChapters() {
  const active = useActiveSection(chapters.map((c) => c.id), "hero");
  const [milestone, setMilestone] = useState<string | null>(null);
  // Store milestoneMs in a ref so the active-change effect always reads the
  // latest value without being listed as a dependency (avoids re-running the
  // effect — and leaking a stale timeout — on every resize).
  const milestoneMsRef = useRef(1400);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const prevRef = useRef(active);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      milestoneMsRef.current = w <= 1024 ? 900 : w <= 1280 ? 1100 : 1400;
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

    // Clear any pending hide-timeout from the previous milestone.
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setMilestone(`${chapter.label} reached`);
    const node = chipRef.current;
    if (node) {
      gsap.fromTo(
        node,
        { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
      );
    }
    timeoutRef.current = window.setTimeout(() => setMilestone(null), milestoneMsRef.current);
  }, [active]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

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

