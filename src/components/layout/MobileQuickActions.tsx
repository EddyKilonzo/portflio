"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { smoothScrollTo } from "@/lib/smooth-scroll";

const DIAL_SECTIONS = sectionLinks.filter((s) => s.showInTopNav);
const HINT_KEY = "island-hint-seen";

export function MobileQuickActions() {
  const [visible, setVisible]     = useState(false);
  const [open, setOpen]           = useState(false);
  const [navFlash, setNavFlash]   = useState<string | null>(null); // label being navigated to
  const [showHint, setShowHint]   = useState(false);               // first-appearance hint
  const hintTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSection = useActiveSection(sectionLinks.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show one-time "tap to navigate" hint when island first appears
  useEffect(() => {
    if (!visible) return;
    try {
      if (sessionStorage.getItem(HINT_KEY)) return;
      sessionStorage.setItem(HINT_KEY, "1");
    } catch {}
    setShowHint(true);
    hintTimer.current = setTimeout(() => setShowHint(false), 2200);
    return () => { if (hintTimer.current) clearTimeout(hintTimer.current); };
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeLink  = sectionLinks.find((s) => s.id === activeSection);
  const activeLabel = activeLink?.shortLabel ?? activeLink?.label ?? "—";

  const jumpTo = (id: string) => {
    const link = sectionLinks.find((s) => s.id === id);
    setNavFlash(link?.label ?? id);
    setTimeout(() => {
      setOpen(false);
      setNavFlash(null);
      // Re-read position here (after island closes) so the target is never
      // stale from layout shifts during the 340 ms flash window.
      const el: HTMLElement | null =
        document.getElementById(id) ??
        document.querySelector(`[data-lazy-for="${id}"]`);
      if (!el) return;
      const navH = document.querySelector("header")?.getBoundingClientRect().height ?? 56;
      const y = el.getBoundingClientRect().top + window.scrollY - navH;
      smoothScrollTo(y);
    }, 340);
  };

  const RADIUS = open ? 20 : 9999;
  const headerLabel = navFlash ? `↓ ${navFlash}` : activeLabel;

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[9990] lg:hidden"
        style={{
          pointerEvents: open ? "auto" : "none",
          background: "rgba(0,0,0,0.48)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.22s ease",
        }}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* First-appearance tooltip */}
      {showHint && (
        <div
          className="fixed bottom-[74px] left-1/2 z-[9998] lg:hidden"
          style={{
            transform: "translateX(-50%)",
            animation: "island-hint-in 0.4s ease forwards, island-hint-out 0.4s ease 1.8s forwards",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "rgba(var(--rgb-bg),0.95)",
              border: "1px solid rgba(var(--rgb-accent),0.35)",
              borderRadius: 9999,
              padding: "5px 14px",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(var(--rgb-highlight),0.80)",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.30)",
            }}
          >
            Tap to navigate ↑
          </div>
        </div>
      )}

      {/* Island */}
      <div
        className="fixed bottom-5 left-1/2 z-[9997] lg:hidden"
        style={{
          transform: visible
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(26px) scale(0.90)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.40s cubic-bezier(0.34,1.56,0.64,1), opacity 0.24s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Morphing pill */}
        <div
          style={{
            overflow: "hidden",
            borderRadius: RADIUS,
            border: `1.5px solid ${open ? "rgba(var(--rgb-accent),0.65)" : "rgba(var(--rgb-accent),0.42)"}`,
            background: "rgba(var(--rgb-bg),0.96)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: open
              ? "0 0 0 1px rgba(var(--rgb-accent),0.12), 0 0 32px rgba(var(--rgb-accent),0.30), 0 10px 40px rgba(0,0,0,0.55)"
              : "0 0 0 1px rgba(var(--rgb-accent),0.08), 0 0 16px rgba(var(--rgb-accent),0.22), 0 4px 18px rgba(0,0,0,0.40)",
            width: open ? "min(calc(100vw - 28px), 352px)" : "160px",
            transition: [
              "width 0.40s cubic-bezier(0.34,1.56,0.64,1)",
              "border-radius 0.38s cubic-bezier(0.34,1.56,0.64,1)",
              "box-shadow 0.28s ease",
              "border-color 0.28s ease",
            ].join(", "),
          }}
        >
          {/* Header bar */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation" : `Navigate — at ${activeLink?.label ?? activeSection}`}
            aria-expanded={open}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: 44,
              paddingLeft: 14,
              paddingRight: 12,
              cursor: "pointer",
              outline: "none",
              background: "transparent",
              border: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Pulsing dot + label */}
            <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, overflow: "hidden" }}>
              {/* Dot — uses box-shadow ripple so it never gets clipped by overflow:hidden */}
              <span
                style={{
                  display: "block",
                  flexShrink: 0,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: navFlash ? "var(--highlight)" : "var(--accent)",
                  animation: navFlash ? "none" : "dot-pulse 2.2s ease-in-out infinite",
                  boxShadow: navFlash ? "0 0 10px var(--highlight)" : undefined,
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: navFlash ? "rgba(255,255,255,0.95)" : "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "color 0.2s ease",
                }}
              >
                {headerLabel}
              </span>
            </span>

            {/* Chevron */}
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 15,
                height: 15,
                flexShrink: 0,
                marginLeft: 8,
                color: "rgba(var(--rgb-accent),0.75)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded nav grid */}
          <div
            style={{
              maxHeight: open ? "280px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.40s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            role="menu"
          >
            {/* Divider */}
            <div style={{ height: 1, background: "rgba(var(--rgb-accent),0.18)", marginLeft: 12, marginRight: 12 }} />

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 6,
                padding: "12px 10px 14px",
              }}
            >
              {DIAL_SECTIONS.map((s, idx) => {
                const isActive = activeSection === s.id;
                const isFlashing = navFlash === s.label;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="menuitem"
                    onClick={() => jumpTo(s.id)}
                    aria-label={`Go to ${s.label}`}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      borderRadius: 10,
                      padding: "10px 2px 8px",
                      border: `1px solid ${
                        isFlashing
                          ? "rgba(var(--rgb-highlight),0.50)"
                          : isActive
                          ? "rgba(var(--rgb-accent),0.60)"
                          : "rgba(var(--rgb-highlight),0.12)"
                      }`,
                      background: isFlashing
                        ? "rgba(var(--rgb-highlight),0.18)"
                        : isActive
                        ? "rgba(var(--rgb-accent),0.18)"
                        : "rgba(var(--rgb-highlight),0.06)",
                      color: isFlashing
                        ? "rgba(255,255,255,0.98)"
                        : isActive
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.88)",
                      fontSize: 10,
                      fontFamily: "var(--font-space), system-ui, sans-serif",
                      fontWeight: 600,
                      textAlign: "center",
                      lineHeight: 1.2,
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: isActive ? "0 0 10px rgba(var(--rgb-accent),0.28)" : "none",
                      opacity: open ? 1 : 0,
                      transform: isFlashing
                        ? "scale(1.06)"
                        : open
                        ? "scale(1) translateY(0)"
                        : "scale(0.80) translateY(6px)",
                      transition: open
                        ? `opacity 180ms ease ${idx * 16}ms, transform 300ms cubic-bezier(0.34,1.56,0.64,1) ${idx * 16}ms, background 0.2s ease, color 0.2s ease, border-color 0.2s ease`
                        : "opacity 80ms ease, transform 80ms ease",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {s.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <p
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 9,
                color: "rgba(var(--rgb-highlight),0.35)",
                textAlign: "center",
                paddingBottom: 10,
                letterSpacing: "0.06em",
              }}
            >
              TAP SECTION TO JUMP
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
