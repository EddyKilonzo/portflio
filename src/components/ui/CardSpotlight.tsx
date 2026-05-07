"use client";

import { useEffect } from "react";
import { getDeviceProfile } from "@/lib/device-profile";

/**
 * Mounts one global mousemove listener that tracks cursor position
 * relative to every .glass-card and writes --sg-x / --sg-y CSS vars.
 * The gradient spotlight is rendered via globals.css background-image.
 */
export function CardSpotlight() {
  useEffect(() => {
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.isMobileWidth) return;

    let prev: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--sg-x", "-9999px");
      el.style.setProperty("--sg-y", "-9999px");
    };

    const onMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".glass-card") ?? null;

      if (prev && prev !== card) reset(prev);

      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sg-x", `${e.clientX - r.left}px`);
        card.style.setProperty("--sg-y", `${e.clientY - r.top}px`);
      }

      prev = card;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (prev) reset(prev);
    };
  }, []);

  return null;
}
