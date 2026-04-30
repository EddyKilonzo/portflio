"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** CSS selector for the direct children to stagger. Default: "> *" */
  selector?: string;
  /** Stagger seconds between each child. Default: 0.09 */
  stagger?: number;
  /** Duration per item in seconds. Default: 0.65 */
  duration?: number;
  /** Distance to slide from. Default: 28 */
  distance?: number;
  /** Slide direction. Default: "up" */
  from?: "up" | "down" | "left" | "right";
  /** When to start. Default: "top 87%" */
  start?: string;
};

export function StaggerReveal({
  children,
  className = "",
  selector = "> *",
  stagger = 0.09,
  duration = 0.65,
  distance = 28,
  from = "up",
  start = "top 87%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const normalizedSelector = selector.trim().startsWith(">")
      ? `:scope ${selector.trim()}`
      : selector;
    let items: NodeListOf<HTMLElement>;
    try {
      items = container.querySelectorAll<HTMLElement>(normalizedSelector);
    } catch {
      // Fallback for invalid selectors: reveal direct children only.
      items = container.querySelectorAll<HTMLElement>(":scope > *");
    }
    if (!items.length) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: from === "up" ? distance : from === "down" ? -distance : 0,
      x: from === "left" ? distance : from === "right" ? -distance : 0,
    };

    gsap.set(items, fromVars);

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      ease: "power3.out",
      stagger,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: container,
        start,
        invalidateOnRefresh: true,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(items, { clearProps: "all" });
    };
  }, [selector, stagger, duration, distance, from, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
