"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";

const NAV_SECTIONS = sectionLinks.filter((s) => s.showInTopNav);

export function StickySectionRail() {
  const [active, setActive] = useState("hero");
  const [visited, setVisited] = useState<Record<string, boolean>>({ hero: true });
  const [snapPulseId, setSnapPulseId] = useState<string | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id);
          setVisited((prev) => ({ ...prev, [visible.target.id]: true }));
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: "-10% 0px -40% 0px" },
    );
    const targets = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    },
    [],
  );

  const jumpTo = (id: string) => {
    if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    setSnapPulseId(id);
    pulseTimeoutRef.current = window.setTimeout(() => setSnapPulseId(null), 500);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeIdx = NAV_SECTIONS.findIndex((s) => s.id === active);

  return (
    <aside
      role="navigation"
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-[9996] hidden -translate-y-1/2 flex-col items-center lg:flex"
    >
      {NAV_SECTIONS.map((section, idx) => {
        const isActive = active === section.id;
        const isVisited = Boolean(visited[section.id]);
        const isPast = idx < activeIdx;
        const isPulsing = snapPulseId === section.id;

        return (
          <div key={section.id} className="relative flex flex-col items-center">
            {/* Connecting segment above dot (skip first) */}
            {idx > 0 && (
              <div className="relative h-5 w-px overflow-hidden">
                <div className="absolute inset-0 bg-highlight/10" />
                {isPast || isActive ? (
                  <div className="absolute inset-0 bg-accent/60 transition-all duration-500" />
                ) : null}
              </div>
            )}

            <button
              type="button"
              onClick={() => jumpTo(section.id)}
              aria-label={`Jump to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center"
            >
              {/* Label: always visible when active, shown on hover otherwise */}
              <span
                className={`pointer-events-none absolute right-[calc(100%+0.65rem)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border px-2.5 py-0.5 font-mono text-[10px] backdrop-blur-sm transition-all duration-200
                  ${isActive
                    ? "border-accent/40 bg-bg/95 text-accent opacity-100 shadow-[0_0_8px_rgba(var(--rgb-accent),0.15)]"
                    : "border-highlight/15 bg-bg/90 text-highlight/55 opacity-0 group-hover:opacity-100"
                  }`}
              >
                {section.label}
              </span>

              {/* Circle */}
              <span
                className={`relative flex items-center justify-center rounded-full transition-all duration-300
                  ${isActive
                    ? "h-4 w-4 bg-accent shadow-[0_0_12px_rgba(var(--rgb-accent),0.55)] ring-2 ring-accent/25"
                    : isPast
                      ? "h-2.5 w-2.5 border border-accent/50 bg-accent/20 hover:bg-accent/40"
                      : "h-2 w-2 border border-highlight/20 bg-bg hover:border-highlight/40"
                  }`}
              >
                {/* Active ping */}
                {isActive && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-accent/30"
                    aria-hidden
                  />
                )}
                {/* Jump pulse */}
                {isPulsing && (
                  <span
                    className="absolute rounded-full border border-accent/60"
                    style={{
                      inset: "-7px",
                      animation: "rail-jump-hint 0.45s cubic-bezier(0,0,0.2,1) forwards",
                    }}
                    aria-hidden
                  />
                )}
              </span>
            </button>
          </div>
        );
      })}
    </aside>
  );
}
