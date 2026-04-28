"use client";

import { ThemeWipeOverlay } from "@/components/layout/ThemeWipeOverlay";
import { RoleProvider } from "@/context/RoleContext";
import { SkillFilterProvider } from "@/context/SkillFilterContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  getDeviceProfile,
  shouldUseLenis,
} from "@/lib/device-profile";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-out-quad",
      once: true,
      mirror: false,
    });

    const profile = getDeviceProfile();
    if (!shouldUseLenis(profile)) {
      ScrollTrigger.refresh();
      AOS.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.0,
      syncTouch: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      AOS.refresh();
    });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ThemeProvider>
      <ThemeWipeOverlay />
      <RoleProvider>
        <SkillFilterProvider>{children}</SkillFilterProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
