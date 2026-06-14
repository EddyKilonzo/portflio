"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";
import { smoothScrollTo } from "@/lib/smooth-scroll";

const NAV_SECTIONS = sectionLinks.filter((s) => s.id !== "hero");
const N = NAV_SECTIONS.length;

// ── Geometry ────────────────────────────────────────────────────────────────
const SIZE        = 176;
const CX          = SIZE / 2;   // 88
const CY          = SIZE / 2;   // 88
const RING_R      = 62;
// 80px keeps all circles within the viewport even at the minimum lg breakpoint
// (dial is right-4; with CX=88 the rightmost circle lands 8px from container
// edge = 24px from screen right — safe).
const MENU_RADIUS = 80;

function dotAngleDeg(idx: number): number {
  return (360 / N) * idx - 90; // hero at 12 o'clock initially
}

function dotXY(idx: number): { x: number; y: number } {
  const rad = (dotAngleDeg(idx) * Math.PI) / 180;
  return { x: CX + RING_R * Math.cos(rad), y: CY + RING_R * Math.sin(rad) };
}

function menuCircleXY(idx: number): { mx: number; my: number } {
  const rad = ((360 / N) * idx - 90) * (Math.PI / 180);
  return { mx: Math.cos(rad) * MENU_RADIUS, my: Math.sin(rad) * MENU_RADIUS };
}

// ── Web Audio SFX ────────────────────────────────────────────────────────────
let _actx: AudioContext | null = null;

function getActx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_actx || _actx.state === "closed") {
      _actx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (_actx.state === "suspended") _actx.resume();
    return _actx;
  } catch { return null; }
}

function playTick(freq = 880, vol = 0.02, dur = 0.07) {
  const ctx = getActx();
  if (!ctx) return;
  try {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const t    = ctx.currentTime;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);
    osc.start(t); osc.stop(t + dur + 0.04);
  } catch {}
}

function playDialSweep(steps: number) {
  const count = Math.min(Math.abs(steps), 2);
  for (let i = 0; i < count; i++) {
    setTimeout(() => playTick(830 - i * 18, 0.018 - i * 0.004, 0.065), i * 58);
  }
}

function playJumpClick() {
  playTick(700, 0.03, 0.09);
  setTimeout(() => playTick(900, 0.022, 0.06), 75);
}

