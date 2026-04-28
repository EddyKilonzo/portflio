import type { DeviceProfile } from "@/lib/device-profile";
import { getDeviceProfile } from "@/lib/device-profile";

/**
 * Scroll-linked parallax layers and subtle pointer nudges.
 * Off when the user requests reduced motion or on low-core devices.
 */
export function allowParallaxPointerEffects(profile?: DeviceProfile): boolean {
  const p = profile ?? getDeviceProfile();
  return !p.prefersReducedMotion && !p.lowEnd;
}

/**
 * Continuous WebGL animation (particles, shader time, idle rotation).
 * When false, scenes should render a mostly static frame (scroll-driven camera only).
 */
export function allowContinuousWebGL(profile?: DeviceProfile): boolean {
  const p = profile ?? getDeviceProfile();
  return !p.prefersReducedMotion && !p.lowEnd;
}
