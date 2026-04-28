"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTrigger entrance: alternate left / right / bottom by section index.
 */
export function useSectionReveal(index: number, enabled = true) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mode = index % 3;
    const from =
      mode === 0
        ? { x: -36, opacity: 0 }
        : mode === 1
          ? { x: 36, opacity: 0 }
          : { y: 28, opacity: 0 };

    let tween: gsap.core.Tween | null = null;
    try {
      gsap.set(el, { opacity: 1 });
      tween = gsap.from(el, {
        ...from,
        immediateRender: false,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          invalidateOnRefresh: true,
          toggleActions: "play none none none",
        },
      });
    } catch (cause) {
      console.warn("[useSectionReveal] GSAP setup failed:", cause);
    }

    return () => {
      if (tween) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, [index, enabled]);

  return ref as React.RefObject<HTMLElement>;
}
