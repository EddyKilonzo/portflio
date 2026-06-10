"use client";

import { useEffect, useMemo, useState } from "react";
import { getDeviceProfile } from "@/lib/device-profile";

export type MotionMode = "full" | "balanced" | "minimal";

/**
 * Scroll-velocity tracking was removed (2026-06): it toggled
 * `motion-velocity-*` classes on <html> during scroll, and every toggle
 * invalidated style for the whole document — full-page style recalc and
 * repaint storms that made scrolling feel staggered. The only effect those
 * classes had left was dimming the ambient wave canvas, which is not worth
 * the cost.
 */
export function useMotionProfile() {
  const [mode, setMode] = useState<MotionMode>("balanced");

  useEffect(() => {
    const profile = getDeviceProfile();
    const root = document.documentElement.classList;
    const inferred: MotionMode = root.contains("motion-minimal")
      ? "minimal"
      : root.contains("motion-full")
        ? "full"
        : "balanced";
    if (profile.prefersReducedMotion || profile.lowEnd) {
      setMode("minimal");
    } else {
      setMode(inferred);
    }
  }, []);

  return useMemo(
    () => ({
      mode,
      velocityHigh: false,
      velocitySevere: false,
      shouldReduce: mode === "minimal",
    }),
    [mode],
  );
}
