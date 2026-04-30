"use client";

import { useEffect, useRef } from "react";

/**
 * Simplified to just a ref. 
 * Entrance animations are now handled uniformly by AOS (data-aos="fade-up")
 * in the components themselves to prevent GSAP/AOS conflicts.
 */
export function useSectionReveal(index: number, enabled = true) {
  const ref = useRef<HTMLElement | null>(null);
  return ref as React.RefObject<HTMLElement>;
}
