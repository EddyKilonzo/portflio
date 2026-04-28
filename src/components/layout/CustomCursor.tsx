"use client";

import { getDeviceProfile } from "@/lib/device-profile";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.isMobileWidth) return;

    let rafId = 0;
    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        gsap.set(dot.current, { x: e.clientX, y: e.clientY });
      }
    };

    const loop = () => {
      const target = pos.current;
      const rp = ringPos.current;
      rp.x += (target.x - rp.x) * 0.12;
      rp.y += (target.y - rp.y) * 0.12;
      if (ring.current) {
        gsap.set(ring.current, { x: rp.x, y: rp.y });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !ring.current) return;
      const interactive = t.closest("a,button,[role='button'],input,textarea");
      if (interactive) {
        gsap.to(ring.current, {
          width: 56,
          height: 56,
          borderColor: "var(--accent)",
          duration: 0.25,
        });
      } else {
        gsap.to(ring.current, {
          width: 36,
          height: 36,
          borderColor: "rgba(168,217,184,0.35)",
          duration: 0.25,
        });
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
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight will-change-transform"
        style={{ mixBlendMode: "screen" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-highlight/35 will-change-transform"
      />
    </div>
  );
}
