import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type GsapBundle = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
};

let registered = false;

/**
 * Returns gsap + ScrollTrigger with the plugin registered exactly once.
 *
 * Uses static imports on purpose: Turbopack's async loader mishandles
 * `import("gsap/ScrollTrigger")` (resolves the ESM file through
 * commonJsRequire and throws "module factory is not available"), so the
 * dynamic-import path must be avoided. Kept async so call sites that
 * `.then()` the result keep working unchanged.
 */
export function loadGsap(): Promise<GsapBundle> {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return Promise.resolve({ gsap, ScrollTrigger });
}
