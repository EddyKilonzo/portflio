"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";
import { useActiveSection } from "@/hooks/useActiveSection";

const DIAL_SECTIONS = sectionLinks.filter((s) => s.showInTopNav);

export function MobileQuickActions() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeSection = useActiveSection(sectionLinks.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const activeLabel = sectionLinks.find((s) => s.id === activeSection)?.shortLabel ?? "Nav";

  const count = DIAL_SECTIONS.length;
  const radius = 100;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9990] bg-bg/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`fixed bottom-6 right-5 z-[9997] lg:hidden transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>

          {/* Radial section buttons */}
          {DIAL_SECTIONS.map((s, idx) => {
            const angleDeg = -90 + idx * (360 / count);
            const angle = angleDeg * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = activeSection === s.id;

            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-[10px] font-medium shadow-lg backdrop-blur-sm transition-all duration-300
                  ${isActive
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_12px_rgba(var(--rgb-accent),0.4)]"
                    : "border-highlight/20 bg-bg/90 text-highlight/70 hover:border-highlight/40 hover:text-highlight"
                  }
                  ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}
                `}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: open
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                    : `translate(-50%, -50%) scale(0.6)`,
                  transitionDelay: open && !reducedMotion ? `${idx * 20}ms` : "0ms",
                }}
                aria-label={`Go to ${s.label}`}
              >
                <span className="leading-none text-center px-0.5">{s.shortLabel}</span>
              </a>
            );
          })}

          {/* Center button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className={`relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full border transition-all duration-300
              ${open
                ? "border-accent/60 bg-surface/80 shadow-[0_0_20px_rgba(var(--rgb-accent),0.3)] rotate-45"
                : "border-accent/40 bg-surface/70 shadow-[0_0_14px_rgba(var(--rgb-accent),0.2)]"
              }`}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent/70 leading-none">nav</span>
                <span className="mt-0.5 font-mono text-[11px] font-semibold text-accent leading-none">{activeLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
