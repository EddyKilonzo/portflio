/**
 * Thin wrapper so all scroll callers use Lenis when available,
 * falling back to native smooth scroll.
 */
export function smoothScrollTo(y: number): void {
  if (typeof window === "undefined") return;
  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(Math.max(0, y));
  } else {
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }
}
