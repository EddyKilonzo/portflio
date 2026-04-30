"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "fade";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Animation direction. Default: "up" */
  from?: Direction;
  /** Delay in seconds before the animation starts. Default: 0 */
  delay?: number;
  /** Duration in seconds. Default: 0.7 */
  duration?: number;
  /** Scroll position that triggers. Default: "top 87%" */
  start?: string;
  /** Distance offset in px. Default: 32 */
  distance?: number;
};

const directionMap: Record<Direction, gsap.TweenVars> = {
  up:    { y: 32,   opacity: 0 },
  down:  { y: -32,  opacity: 0 },
  left:  { x: 40,   opacity: 0 },
  right: { x: -40,  opacity: 0 },
  fade:  { opacity: 0 },
};

export function ScrollReveal({
  children,
  className = "",
  from = "up",
  delay = 0,
  duration = 0.7,
  start = "top 87%",
  distance,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fromVars = { ...directionMap[from] };

    // override distance if provided
    if (distance !== undefined) {
      if ("y" in fromVars) fromVars.y = from === "down" ? -distance : distance;
      if ("x" in fromVars) fromVars.x = from === "right" ? -distance : distance;
    }

    gsap.set(el, fromVars);

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: el,
        start,
        invalidateOnRefresh: true,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [from, delay, duration, start, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
