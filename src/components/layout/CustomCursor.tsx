"use client";

import { getDeviceProfile } from "@/lib/device-profile";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const TRAIL_COUNT = 8;

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const history = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 32 }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.isMobileWidth) return;

    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) gsap.set(dot.current, { x: e.clientX, y: e.clientY });
      history.current.unshift({ x: e.clientX, y: e.clientY });
      if (history.current.length > 32) history.current.pop();
    };

    const loop = () => {
      const target = pos.current;
      const rp = ringPos.current;
      rp.x += (target.x - rp.x) * 0.12;
      rp.y += (target.y - rp.y) * 0.12;
      if (ring.current) gsap.set(ring.current, { x: rp.x, y: rp.y });

      const hist = history.current;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = trailRefs.current[i];
        if (!el) continue;
        const idx = Math.min((i + 1) * 3, hist.length - 1);
        const hp = hist[idx] ?? hist[hist.length - 1];
        gsap.set(el, { x: hp.x, y: hp.y });
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !ring.current) return;
      const interactive = t.closest("a,button,[role='button'],input,textarea");
      if (interactive) {
        gsap.to(ring.current, { width: 44, height: 44, borderColor: "var(--accent)", opacity: 0.75, duration: 0.25 });
      } else {
        gsap.to(ring.current, { width: 30, height: 30, borderColor: "rgba(168,217,184,0.35)", opacity: 0.55, duration: 0.25 });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("mouseover", onHover);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onHover);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-screen md:block"
      aria-hidden
    >
      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => {
        const trailColor = i === 0 ? "var(--accent)" : i === 1 ? "rgba(168,217,184,0.9)" : i === 2 ? "var(--cyber)" : "var(--highlight)";
        const glowColor  = i === 0 ? "var(--accent)" : i === 2 ? "var(--cyber)" : "rgba(168,217,184,0.4)";
        const sz = Math.max(2, 9 - i);
        return (
          <div
            key={i}
            ref={(el) => { trailRefs.current[i] = el; }}
            className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
            style={{
              width: sz,
              height: sz,
              opacity: (1 - i / TRAIL_COUNT) * 0.62,
              background: trailColor,
              boxShadow: i < 4 ? `0 0 ${10 - i * 2}px ${glowColor}` : "none",
            }}
          />
        );
      })}
      {/* Main dot */}
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight/85 will-change-transform"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Ring */}
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-highlight/30 will-change-transform"
      />
    </div>
  );
}
