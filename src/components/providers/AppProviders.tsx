"use client";

import { ThemeWipeOverlay } from "@/components/layout/ThemeWipeOverlay";
import { PwaRegister } from "@/components/providers/PwaRegister";
import { RoleProvider } from "@/context/RoleContext";
import { SkillFilterProvider } from "@/context/SkillFilterContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  getDeviceProfile,
  shouldUseLenis,
} from "@/lib/device-profile";
import { motionTokens } from "@/lib/motion-tokens";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const scheduleAosRefresh = (delay = 120) => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = window.setTimeout(() => {
        AOS.refreshHard();
      }, delay);
    };

    // Keep AOS as lightweight fallback only.
    AOS.init({
      duration: 420,
      easing: "ease-out-quad",
      once: true,
      mirror: false,
      offset: 72,
      throttleDelay: 99,
      debounceDelay: 80,
    });
    scheduleAosRefresh(0);

    const profile = getDeviceProfile();
    if (!shouldUseLenis(profile)) {
      ScrollTrigger.refresh();
      scheduleAosRefresh(0);
      const onResize = () => scheduleAosRefresh(80);
      const onOrientation = () => scheduleAosRefresh(120);
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onOrientation);
      return () => {
        if (refreshTimerRef.current) {
          window.clearTimeout(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onOrientation);
      };
    }

    const tier = profile.isMobileWidth ? motionTokens.lenis.mobile : motionTokens.lenis.desktop;
    const root = document.documentElement.classList;
    const isMinimal = root.contains("motion-minimal") || root.contains("mode-reduced-motion");
    if (isMinimal) {
      ScrollTrigger.refresh();
      scheduleAosRefresh(0);
      return;
    }

    const lenis = new Lenis({
      duration: tier.duration,
      lerp: tier.lerp,
      smoothWheel: true,
      wheelMultiplier: tier.wheelMultiplier,
      touchMultiplier: tier.touchMultiplier,
      syncTouch: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const onResize = () => {
      scheduleAosRefresh(80);
    };
    const onOrientation = () => {
      scheduleAosRefresh(120);
    };
    const onLoad = () => {
      scheduleAosRefresh(80);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("load", onLoad);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ThemeProvider>
      <ThemeWipeOverlay />
      <PwaRegister />
      <RoleProvider>
        <SkillFilterProvider>{children}</SkillFilterProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
