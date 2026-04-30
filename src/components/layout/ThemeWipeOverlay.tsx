"use client";

import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const BG_DARK = "#0d1f1a";
const BG_LIGHT = "#e8f0ec";

/** Full-viewport clip-path wipe when theme toggles. */
export function ThemeWipeOverlay() {
  const { wipe, commitLight, clearWipe } = useTheme();
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wipe || !elRef.current) return;

    const el = elRef.current;
    const { toLight } = wipe;

    // Skip animation for users who prefer reduced motion — commit immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commitLight(toLight);
      clearWipe();
      return;
    }

    gsap.killTweensOf(el);
    gsap.set(el, {
      opacity: 1,
      pointerEvents: "none",
      backgroundColor: toLight ? BG_LIGHT : BG_DARK,
      clipPath: "inset(0 100% 0 0)",
      zIndex: 10007,
    });

    const tl = gsap.timeline();

    tl.to(el, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.5,
      ease: "power2.inOut",
    }).call(() => {
      commitLight(toLight);
    });

    tl.to(el, {
      opacity: 0,
      duration: 0.24,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(el, {
          clearProps: "clipPath,backgroundColor,zIndex",
          opacity: 0,
        });
        clearWipe();
      },
    });

    return () => {
      tl.kill();
    };
  }, [wipe, commitLight, clearWipe]);

  return (
    <div
      ref={elRef}
      className="pointer-events-none fixed inset-0 opacity-0"
      aria-hidden
    />
  );
}
