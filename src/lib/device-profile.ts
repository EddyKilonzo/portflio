export type DeviceProfile = {
  lowEnd: boolean;
  cores: number;
  prefersReducedMotion: boolean;
  isMobileWidth: boolean;
};

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return {
      lowEnd: false,
      cores: 8,
      prefersReducedMotion: false,
      isMobileWidth: false,
    };
  }
  const cores = navigator.hardwareConcurrency ?? 8;
  const mq = window.matchMedia("(max-width: 768px)");
  return {
    lowEnd: cores < 4,
    cores,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    isMobileWidth: mq.matches,
  };
}

/** Lenis off for low core count, reduced motion, or narrow mobile layout (per spec). */
export function shouldUseLenis(profile: DeviceProfile): boolean {
  return (
    !profile.lowEnd &&
    !profile.prefersReducedMotion &&
    !profile.isMobileWidth
  );
}
