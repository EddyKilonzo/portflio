"use client";

import { allowParallaxPointerEffects } from "@/lib/motion-gates";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel (px) from section enter → exit; higher = faster drift. */
  speed?: number;
  /** 0 = off. Multiplies subtle pointer follow while cursor moves over the section. */
  pointerNudge?: number;
};

/**
 * Scroll-scrubbed translate inside the nearest parent `<section>`, optional pointer bias.
 * Skips all motion when `allowParallaxPointerEffects()` is false.
 */
export function ParallaxDrift({
  children,
  className = "",
  speed = 1,
  pointerNudge = 0,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !allowParallaxPointerEffects()) return;

    const section = el.closest("section");
    if (!section) return;

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");

    let scrollShift = 0;
    let ptrX = 0;
    let ptrY = 0;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        scrollShift = (self.progress - 0.5) * 80 * speed;
        setX(ptrX);
        setY(scrollShift + ptrY);
      },
    });

    const onPtr = (e: PointerEvent) => {
      if (pointerNudge <= 0) return;
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      const ny = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      ptrX = nx * 16 * pointerNudge * speed;
      ptrY = ny * 10 * pointerNudge * speed;
    };

    if (pointerNudge > 0) {
      section.addEventListener("pointermove", onPtr, { passive: true });
    }

    return () => {
      section.removeEventListener("pointermove", onPtr);
      st.kill();
      gsap.set(el, { clearProps: "x,y" });
    };
  }, [speed, pointerNudge]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
