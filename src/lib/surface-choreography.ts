"use client";

import gsap from "gsap";
import { motionTokens } from "@/lib/motion-tokens";

export function playSurfaceEnter(
  panel: HTMLElement | null,
  backdrop?: HTMLElement | null,
  itemSelector = "[data-surface-item]",
) {
  if (!panel) return;

  const run = () => {
    // Query items inside RAF so any async/lazy-rendered children have a frame
    // to appear in the DOM before we measure them.
    const items = Array.from(panel.querySelectorAll<HTMLElement>(itemSelector));
    const tl = gsap.timeline();

    if (backdrop) {
      backdrop.style.willChange = "opacity";
      tl.fromTo(
        backdrop,
        { opacity: 0 },
        {
          opacity: 1,
          duration: motionTokens.duration.fast,
          ease: "none",
          onComplete: () => {
            backdrop.style.willChange = "auto";
          },
        },
      );
    }

    panel.style.willChange = "transform, opacity";
    tl.fromTo(
      panel,
      { opacity: 0, y: 18, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.standard,
        onComplete: () => {
          panel.style.willChange = "auto";
        },
      },
      backdrop ? "-=0.08" : 0,
    );

    if (items.length) {
      tl.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: motionTokens.duration.base,
          ease: motionTokens.ease.standard,
          stagger: 0.05,
        },
        "-=0.18",
      );
    }
  };

  requestAnimationFrame(run);
}

