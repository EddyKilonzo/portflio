"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";

const NAV_SECTIONS = sectionLinks.filter((s) => s.showInTopNav);
const N = NAV_SECTIONS.length;

// ── Geometry ────────────────────────────────────────────────────────────────
const SIZE   = 176;
const CX     = SIZE / 2;  // 88
const CY     = SIZE / 2;  // 88
const RING_R = 62;

function dotAngleDeg(idx: number): number {
  return (360 / N) * idx - 90; // hero at 12 o'clock initially
}

function dotXY(idx: number): { x: number; y: number } {
  const rad = (dotAngleDeg(idx) * Math.PI) / 180;
  return { x: CX + RING_R * Math.cos(rad), y: CY + RING_R * Math.sin(rad) };
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

function playTick(freq = 880, vol = 0.13, dur = 0.07) {
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
  const count = Math.min(Math.abs(steps), 10);
  for (let i = 0; i < count; i++) {
    setTimeout(() => playTick(830 - i * 18, 0.12 - i * 0.006, 0.065), i * 58);
  }
}

function playJumpClick() {
  playTick(700, 0.22, 0.09);
  setTimeout(() => playTick(900, 0.14, 0.06), 75);
}

function playMenuOpen() {
  playTick(1100, 0.10, 0.05);
  setTimeout(() => playTick(1300, 0.08, 0.04), 60);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function StickySectionRail() {
  const [active,   setActive]   = useState(NAV_SECTIONS[0]!.id);
  const [visited,  setVisited]  = useState<Set<string>>(() => new Set(["hero"]));
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered,  setEntered]  = useState(false);
  const ringRef      = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIdxRef   = useRef(0);
  const currentRotRef = useRef(0);

  // Entry animation
  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(id);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) {
          setActive(vis.target.id);
          setVisited((p) => { const s = new Set(p); s.add(vis.target.id); return s; });
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: "-10% 0px -40% 0px" },
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
    const el   = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector("header")?.getBoundingClientRect().height ?? 56;
    const y    = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    playJumpClick();
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    if (!menuOpen) playMenuOpen();
    setMenuOpen((v) => !v);
  };

  const activeIdx     = NAV_SECTIONS.findIndex((s) => s.id === active);
  const activeSection = NAV_SECTIONS[activeIdx] ?? NAV_SECTIONS[0]!;

  return (
    <aside
      ref={containerRef}
      role="navigation"
      aria-label="Dial section navigation"
      className="fixed bottom-8 right-4 z-[9996] hidden lg:block"
      style={{
        animation: entered ? "dial-entry 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
        opacity: entered ? undefined : 0,
      }}
    >
      {/* ── Section popup menu ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-full right-0 mb-3 w-48 overflow-hidden rounded-xl border border-white/20 bg-black/85 shadow-2xl backdrop-blur-md"
        style={{
          transformOrigin: "bottom right",
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "scale(1) translateY(0)" : "scale(0.88) translateY(8px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        role="menu"
      >
        <div className="py-2">
          {NAV_SECTIONS.map((s, i) => {
            const isActive  = s.id === active;
            const isVisited = visited.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
                onClick={() => jumpTo(s.id)}
                className={`flex w-full items-center gap-2.5 px-4 py-1.5 text-left font-mono text-[11px] transition-all duration-150 ${
                  isActive
                    ? "bg-white/8 text-white"
                    : isVisited
                      ? "text-white/55 hover:bg-white/5 hover:text-white/85"
                      : "text-white/25 hover:bg-white/5 hover:text-white/50"
                }`}
              >
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-150"
                  style={{
                    background: isActive
                      ? "#ffffff"
                      : isVisited ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                    boxShadow: isActive ? "0 0 6px rgba(255,255,255,0.8)" : "none",
                  }}
                />
                <span className="flex-1">{s.label}</span>
                <span className="text-white/20">{String(i + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dial ───────────────────────────────────────────────────────── */}
      <div
        style={{ width: SIZE, height: SIZE }}
        className="relative select-none"
      >
        {/* Rotating ring with dots */}
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
                {/* Expanding ring on active dot */}
                {isActive && (
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: dotSize + 8,
                      height: dotSize + 8,
                      left: "50%", top: "50%",
                      animation: "dial-dot-ring 1.8s ease-out infinite",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  />
                )}
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    background: isActive
                      ? "#ffffff"
                      : isVisited ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.16)",
                    boxShadow: isActive
                      ? "0 0 10px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.5)"
                      : "none",
                    transition: "width 0.3s, height 0.3s, box-shadow 0.3s",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Static SVG overlay */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          {/* Outer halo */}
          <circle cx={CX} cy={CY} r={RING_R + 12}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* Dashed track groove */}
          <circle cx={CX} cy={CY} r={RING_R}
            fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5"
            strokeDasharray="3 5" />

          {/* Tick marks between sections */}
          {Array.from({ length: N }).map((_, i) => {
            const midAngle = ((dotAngleDeg(i) + dotAngleDeg((i + 1) % N)) / 2) * (Math.PI / 180);
            const r1 = RING_R - 5, r2 = RING_R + 5;
            return (
              <line key={i}
                x1={CX + r1 * Math.cos(midAngle)} y1={CY + r1 * Math.sin(midAngle)}
                x2={CX + r2 * Math.cos(midAngle)} y2={CY + r2 * Math.sin(midAngle)}
                stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
            );
          })}

          {/* Fixed indicator at 12 o'clock — pulsing */}
          <polygon
            points={`${CX - 4},${CY - RING_R - 14} ${CX + 4},${CY - RING_R - 14} ${CX},${CY - RING_R - 5}`}
            fill="rgba(255,255,255,0.80)"
            style={{ animation: "dial-indicator-pulse 2.4s ease-in-out infinite" }}
          />

          {/* Center bezel */}
          <circle cx={CX} cy={CY} r={40}
            fill="rgba(5,14,9,0.92)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={35}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        </svg>

        {/* Center click zone — opens menu */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open section list"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="absolute flex flex-col items-center justify-center rounded-full focus-visible:outline-none"
          style={{
            left: CX - 35, top: CY - 35,
            width: 70, height: 70,
            cursor: "pointer",
            transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            transform: menuOpen ? "scale(0.92)" : "scale(1)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = menuOpen ? "scale(0.92)" : "scale(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = menuOpen ? "scale(0.92)" : "scale(1)"; }}
        >
          <span className="block font-mono text-[8px] leading-none text-white/38">
            {String(activeIdx + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
          </span>
          <span className="mt-1 block font-mono text-[9px] font-bold leading-none text-white">
            {activeSection.shortLabel}
          </span>
          <span
            className="mt-1.5 block font-mono text-[7px] leading-none text-white/30 transition-transform duration-200"
            style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▲
          </span>
        </button>
      </div>
    </aside>
  );
}
