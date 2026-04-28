"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function StickySectionRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id);
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

  return (
    <aside className="fixed right-4 top-1/2 z-[9996] hidden -translate-y-1/2 lg:block">
      <div className="rounded-2xl border border-highlight/15 bg-bg/45 px-2 py-3 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                type="button"
                aria-label={`Jump to ${section.label}`}
                onClick={() =>
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={`group relative h-3 w-3 rounded-full border transition-all ${
                  isActive
                    ? "border-accent bg-accent shadow-[0_0_14px_rgba(168,217,184,0.75)]"
                    : "border-highlight/40 bg-transparent hover:border-highlight/70"
                }`}
              >
                <span className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-highlight/20 bg-bg/90 px-2 py-0.5 font-mono text-[10px] text-highlight/80 group-hover:block">
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
