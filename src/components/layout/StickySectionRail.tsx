"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";

const mapped = sectionLinks
  .filter((s) => ["hero", "story", "projects", "contact", "experience", "skills"].includes(s.id))
  .map((s) => ({ id: s.id, label: s.label }));
const sections = mapped.some((s) => s.id === "story")
  ? mapped
  : [...mapped.slice(0, 1), { id: "story", label: "Story" }, ...mapped.slice(1)];

export function StickySectionRail() {
  const [active, setActive] = useState("hero");
  const [visited, setVisited] = useState<Record<string, boolean>>({ hero: true });
  const [progress, setProgress] = useState(0);
  const [snapPulseId, setSnapPulseId] = useState<string | null>(null);
  const chapterIds = useMemo(() => ["hero", "story", "projects"], []);
  const pulseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id);
          setVisited((prev) => ({ ...prev, [visible.target.id]: true }));
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -60% 0px" },
    );

    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById(active);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh * 0.72 - rect.top) / Math.max(1, rect.height)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  return (
    <aside className="fixed right-2 top-1/2 z-[9996] hidden -translate-y-1/2 lg:right-3 lg:block xl:right-4">
      <div className="rounded-2xl border border-highlight/15 bg-bg/45 px-1.5 py-2.5 backdrop-blur-md lg:px-2 lg:py-3">
        <div className="mb-2 h-20 w-[2px] overflow-hidden rounded-full bg-highlight/20 lg:h-24 xl:h-28">
          <div
            className="w-full origin-top bg-accent transition-transform duration-200"
            style={{ height: "100%", transform: `scaleY(${progress})` }}
          />
        </div>
        <div className="flex flex-col items-center gap-1.5 lg:gap-2">
          {sections.map((section) => {
            const isActive = active === section.id;
            const isVisited = Boolean(visited[section.id]);
            const isChapter = chapterIds.includes(section.id);
            return (
              <button
                key={section.id}
                type="button"
                aria-label={`Jump to ${section.label}`}
                onClick={() => {
                  if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
                  setSnapPulseId(section.id);
                  pulseTimeoutRef.current = window.setTimeout(() => setSnapPulseId(null), 360);
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`group relative rounded-full border transition-all ${
                  isChapter ? "h-3.5 w-3.5" : "h-3 w-3"
                } ${
                  isActive
                    ? "border-accent bg-accent shadow-[0_0_14px_rgba(168,217,184,0.75)]"
                    : isVisited
                      ? "border-accent/55 bg-accent/60"
                      : "border-highlight/40 bg-transparent hover:border-highlight/70"
                }`}
              >
                {isActive ? (
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/45" aria-hidden />
                ) : null}
                {snapPulseId === section.id ? (
                  <span className="absolute -inset-1 rounded-full border border-accent/60 animate-pulse" aria-hidden />
                ) : null}
                <span className="pointer-events-none absolute right-[calc(100%+0.45rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-highlight/20 bg-bg/90 px-2 py-0.5 font-mono text-[10px] text-highlight/80 group-hover:block xl:right-[calc(100%+0.55rem)]">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