function playMenuOpen() {
  playTick(1100, 0.018, 0.05);
  setTimeout(() => playTick(1300, 0.014, 0.04), 60);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function StickySectionRail() {
  const [active,        setActive]        = useState(NAV_SECTIONS[0]!.id);
  const [visited,       setVisited]       = useState<Set<string>>(() => new Set(["hero"]));
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [entered,       setEntered]       = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ringRef       = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const prevIdxRef    = useRef(0);
  const currentRotRef = useRef(0);

  // Show dial only after user scrolls past 130vh
  useEffect(() => {
    const THRESHOLD = window.innerHeight * 1.3;
    const check = () => {
      const past = window.scrollY > THRESHOLD;
      setEntered(past);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Overall scroll progress
  useEffect(() => {
    const onScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      setScrollProgress(Math.min(1, Math.max(0, winScroll / height)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section — scroll-position based for real-time responsiveness,
  // IntersectionObserver as a secondary confirmation pass.
  useEffect(() => {
    const mark = (id: string) => {
      setActive(id);
      setVisited((p) => { const s = new Set(p); s.add(id); return s; });
    };

    // Primary: find whichever section's top is closest to 30% down the viewport.
    const trackByScroll = () => {
      const target = window.scrollY + window.innerHeight * 0.30;
      let best = NAV_SECTIONS[0]!;
      let bestDist = Infinity;
      for (const s of NAV_SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - target);
        if (dist < bestDist) { bestDist = dist; best = s; }
      }
      mark(best.id);
    };

    // Secondary: IntersectionObserver for sections that are clearly dominant.
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) mark(vis.target.id);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75], rootMargin: "-5% 0px -15% 0px" },
    );

    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    // Listen to both native scroll and Lenis scroll events.
    window.addEventListener("scroll", trackByScroll, { passive: true });
    const lenis = (window as any).__lenis;
    if (lenis) lenis.on("scroll", trackByScroll);

    trackByScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", trackByScroll);
      if (lenis) lenis.off("scroll", trackByScroll);
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen]);

  // Animate ring rotation
  useEffect(() => {
    const newIdx = NAV_SECTIONS.findIndex((s) => s.id === active);
    if (newIdx < 0) return;
    const prevIdx = prevIdxRef.current;
    if (newIdx === prevIdx) return;

    let delta = newIdx - prevIdx;
    if (delta >  N / 2) delta -= N;
    if (delta < -N / 2) delta += N;

    const newRot = currentRotRef.current - delta * (360 / N);

    if (ringRef.current) {
      const dur = Math.max(0.45, 0.55 + Math.abs(delta) * 0.035);
      ringRef.current.style.transition = `transform ${dur}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
      ringRef.current.style.transform  = `rotate(${newRot}deg)`;
    }

    playDialSweep(delta);
    currentRotRef.current = newRot;
    prevIdxRef.current    = newIdx;
  }, [active]);

  const jumpTo = (id: string) => {
    const el  = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector("header")?.getBoundingClientRect().height ?? 56;
    const y    = el.getBoundingClientRect().top + window.scrollY - navH;
    smoothScrollTo(y);
    playJumpClick();
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    if (!menuOpen) playMenuOpen();
    setMenuOpen((v) => !v);
  };

  const activeIdx     = NAV_SECTIONS.findIndex((s) => s.id === active);
  const activeSection = NAV_SECTIONS[activeIdx] ?? NAV_SECTIONS[0]!;

  const progressArcCircumference = 2 * Math.PI * RING_R;
  const progressOffset = progressArcCircumference * (1 - scrollProgress);

  return (
    <aside
      ref={containerRef}
      role="navigation"
      aria-label="Dial section navigation"
      className="fixed bottom-44 right-4 z-[9996] hidden lg:block"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
        transition: "opacity 0.45s cubic-bezier(0.34,1.56,0.64,1), transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        pointerEvents: entered ? "auto" : "none",
      }}
    >
      {/* ── Section pill — floats below the dial, real-time current section ── */}
      <div
        className="pointer-events-none absolute top-full whitespace-nowrap"
        style={{
          left: "50%",
          marginTop: 6,
          opacity: menuOpen ? 0 : entered ? 1 : 0,
          transform: menuOpen
            ? "translateX(-50%) translateY(5px)"
            : "translateX(-50%) translateY(0)",
          transition: "opacity 0.26s ease, transform 0.26s ease",
        }}
      >
        {/* Pill badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            paddingLeft: 9,
            paddingRight: 9,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 9999,
            border: "1px solid var(--accent)",
            background: "rgba(var(--rgb-accent),0.15)",
            boxShadow: "0 0 12px rgba(var(--rgb-accent),0.25), 0 2px 8px rgba(0,0,0,0.30)",
          }}
        >
          <span
            style={{
              display: "block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 6px var(--accent)",
              flexShrink: 0,
              animation: "dial-indicator-pulse 2.2s ease-in-out infinite",
            }}
          />
          <span
            className="font-display font-semibold uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--accent)",
            }}
          >
            {activeSection.label}
          </span>
        </div>
      </div>

      {/* ── Dial ───────────────────────────────────────────────────────── */}
      <div
        style={{ width: SIZE, height: SIZE }}
        className="relative select-none"
      >
        {/* ── Radial section circles ─────────────────────────────────── */}
        {NAV_SECTIONS.map((s, idx) => {
          const { mx, my }  = menuCircleXY(idx);
          const isActive    = s.id === active;
          const isVisited   = visited.has(s.id);
          const openDelay   = idx * 22;
          const closeDelay  = Math.max(0, (N - 1 - idx) * 14);

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(s.id)}
              aria-label={`Go to ${s.label}`}
              style={{
                position: "absolute",
                left: CX - 17,
                top: CY - 17,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${
                  isActive
                    ? "var(--accent)"
                    : isVisited
                      ? "rgba(var(--rgb-accent),0.32)"
                      : "rgba(var(--rgb-highlight),0.18)"
                }`,
                background: isActive
                  ? "rgba(var(--rgb-accent),0.22)"
                  : "rgba(var(--rgb-surface),0.90)",
                color: isActive
                  ? "var(--accent)"
                  : isVisited
                    ? "rgba(var(--rgb-highlight),0.82)"
                    : "rgba(var(--rgb-highlight),0.42)",
                fontSize: "8.5px",
                fontFamily: "monospace",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                textAlign: "center",
                padding: "0 2px",
                boxShadow: isActive
                  ? "0 0 14px rgba(var(--rgb-accent),0.45), 0 2px 8px rgba(0,0,0,0.35)"
                  : "0 2px 10px rgba(0,0,0,0.28)",
                transform: menuOpen
                  ? `translate(${mx}px, ${my}px) scale(1)`
                  : `translate(0px, 0px) scale(0.08)`,
                opacity: menuOpen ? 1 : 0,
                transition: menuOpen
                  ? `transform 400ms cubic-bezier(0.34,1.56,0.64,1) ${openDelay}ms, opacity 280ms ease ${openDelay}ms`
                  : `transform 220ms ease ${closeDelay}ms, opacity 160ms ease ${closeDelay}ms`,
                pointerEvents: menuOpen ? "auto" : "none",
                cursor: "pointer",
                outline: "none",
                zIndex: 20,
              }}
            >
              {s.shortLabel.slice(0, 4)}
            </button>
          );
        })}

        {/* ── Rotating ring with dots ─────────────────────────────────── */}
        <div
          ref={ringRef}
          className="absolute inset-0"
          style={{ transform: "rotate(0deg)", transformOrigin: "50% 50%", willChange: "transform" }}
        >
          {NAV_SECTIONS.map((s, i) => {
            const { x, y }  = dotXY(i);
            const isActive  = s.id === active;
            const isVisited = visited.has(s.id);
            const dotSize   = isActive ? 10 : 5;

            return (
              <div
                key={s.id}
                className="absolute flex items-center justify-center"
                style={{ left: x - 10, top: y - 10, width: 20, height: 20 }}
              >
                {isActive && (
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: dotSize + 8,
                      height: dotSize + 8,
                      left: "50%", top: "50%",
                      animation: "dial-dot-ring 1.9s ease-out infinite",
                      border: "1px solid var(--accent)",
                      opacity: 0.7,
                    }}
                  />
                )}
                <span
                  className="block rounded-full"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    background: isActive
                      ? "var(--accent)"
                      : isVisited ? "rgba(var(--rgb-accent),0.45)" : "rgba(var(--rgb-highlight),0.14)",
                    boxShadow: isActive
                      ? "0 0 10px var(--accent), 0 0 4px var(--accent)"
                      : "none",
                    transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, background 0.3s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Static SVG overlay ─────────────────────────────────────── */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <defs>
            <radialGradient id="dialCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="70%"  stopColor="var(--accent)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer halo */}
          <circle cx={CX} cy={CY} r={RING_R + 14}
            fill="none" stroke="rgba(var(--rgb-highlight),0.03)" strokeWidth="1" />

          {/* Dashed track groove */}
          <circle cx={CX} cy={CY} r={RING_R}
            fill="none" stroke="rgba(var(--rgb-highlight),0.08)" strokeWidth="1.5"
            strokeDasharray="3 6" />

          {/* Progress arc — accent fill, rotates from 12 o'clock */}
          <circle
            cx={CX} cy={CY} r={RING_R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={progressArcCircumference}
            strokeDashoffset={progressOffset}
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: "rotate(-90deg)",
              transition: "stroke-dashoffset 0.1s linear",
              opacity: 0.85,
              filter: "drop-shadow(0 0 6px var(--accent))",
            }}
          />

          {/* Tick marks between sections */}
          {Array.from({ length: N }).map((_, i) => {
            const midAngle = ((dotAngleDeg(i) + dotAngleDeg((i + 1) % N)) / 2) * (Math.PI / 180);
            const r1 = RING_R - 4, r2 = RING_R + 4;
            return (
              <line key={i}
                x1={CX + r1 * Math.cos(midAngle)} y1={CY + r1 * Math.sin(midAngle)}
                x2={CX + r2 * Math.cos(midAngle)} y2={CY + r2 * Math.sin(midAngle)}
                stroke="rgba(var(--rgb-highlight),0.06)" strokeWidth="0.5" />
            );
          })}

          {/* Fixed indicator at 12 o'clock */}
          <polygon
            points={`${CX - 3.5},${CY - RING_R - 13} ${CX + 3.5},${CY - RING_R - 13} ${CX},${CY - RING_R - 5}`}
            fill="var(--accent)"
            style={{ animation: "dial-indicator-pulse 2.6s ease-in-out infinite" }}
          />

          {/* Center accent glow halo — sits behind the white button */}
          <circle cx={CX} cy={CY} r={46} fill="url(#dialCenterGlow)" />
        </svg>

        {/* ── Center click zone — opens radial menu ──────────────────── */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open section list"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="absolute flex flex-col items-center justify-center rounded-full focus-visible:outline-none"
          style={{
            left: CX - 36, top: CY - 36,
            width: 72, height: 72,
            cursor: "pointer",
            background: "rgba(var(--rgb-accent),0.18)",
            border: `2px solid var(--accent)`,
            boxShadow: "rgba(50,50,93,0.25) 0px 50px 100px -20px, rgba(0,0,0,0.3) 0px 30px 60px -30px, 0 0 18px rgba(var(--rgb-accent),0.35), rgba(var(--rgb-accent),0.18) 0px -2px 6px 0px inset",
            transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease",
            transform: menuOpen ? "scale(0.88)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = menuOpen ? "scale(0.88)" : "scale(1.08)";
            el.style.background = "rgba(var(--rgb-accent),0.28)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = menuOpen ? "scale(0.88)" : "scale(1)";
            el.style.background = "rgba(var(--rgb-accent),0.18)";
          }}
        >
          <span
            className="block font-display text-[8px] leading-none font-bold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "0.08em", opacity: 0.7 }}
          >
            {String(activeIdx + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
          </span>
          <span
            className="mt-0.5 block max-w-[54px] truncate text-center font-display font-bold leading-none"
            style={{ fontSize: 9, color: "var(--accent)", letterSpacing: "0.06em" }}
          >
            {activeSection.shortLabel}
          </span>
          <span
            className="mt-1.5 block text-[7px] leading-none"
            style={{
              color: "var(--accent)",
              opacity: 0.55,
              transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            ▲
          </span>
        </button>
      </div>
    </aside>
  );
}
