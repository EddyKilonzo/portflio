"use client";

import { BootSequence } from "@/components/boot/BootSequence";
import { HeroSection } from "@/components/hero/HeroSection";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
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
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { NowSection } from "@/components/sections/NowSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { DownloadCenterSection } from "@/components/sections/DownloadCenterSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { StorytellingSection } from "@/components/sections/StorytellingSection";
import {
  getDeviceProfile,
  shouldUseLenis,
} from "@/lib/device-profile";
import { LazySection } from "@/components/motion/LazySection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/context/ThemeContext";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastViewport } from "@/components/ui/ToastViewport";

const DevStats = dynamic(
  () => import("@/components/dev/DevStats").then((m) => m.DevStats),
  { ssr: false },
);
const CommandPalette = dynamic(
  () => import("@/components/layout/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false, loading: () => null },
);
const CustomCursor = dynamic(
  () => import("@/components/layout/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false, loading: () => null },
);
const ContextMenu = dynamic(
  () => import("@/components/layout/ContextMenu").then((m) => m.ContextMenu),
  { ssr: false, loading: () => null },
);
const ContextualStickyCta = dynamic(
  () => import("@/components/layout/ContextualStickyCta").then((m) => m.ContextualStickyCta),
  { ssr: false, loading: () => null },
);
const StickySectionRail = dynamic(
  () => import("@/components/layout/StickySectionRail").then((m) => m.StickySectionRail),
  { ssr: false, loading: () => null },
);
const ReadingProgressHud = dynamic(
  () => import("@/components/layout/ReadingProgressHud").then((m) => m.ReadingProgressHud),
  { ssr: false, loading: () => null },
);
const SectionPrefetchCues = dynamic(
  () => import("@/components/layout/SectionPrefetchCues").then((m) => m.SectionPrefetchCues),
  { ssr: false, loading: () => null },
);
const IdleAmbientLayer = dynamic(
  () => import("@/components/layout/IdleAmbientLayer").then((m) => m.IdleAmbientLayer),
  { ssr: false, loading: () => null },
);
const NarrativeChapters = dynamic(
  () => import("@/components/layout/NarrativeChapters").then((m) => m.NarrativeChapters),
  { ssr: false, loading: () => null },
);
const MobileQuickActions = dynamic(
  () => import("@/components/layout/MobileQuickActions").then((m) => m.MobileQuickActions),
  { ssr: false, loading: () => null },
);
const FirstTimeTour = dynamic(
  () => import("@/components/layout/FirstTimeTour").then((m) => m.FirstTimeTour),
  { ssr: false, loading: () => null },
);
const EasterTerminal = dynamic(
  () => import("@/components/easter/EasterTerminal").then((m) => m.EasterTerminal),
  { ssr: false, loading: () => null },
);
const Screensaver = dynamic(
  () => import("@/components/easter/Screensaver").then((m) => m.Screensaver),
  { ssr: false, loading: () => null },
);
const MotionQaOverlay = dynamic(
  () => import("@/components/dev/MotionQaOverlay").then((m) => m.MotionQaOverlay),
  { ssr: false, loading: () => null },
);

gsap.registerPlugin(ScrollTrigger);

export function PortfolioPage() {
  const reducedMotion = useReducedMotion();
  const { ambientFx, cursorAccent } = useTheme();
  const [bootDone, setBootDone] = useState(reducedMotion);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [enhancementsReady, setEnhancementsReady] = useState(false);
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
    if (!bootDone || enhancementsReady) return;
    let cancelled = false;
    const ready = () => {
      if (!cancelled) setEnhancementsReady(true);
    };
    const onFirstInteraction = () => {
      ready();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    const idleId = window.setTimeout(ready, 1800);
    return () => {
      cancelled = true;
      window.clearTimeout(idleId);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [bootDone, enhancementsReady]);

  useEffect(() => {
    if (!bootDone) return;
    // Recompute trigger positions once boot/hero layout has settled.
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      AOS.refresh();
    }, 150);
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
    window.scrollTo(0, 0);
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
        {ambientFx ? <WaveBackground lowEnd={lowEnd} /> : null}
        {ambientFx ? <IdleAmbientLayer /> : null}
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
        {enhancementsReady ? <MobileQuickActions /> : null}
        {enhancementsReady ? <ReadingProgressHud /> : null}
        {enhancementsReady ? <NarrativeChapters /> : null}
        {enhancementsReady ? <ContextualStickyCta /> : null}
        {enhancementsReady ? <StickySectionRail /> : null}
        {enhancementsReady ? <CommandPalette /> : null}
        {enhancementsReady && cursorAccent ? <CustomCursor /> : null}
        {enhancementsReady ? <ContextMenu /> : null}
        {enhancementsReady ? <SectionPrefetchCues /> : null}
        <ToastViewport />
        {enhancementsReady ? <MotionQaOverlay /> : null}
        {enhancementsReady ? <FirstTimeTour /> : null}
        {enhancementsReady ? <EasterTerminal /> : null}
        {enhancementsReady ? <Screensaver /> : null}

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
          <NowSection />
          <SectionDivider variant="wave" />
          <StorytellingSection />
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
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <DownloadCenterSection />
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <BookingSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <TrustSection />
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ContactSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <PublicationsSection />
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <TestimonialsSection />
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <FaqSection />
          </LazySection>
        </main>
      </div>
    </>
  );
}
