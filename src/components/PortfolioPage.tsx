"use client";

import { BootSequence } from "@/components/boot/BootSequence";
import { EasterTerminal } from "@/components/easter/EasterTerminal";
import { Screensaver } from "@/components/easter/Screensaver";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContextMenu } from "@/components/layout/ContextMenu";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
import { StickySectionRail } from "@/components/layout/StickySectionRail";
import { WaveBackground } from "@/components/layout/WaveBackground";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { BadgesSection } from "@/components/sections/BadgesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CyberShowcaseSection } from "@/components/sections/CyberShowcaseSection";
import { CVSection } from "@/components/sections/CVSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { IntegrationsSection } from "@/components/sections/IntegrationsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ReportViewerSection } from "@/components/sections/ReportViewerSection";
import { RoleSwitcherSection } from "@/components/sections/RoleSwitcherSection";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { SkillsSection } from "@/components/sections/SkillsSection";
import {
  getDeviceProfile,
  shouldUseLenis,
} from "@/lib/device-profile";
import { LazySection } from "@/components/motion/LazySection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const DevStats = dynamic(
  () => import("@/components/dev/DevStats").then((m) => m.DevStats),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

export function PortfolioPage() {
  const reducedMotion = useReducedMotion();
  const [bootDone, setBootDone] = useState(reducedMotion);
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroScrollRef = useRef(0);
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  const onFirstScroll = useCallback(() => setHasScrolled(true), []);

  const lowEnd =
    typeof window !== "undefined" ? getDeviceProfile().lowEnd : false;

  useEffect(() => {
    if (!bootDone) return;
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.lowEnd || p.isMobileWidth) return;

    const l1 = layer1.current;
    const l2 = layer2.current;
    const l3 = layer3.current;
    if (!l1 || !l2 || !l3) return;

    const setY1 = gsap.quickSetter(l1, "yPercent");
    const setY2 = gsap.quickSetter(l2, "yPercent");
    const setY3 = gsap.quickSetter(l3, "yPercent");

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: 1.2,
      onUpdate: (self) => {
        const t = self.progress;
        setY1(-18 * t);
        setY2(-9 * t);
        setY3(-4 * t);
      },
    });
    return () => st.kill();
  }, [bootDone]);

  useEffect(() => {
    if (!bootDone) return;
    // Recompute trigger positions once boot/hero layout has settled.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [bootDone]);

  useEffect(() => {
    if (!bootDone) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        heroScrollRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [bootDone]);

  useEffect(() => {
    if (!bootDone) return;
    // Always land users at the hero/top after the boot loader completes.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (window.location.hash && window.location.hash !== "#hero") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#hero`);
    } else if (!window.location.hash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#hero`);
    }
  }, [bootDone]);

  return (
    <>
      <DevStats />
      {!bootDone ? (
        <BootSequence
          reducedMotion={reducedMotion}
          onDone={() => setBootDone(true)}
        />
      ) : null}

      <div
        className={`page-fx theme-wipe min-h-screen bg-bg ${shouldUseLenis(getDeviceProfile()) ? "" : ""}`}
      >
        <WaveBackground lowEnd={lowEnd} />
        <div
          ref={layer1}
          className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(46,122,90,0.03),_transparent_60%)]" />
        </div>
        <div
          ref={layer2}
          className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
          aria-hidden
        >
          <div className="absolute inset-0 bg-hex-grid opacity-[0.09]" />
        </div>
        <div
          ref={layer3}
          className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,_rgba(76,158,255,0.02),_transparent_52%)]" />
        </div>

        <SkipLink />
        <ScrollProgress />
        <Nav />
        <StickySectionRail />
        <CommandPalette />
        <CustomCursor />
        <ContextMenu />
        <EasterTerminal />
        <Screensaver />

        <main id="main-content" className="pt-14">
          <HeroSection
            scrollProgressRef={heroScrollRef}
            lowEnd={lowEnd}
            reducedMotion={reducedMotion}
            isActive={bootDone}
            onFirstScroll={onFirstScroll}
            hasScrolled={hasScrolled}
          />
          <SectionDivider />
          <AboutSection />
          <SectionDivider variant="wave" />
          <RoleSwitcherSection />
          <SectionDivider variant="wave" />
          <SkillsSection />
          <SectionDivider />
          <ProjectsSection />
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <CyberShowcaseSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ReportViewerSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <EducationSection />
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={3}>
            <BadgesSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={3}>
            <CertificationsSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ExperienceSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={3}>
            <IntegrationsSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <CVSection />
          </LazySection>
          <SectionDivider variant="wave" />
          <ContactSection />
        </main>
      </div>
    </>
  );
}
