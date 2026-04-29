export const motionTokens = {
  duration: {
    fast: 0.18,
    base: 0.28,
    slow: 0.45,
  },
  ease: {
    standard: "power2.out",
    emphatic: "power3.out",
    exit: "power2.in",
  },
  stagger: {
    section: 0.08,
    list: 0.06,
  },
  lenis: {
    desktop: { duration: 1.15, lerp: 0.075, wheelMultiplier: 0.85, touchMultiplier: 1.0 },
    mobile: { duration: 0.9, lerp: 0.11, wheelMultiplier: 0.78, touchMultiplier: 0.9 },
  },
  parallax: {
    hero: {
      bg: 8,
      shell: 14,
      left: 20,
      right: 26,
      photo: 34,
    },
    projects: {
      cardBase: 16,
      cardAlt: 26,
    },
    story: {
      beat1: 12,
      beat2: 20,
      beat3: 28,
    },
  },
} as const;

export function getParallaxScaleForWidth(width: number) {
  if (width <= 360) return 0.34;
  if (width <= 390) return 0.4;
  if (width <= 430) return 0.46;
  if (width <= 768) return 0.62;
  if (width <= 1024) return 0.82;
  return 1;
}

export function getParallaxScrubForWidth(width: number) {
  if (width <= 390) return 0.95;
  if (width <= 430) return 0.88;
  if (width <= 768) return 0.82;
  if (width <= 1024) return 0.78;
  return 0.72;
}

