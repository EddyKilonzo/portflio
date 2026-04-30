"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";

const NAV_SECTIONS = sectionLinks.filter((s) => s.showInTopNav);

export function StickySectionRail() {
  const [active, setActive] = useState("hero");
  const [visited, setVisited] = useState<Record<string, boolean>>({ hero: true });
  const [progress, setProgress] = useState(0);
  const [snapPulseId, setSnapPulseId] = useState<string | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) {
          setActive(vis.target.id);
          setVisited((prev) => ({ ...prev, [vis.target.id]: true }));
        }
      },
      { threshold: [0.1, 0.3], rootMargin: "-10% 0px -55% 0px" },
    );
    const targets = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById(active);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      setProgress(
        Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / Math.max(1, rect.height))),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    },
    [],
  );

  const jumpTo = (id: string) => {
    if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    setSnapPulseId(id);
    pulseTimeoutRef.current = window.setTimeout(() => setSnapPulseId(null), 400);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside
      role="navigation"
      aria-label="Section navigation"
      className="fixed right-2 top-1/2 z-[9996] hidden -translate-y-1/2 lg:block"
    >
      <div className="flex flex-col rounded-2xl border border-highlight/10 bg-bg/55 py-1.5 shadow-md backdrop-blur-sm">
        {/* Nav items */}
        <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-y-auto">
          {NAV_SECTIONS.map((section) => {
            const isActive = active === section.id;
            const isVisited = Boolean(visited[section.id]);
            const isPulsing = snapPulseId === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                aria-label={`Jump to ${section.label}`}
                className={`group relative flex items-center gap-1.5 py-1.5 pl-2.5 pr-2.5 transition-colors ${
                  isActive
                    ? "text-accent"
                    : isVisited
                      ? "text-highlight/50 hover:text-highlight/80"
                      : "text-highlight/25 hover:text-highlight/55"
                }`}
              >
                {/* Active left bar */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r bg-accent transition-all duration-200 ${
                    isActive ? "h-4 w-[2px] opacity-100" : "h-0 w-[2px] opacity-0"
                  }`}
                  aria-hidden
                />

                {/* Dot */}
                <span
                  className={`relative shrink-0 rounded-full transition-all duration-200 ${
                    isActive
                      ? "h-[7px] w-[7px] bg-accent shadow-[0_0_8px_rgba(168,217,184,0.7)]"
                      : isVisited
                        ? "h-1 w-1 bg-current"
                        : "h-1 w-1 border border-current"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full bg-accent/40"
                      aria-hidden
                    />
                  )}
                  {isPulsing && (
                    <span
                      className="absolute rounded-full border border-accent"
                      style={{ inset: "-5px", animation: "rail-jump-hint 0.38s cubic-bezier(0,0,0.2,1) forwards" }}
                      aria-hidden
                    />
                  )}
                </span>

                {/* Tooltip label shown only on hover/focus to keep rail compact */}
                <span className="pointer-events-none absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded border border-highlight/20 bg-bg/95 px-2 py-0.5 font-mono text-[10px] text-highlight/85 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section progress indicator */}
        <div className="mx-2.5 mt-1.5 h-px overflow-hidden rounded-full bg-highlight/15">
          <div
            className="h-full origin-left bg-accent/60"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </aside>
  );
}
