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

export function Nav() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { light, toggleLight, themeMode, setThemeMode } = useTheme();
  const activeSection = useActiveSection(sectionLinks.map((s) => s.id));
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
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
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
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
      setSheetOpen(false);
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
        data-aos-once="true"
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
          <div className="hidden flex-wrap items-center justify-end gap-1 md:flex">
            {sectionLinks
              .filter((s) => s.showInTopNav)
              .map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={activeSection === l.id ? "page" : undefined}
                className={`mi-interactive relative rounded px-2 py-1 font-mono text-[11px] transition-colors hover:text-highlight ${
                  activeSection === l.id ? "text-accent" : "text-highlight/70"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-0.5 inset-x-1 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                    activeSection === l.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                  aria-hidden
                />
              </a>
            ))}
            <div className="relative ml-2 hidden lg:block">
              <input
                value={quickQuery}
                onFocus={() => setQuickOpen(true)}
                onChange={(e) => {
                  setQuickQuery(e.target.value);
                  setQuickOpen(true);
                }}
                placeholder="Jump..."
                aria-label="Quick jump"
                className="w-28 rounded-md border border-highlight/20 bg-surface/20 px-2 py-1 font-mono text-[11px] text-highlight outline-none"
              />
              {quickOpen ? (
                <div role="listbox" aria-label="Quick jump results" className="absolute right-0 top-8 z-[10002] w-56 max-w-[min(90vw,14rem)] rounded-xl border border-highlight/20 bg-bg/95 p-2 shadow-glass">
                  {quickResults.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      type="button"
                      onClick={() => navigateQuick(r)}
                    className="mi-interactive block w-full rounded px-2 py-1 text-left font-mono text-[11px] text-highlight/85 hover:bg-surface/30"
                    >
                      {r.label}
                      <span className="ml-2 text-[10px] text-highlight/50">{r.type}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="mi-interactive rounded border border-highlight/20 px-2 py-1 font-mono text-[10px] text-highlight/70"
              aria-label="Open command palette"
              title="Open command palette"
            >
              Cmd/Ctrl + K
            </button>
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === "system" ? "dark" : themeMode === "dark" ? "light" : "system")}
              className="mi-interactive ml-2 rounded border border-highlight/15 px-2.5 py-1 font-mono text-[11px] text-accent/80 transition-colors hover:border-highlight/30 hover:text-accent"
              aria-label="Cycle theme mode"
              title={`Theme: ${themeMode} — click to cycle`}
            >
              {themeMode === "system" ? "⊙ Auto" : light ? "☀ Light" : "☾ Dark"}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mi-interactive ml-2 rounded px-2 py-1 font-mono text-[11px] text-accent"
            >
              Settings
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
