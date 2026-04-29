"use client";

import { useEffect, useMemo, useState } from "react";
import { getDeviceProfile } from "@/lib/device-profile";

export type MotionMode = "full" | "balanced" | "minimal";

export function useMotionProfile() {
  const [mode, setMode] = useState<MotionMode>("balanced");
  const [velocityHigh, setVelocityHigh] = useState(false);
  const [velocitySevere, setVelocitySevere] = useState(false);

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

  useEffect(() => {
    let prevY = window.scrollY;
    let prevT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - prevY);
      const dt = Math.max(1, now - prevT);
      const pxPerMs = dy / dt;
      setVelocityHigh(pxPerMs > 2.2);
      setVelocitySevere(pxPerMs > 3.4);
      prevY = window.scrollY;
      prevT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-velocity-high", velocityHigh);
    document.documentElement.classList.toggle("motion-velocity-severe", velocitySevere);
    return () => {
      document.documentElement.classList.remove("motion-velocity-high");
      document.documentElement.classList.remove("motion-velocity-severe");
    };
  }, [velocityHigh, velocitySevere]);

  return useMemo(
    () => ({
      mode,
      velocityHigh,
      velocitySevere,
      shouldReduce: mode === "minimal" || velocityHigh,
    }),
    [mode, velocityHigh, velocitySevere],
  );
}

