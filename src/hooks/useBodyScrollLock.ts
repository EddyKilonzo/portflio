"use client";

import { useEffect } from "react";

/**
 * Locks background scroll while `locked` is true. Uses the position:fixed +
 * negative-top technique so it also works on iOS Safari (where overflow:hidden
 * alone does not stop touch scrolling behind a fixed overlay). The scroll
 * position is captured on lock and restored on release.
 *
 * Smooth scroll-behavior is forced to `auto` during the lock so restoring the
 * position is instant rather than an animated jump.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const lenis = (window as any).__lenis;

    // Pause Lenis so its RAF loop doesn't fight the position:fixed trick.
    // While the body is fixed, window.scrollY returns 0 and Lenis would
    // update its internal target to 0 — causing it to animate back to the
    // top when the modal closes.
    if (lenis) lenis.stop();

    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      scrollBehavior: documentElement.style.scrollBehavior,
    };
    documentElement.style.scrollBehavior = "auto";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      documentElement.style.scrollBehavior = prev.scrollBehavior;
      // Restore native scroll position before Lenis resumes.
      window.scrollTo(0, scrollY);
      if (lenis) {
        // Defer lenis.start() by one rAF so the browser has a full frame
        // to commit window.scrollTo before Lenis's ticker reads scrollY.
        // Without this, Lenis reads 0 (from the fixed-body frame) and
        // snaps back to the top of the page.
        requestAnimationFrame(() => {
          lenis.scrollTo(scrollY, { immediate: true });
          lenis.start();
        });
      }
    };
  }, [locked]);
}
