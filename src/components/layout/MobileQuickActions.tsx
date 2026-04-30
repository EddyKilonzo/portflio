"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/content/sections";
import { trackEvent } from "@/lib/analytics";
import { useActiveSection } from "@/hooks/useActiveSection";

export function MobileQuickActions() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialing, setDialing] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [trayMotion, setTrayMotion] = useState<"full" | "reduced">("full");
  const [traySize, setTraySize] = useState<"sm" | "md" | "lg">("md");
  const [previewSectionId, setPreviewSectionId] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const tickTimersRef = useRef<number[]>([]);
  const nodeRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeSection = useActiveSection(sectionLinks.map((s) => s.id));

  const playDialNoise = () => {
    if (!soundEnabled) return;
    if (typeof window === "undefined") return;
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!audioRef.current) audioRef.current = new Ctx();
    const ctx = audioRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  const playTick = () => {
    if (!soundEnabled) return;
    if (typeof window === "undefined") return;
    const Ctx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    if (!audioRef.current) audioRef.current = new Ctx();
    const ctx = audioRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1350, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  };

  const triggerDialSpin = () => {
    if (reducedMotion || trayMotion === "reduced") return;
    tickTimersRef.current.forEach((id) => window.clearTimeout(id));
    tickTimersRef.current = [];
    setDialing(true);
    const tickOffsets = [0, 70, 140, 220, 300, 390];
    tickOffsets.forEach((ms, i) => {
      const id = window.setTimeout(() => {
        playTick();
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(i % 2 === 0 ? 8 : 5);
        }
      }, ms);
      tickTimersRef.current.push(id);
    });
    const endId = window.setTimeout(() => setDialing(false), 520);
    tickTimersRef.current.push(endId);
  };

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    try {
      const sound = localStorage.getItem("tray-sound-enabled-v1");
      const motion = localStorage.getItem("tray-motion-v1");
      const size = localStorage.getItem("tray-size-v1");
      if (sound === "false") setSoundEnabled(false);
      if (motion === "full" || motion === "reduced") setTrayMotion(motion);
      if (size === "sm" || size === "md" || size === "lg") setTraySize(size);
    } catch {
      // ignore storage failures
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tray-sound-enabled-v1", String(soundEnabled));
      localStorage.setItem("tray-motion-v1", trayMotion);
      localStorage.setItem("tray-size-v1", traySize);
    } catch {
      // ignore storage failures
    }
  }, [soundEnabled, trayMotion, traySize]);

  useEffect(() => {
    return () => {
      tickTimersRef.current.forEach((id) => window.clearTimeout(id));
      tickTimersRef.current = [];
    };
  }, []);

  const traySizeClass =
    traySize === "sm"
      ? "h-48 w-48 lg:h-56 lg:w-56"
      : traySize === "lg"
        ? "h-64 w-64 lg:h-72 lg:w-72"
        : "h-56 w-56 lg:h-64 lg:w-64";
  const dialRadius = traySize === "sm" ? 88 : traySize === "lg" ? 126 : 108;
  const previewLabel =
    sectionLinks.find((s) => s.id === previewSectionId)?.label ??
    sectionLinks.find((s) => s.id === activeSection)?.label ??
    "Section";

  return (
    <div
      className={`fixed bottom-5 right-5 z-[9998] lg:bottom-6 lg:right-6 transition-all ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      onKeyDown={(e) => {
        if (!open) return;
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const active = document.activeElement as HTMLElement | null;
        const current = nodeRefs.current.findIndex((n) => n === active);
        const start = current >= 0 ? current : 0;
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = (start + step + sectionLinks.length) % sectionLinks.length;
        nodeRefs.current[next]?.focus();
        e.preventDefault();
      }}
    >
      <div className={`relative ${traySizeClass}`}>
        {sectionLinks.map((s, idx) => {
          const ringCount = Math.max(sectionLinks.length, 1);
          const angleDeg = ringCount === 1 ? -90 : -90 + idx * (360 / ringCount);
          const angle = angleDeg * (Math.PI / 180);
          const radius = open ? dialRadius : 0;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => {
                playDialNoise();
                trackEvent("tray_section_click", { section: s.id, label: s.label });
                setAnnounce(`Navigating to ${s.label}`);
                setOpen(false);
              }}
              onMouseEnter={() => setPreviewSectionId(s.id)}
              onMouseLeave={() => setPreviewSectionId(null)}
              onFocus={() => setPreviewSectionId(s.id)}
              onBlur={() => setPreviewSectionId(null)}
              ref={(el) => {
                nodeRefs.current[idx] = el;
              }}
              className={`absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-highlight/20 bg-bg/90 px-1 text-center text-[9px] font-mono text-highlight shadow-glass transition-all duration-300 lg:h-11 lg:w-11 lg:text-[10px] ${
                open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${
                  open ? 1 : 0.75
                })`,
                transitionDelay: `${open && !reducedMotion ? idx * 16 : 0}ms`,
              }}
              aria-label={`Go to ${s.label}`}
              title={s.label}
            >
              <span className={activeSection === s.id ? "text-accent" : ""}>
                {s.shortLabel}
              </span>
            </a>
          );
        })}

        <button
          type="button"
          onClick={() => {
            playDialNoise();
            triggerDialSpin();
            trackEvent("tray_toggle", { open: !open });
            setOpen((v) => !v);
          }}
          aria-label={open ? "Close section tray" : "Open section tray"}
          className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/55 bg-surface/70 font-mono text-[10px] tracking-[0.14em] text-accent shadow-[0_0_18px_rgba(168,217,184,0.32)] transition-transform duration-500 ${
            open ? "rotate-12" : "rotate-0"
          } ${dialing && !reducedMotion && trayMotion === "full" ? "animate-[dialSpin_520ms_cubic-bezier(0.22,1,0.36,1)]" : ""}
          `}
          style={{
            transformOrigin: "50% 50%",
          }}
        >
          DIAL
        </button>
        {open ? (
          <button
            type="button"
            onClick={() => setPrefsOpen((v) => !v)}
            className="absolute bottom-4 right-4 rounded-full border border-highlight/20 bg-bg/80 px-2 py-1 font-mono text-[10px] text-highlight/75"
          >
            PREFS
          </button>
        ) : null}
        {open && prefsOpen ? (
          <div className="absolute bottom-12 right-0 w-40 rounded-xl border border-highlight/20 bg-bg/95 p-2 shadow-glass">
            <button
              type="button"
              className="mb-1 block w-full rounded px-2 py-1 text-left font-mono text-[11px] text-highlight/85 hover:bg-surface/25"
              onClick={() => setSoundEnabled((v) => !v)}
            >
              Sound: {soundEnabled ? "On" : "Off"}
            </button>
            <button
              type="button"
              className="mb-1 block w-full rounded px-2 py-1 text-left font-mono text-[11px] text-highlight/85 hover:bg-surface/25"
              onClick={() =>
                setTrayMotion((v) => (v === "full" ? "reduced" : "full"))
              }
            >
              Motion: {trayMotion}
            </button>
            <button
              type="button"
              className="block w-full rounded px-2 py-1 text-left font-mono text-[11px] text-highlight/85 hover:bg-surface/25"
              onClick={() =>
                setTraySize((v) =>
                  v === "sm" ? "md" : v === "md" ? "lg" : "sm",
                )
              }
            >
              Size: {traySize}
            </button>
          </div>
        ) : null}
        {open ? (
          <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 rounded-md border border-highlight/20 bg-bg/90 px-3 py-1.5 text-center font-mono text-[10px] text-highlight/75">
            <p>Tap a code to jump</p>
            <p className="text-accent/90">Selected: {previewLabel}</p>
          </div>
        ) : null}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
      <style jsx>{`
        @keyframes dialSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          55% {
            transform: translate(-50%, -50%) rotate(128deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(12deg);
          }
        }
      `}</style>
    </div>
  );
}

