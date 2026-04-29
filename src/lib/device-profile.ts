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

/**
 * Allow smooth scrolling on capable mobile devices too.
 * Guardrails remain for reduced-motion users and low-core devices.
 */
export function shouldUseLenis(profile: DeviceProfile): boolean {
  if (profile.prefersReducedMotion) return false;
  if (profile.lowEnd) return false;
  if (profile.isMobileWidth && profile.cores < 6) return false;
  return true;
}
