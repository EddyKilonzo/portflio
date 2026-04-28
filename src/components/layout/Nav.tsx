"use client";

import { useState } from "react";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#roles", label: "Roles" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#cyber", label: "Cyber" },
  { href: "#reports", label: "Reports" },
  { href: "#badges", label: "Badges" },
  { href: "#education", label: "Education" },
  { href: "#certs", label: "Certs" },
  { href: "#experience", label: "Experience" },
  { href: "#cv", label: "CV" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <header className="glass-nav fixed left-0 right-0 top-0 z-[9997]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
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
            {links.slice(0, 8).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded px-2 py-1 font-mono text-[11px] text-highlight/70 transition-colors hover:text-highlight"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="ml-2 rounded px-2 py-1 font-mono text-[11px] text-accent"
            >
              Settings
            </button>
          </div>
          <button
            type="button"
            className="rounded-md border border-highlight/20 px-3 py-1.5 font-mono text-xs text-accent md:hidden"
            onClick={() => setSheetOpen(true)}
          >
            Menu
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
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-highlight/15 bg-bg/95 p-4 shadow-[0_-14px_40px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation sheet"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-highlight/20" />
            <p className="mb-3 font-display text-lg text-highlight">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-xs text-highlight/85"
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
