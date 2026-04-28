"use client";

import { allowParallaxPointerEffects } from "@/lib/motion-gates";
import { animate } from "animejs";
import { useCallback, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Light scale bloom on hover via anime.js — avoids GSAP ScrollTrigger targets.
 * No-op when reduced motion / low-end (same gate as parallax).
 */
export function AnimeHoverBloom({ children, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  const onEnter = useCallback(() => {
    if (!allowParallaxPointerEffects() || !root.current) return;
    try {
      animate(root.current, {
        scale: [1, 1.012],
        duration: 420,
        ease: "out(3)",
      });
    } catch {
      /* ignore */
    }
  }, []);

  const onLeave = useCallback(() => {
    if (!root.current) return;
    try {
      animate(root.current, {
        scale: 1,
        duration: 380,
        ease: "out(3)",
      });
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      ref={root}
      className={`origin-center will-change-transform ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
