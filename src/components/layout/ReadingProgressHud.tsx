"use client";

import { sectionLinks } from "@/content/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useEffect, useMemo, useState } from "react";

const STORAGE_LAST = "portfolio-last-section-v1";
const STORAGE_VISITED = "portfolio-visited-sections-v1";

export function ReadingProgressHud() {
  const ids = sectionLinks.map((s) => s.id);
  const activeSection = useActiveSection(ids);
  const [lastSection, setLastSection] = useState<string | null>(null);
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    try {
      const prev = localStorage.getItem(STORAGE_LAST);
      if (prev) setLastSection(prev);
      const raw = localStorage.getItem(STORAGE_VISITED);
      if (raw) setVisited(JSON.parse(raw) as Record<string, boolean>);
      if (prev && prev !== "hero") setShowResume(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    setLastSection(activeSection);
    setVisited((prev) => {
      const next = { ...prev, [activeSection]: true };
      try {
        localStorage.setItem(STORAGE_LAST, activeSection);
        localStorage.setItem(STORAGE_VISITED, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [activeSection]);

  const progress = useMemo(
    () => ids.filter((id) => visited[id]).length,
    [ids, visited],
  );
  const resumeLabel =
    sectionLinks.find((s) => s.id === lastSection)?.label ?? "Last section";

  return (
    <>
      {showResume && lastSection && lastSection !== "hero" ? (
        <button
          type="button"
          className="fixed left-4 top-20 z-[10010] rounded-full border border-accent/50 bg-bg/85 px-3 py-1 font-mono text-xs text-accent backdrop-blur"
          onClick={() => {
            document.getElementById(lastSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
            setShowResume(false);
          }}
        >
          Resume from {resumeLabel}
        </button>
      ) : null}
      <aside className="fixed left-3 top-1/2 z-[9996] hidden -translate-y-1/2 xl:block">
        <div className="rounded-2xl border border-highlight/20 bg-bg/70 px-2 py-3 backdrop-blur">
          <p className="mb-2 text-center font-mono text-[10px] text-highlight/60">
            {progress}/{ids.length}
          </p>
          <div className="flex flex-col items-center gap-2">
            {sectionLinks.map((section) => {
              const done = Boolean(visited[section.id]);
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`h-3 w-3 rounded-full border ${
                    done
                      ? "border-accent bg-accent"
                      : "border-highlight/35 bg-transparent"
                  }`}
                  onClick={() =>
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  aria-label={`Jump to ${section.label}`}
                  title={done ? `${section.label} complete` : section.label}
                />
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
