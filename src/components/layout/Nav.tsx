"use client";

import { useEffect, useMemo, useState } from "react";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useTheme } from "@/context/ThemeContext";
import { sectionLinks } from "@/content/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { certifications, projects } from "@/content/portfolio";
import { emitToast } from "@/lib/toast";
import gsap from "gsap";
import { motionTokens } from "@/lib/motion-tokens";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export function Nav() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { light, toggleLight, themeMode, setThemeMode } = useTheme();
  const activeSection = useActiveSection(
    sectionLinks.filter((s) => s.showInTopNav).map((s) => s.id),
  );
  const quickTargets = useMemo(
    () => [
      ...sectionLinks.map((s) => ({
        id: s.id,
        label: s.label,
        type: "section" as const,
      })),
      ...projects.map((p) => ({ id: p.id, label: p.title, type: "project" as const })),
      ...certifications.map((c) => ({ id: c.id, label: c.name, type: "cert" as const })),
    ],
    [],
  );
  const quickResults = useMemo(() => {
    const q = quickQuery.trim().toLowerCase();
    if (!q) return quickTargets.slice(0, 8);
    return quickTargets
      .filter((t) => t.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [quickQuery, quickTargets]);

  const getNavOffset = () => {
    const nav = document.querySelector("header");
    return nav ? nav.getBoundingClientRect().height : 56;
  };

  const navigateQuick = (target: (typeof quickTargets)[number]) => {
    if (target.type === "section") {
      const el = document.getElementById(target.id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
        smoothScrollTo(y);
        history.replaceState(null, "", `#${target.id}`);
      }
    } else if (target.type === "project") {
      const params = new URLSearchParams(window.location.search);
      params.set("q", target.label);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}#projects`,
      );
      window.dispatchEvent(new Event("popstate"));
      window.location.hash = "projects";
      emitToast("Project filter applied", "success");
    } else {
      window.location.hash = "certs";
      emitToast("Jumped to certifications", "success");
    }
    setQuickOpen(false);
    setQuickQuery("");
  };

  useEffect(() => {
    const onHash = () => setSheetOpen(false);
    const onResize = () => {
      if (window.innerWidth >= 768) setSheetOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [sheetOpen]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 56);
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY + 4) {
        setHidden(true);
      } else if (y < lastY - 4) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href")?.replace("#", "");
      if (!id) return;
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      setSheetOpen(false);
      // Defer scroll by one rAF so the sheet unmounts and body.overflow
      // is cleared before Lenis reads the scroll position.
      requestAnimationFrame(() => {
        const el: HTMLElement | null =
          document.getElementById(id) ??
          (document.querySelector(`[data-lazy-for="${id}"]`) as HTMLElement | null);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
        smoothScrollTo(y);
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!sheetOpen) {
      setSheetReady(false);
      return;
    }
    const sheet = document.getElementById("mobile-nav-sheet");
    if (!sheet) return;
    setSheetReady(true);
    sheet.style.willChange = "transform, opacity";
    gsap.fromTo(
      sheet,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.standard,
        onComplete: () => {
          sheet.style.willChange = "auto";
        },
      },
    );
  }, [sheetOpen]);

  return (
    <>
      <header 
        className={`glass-nav fixed left-0 right-0 top-0 z-[9997] transition-all duration-300 ${scrolled ? "py-0.5 shadow-[0_6px_24px_rgba(0,0,0,0.22)]" : ""} ${hidden ? "-translate-y-full" : "translate-y-0"}`}
        data-aos="fade-down"
        data-aos-duration="600"
       
      >
        <nav aria-label="Primary" className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all ${scrolled ? "py-2" : "py-3"}`}>
          <a
            href="#hero"
            className="inline-flex items-baseline gap-2 font-display tracking-tight text-highlight"
          >
            <span className="text-lg font-semibold">EMK</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
              Crafted Securely
            </span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {/* Primary nav links */}
            {sectionLinks
              .filter((s) => s.showInTopNav)
              .map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  aria-current={activeSection === l.id ? "page" : undefined}
                  className={`mi-interactive relative rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium transition-colors hover:text-highlight ${
                    activeSection === l.id ? "text-accent" : "text-highlight/65"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute bottom-0 inset-x-2 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                      activeSection === l.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                    aria-hidden
                  />
                </a>
              ))}

            {/* More dropdown */}
            <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setMoreOpen(true)}
                onClick={() => setMoreOpen((v) => !v)}
                className={`mi-interactive flex items-center gap-1 rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium transition-colors hover:text-highlight ${
                  moreOpen ? "text-highlight" : "text-highlight/65"
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                More
                <svg className={`h-3 w-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {moreOpen && (
                <div
                  className="absolute left-0 top-full z-[10002] mt-1.5 w-44 rounded-xl border border-highlight/15 bg-bg/97 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md"
                  onMouseEnter={() => setMoreOpen(true)}
                >
                  {sectionLinks
                    .filter((s) => !s.showInTopNav && s.id !== "hero")
                    .map((l) => (
                      <a
                        key={l.id}
                        href={`#${l.id}`}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center rounded-lg px-3 py-1.5 font-mono text-[11px] transition-colors hover:bg-surface/25 hover:text-highlight ${
                          activeSection === l.id ? "text-accent" : "text-highlight/70"
                        }`}
                      >
                        {l.label}
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-1.5 h-4 w-px bg-highlight/15" aria-hidden />

            {/* Controls */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="mi-interactive flex h-7 items-center gap-1.5 rounded-lg border border-highlight/20 px-2 font-mono text-[10px] text-highlight/55 transition-colors hover:border-highlight/35 hover:text-highlight/80"
              aria-label="Open command palette (Ctrl+K)"
              title="Command palette — Ctrl+K"
            >
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <circle cx="6.5" cy="6.5" r="4.5" /><path d="m10 10 3.5 3.5" />
              </svg>
              <span className="hidden lg:inline">Search</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode(light ? "dark" : "light")}
              className="mi-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-highlight/20 text-highlight/60 transition-colors hover:border-highlight/35 hover:text-highlight/85"
              aria-label={`Switch to ${light ? "dark" : "light"} mode`}
              title={`Currently ${light ? "light" : "dark"} mode`}
            >
              {light ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mi-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-highlight/20 text-highlight/60 transition-colors hover:border-highlight/35 hover:text-highlight/85"
              aria-label="Open settings"
              title="Settings"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="mi-interactive rounded-md border border-highlight/20 px-3 py-1.5 font-mono text-xs text-accent md:hidden"
            onClick={() => setSheetOpen((v) => !v)}
            aria-expanded={sheetOpen}
            aria-controls="mobile-nav-sheet"
            aria-label={sheetOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {sheetOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </header>
      {sheetOpen ? (
        <div
          className="fixed inset-0 z-[10000] bg-bg/55 backdrop-blur-sm md:hidden"
          onClick={() => setSheetOpen(false)}
          role="presentation"
        >
          <div
            id="mobile-nav-sheet"
            className={`absolute bottom-0 left-0 right-0 rounded-t-2xl border border-highlight/15 bg-bg/95 p-4 shadow-[0_-14px_40px_rgba(0,0,0,0.35)] ${sheetReady ? "" : "opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation sheet"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-highlight/20" />
            <p className="mb-3 font-display text-lg text-highlight">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-2">
              {sectionLinks.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`rounded-lg border bg-surface/20 px-3 py-2 font-mono text-xs ${
                    activeSection === l.id
                      ? "border-accent/50 text-accent"
                      : "border-highlight/15 text-highlight/85"
                  }`}
                  onClick={() => setSheetOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn-ghost py-2 text-xs"
                onClick={toggleLight}
              >
                {light ? "Dark mode" : "Light mode"}
              </button>
              <button
                type="button"
                className="btn-ghost py-2 text-xs"
                onClick={() => {
                  setSheetOpen(false);
                  smoothScrollTo(0);
                }}
              >
                Back to top
              </button>
              <button
                type="button"
                className="btn-ghost py-2 text-xs"
                onClick={() => {
                  setSheetOpen(false);
                  setSettingsOpen(true);
                }}
              >
                Theme & Settings
              </button>
              <a href="#contact" className="btn-ghost py-2 text-center text-xs" onClick={() => setSheetOpen(false)}>
                Contact Action
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
