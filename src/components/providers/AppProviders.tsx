"use client";

import { ThemeWipeOverlay } from "@/components/layout/ThemeWipeOverlay";
import { PwaRegister } from "@/components/providers/PwaRegister";
import { RoleProvider } from "@/context/RoleContext";
import { SkillFilterProvider } from "@/context/SkillFilterContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  getDeviceProfile,
} from "@/lib/device-profile";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const scheduleAosRefresh = (delay = 120) => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
      }
      refreshTimerRef.current = window.setTimeout(() => {
        // Use refresh() instead of refreshHard() to avoid full layout trashing
        AOS.refresh();
      }, delay);
    };

    // AOS is initialized in PortfolioPage after the boot sequence
    // to prevent hidden elements from triggering animations prematurely.
    // scheduleAosRefresh(0);

    const onLazySwap = () => {
      window.setTimeout(() => {
        scheduleAosRefresh(60);
        ScrollTrigger.refresh();
      }, 30);
    };
    window.addEventListener("lazysection:swap", onLazySwap);

    const onResize = () => {
      scheduleAosRefresh(80);
      ScrollTrigger.refresh();
    };
    const onOrientation = () => {
      scheduleAosRefresh(120);
      ScrollTrigger.refresh();
    };
    const onLoad = () => {
      scheduleAosRefresh(80);
      ScrollTrigger.refresh();
    };
    
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("load", onLoad);

    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("lazysection:swap", onLazySwap);
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
