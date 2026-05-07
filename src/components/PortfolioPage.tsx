"use client";

import { BootSequence } from "@/components/boot/BootSequence";
import { HeroSection } from "@/components/hero/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
import { WaveBackground } from "@/components/layout/WaveBackground";
import { SectionDivider } from "@/components/sections/SectionDivider";
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
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { StickySectionRail } from "@/components/layout/StickySectionRail";
import { NarrativeChapters } from "@/components/layout/NarrativeChapters";
import { CardSpotlight } from "@/components/ui/CardSpotlight";

// --- Dynamic Imports for Sections ---

const NowSection = dynamic(
  () => import("@/components/sections/NowSection").then((m) => m.NowSection),
  { ssr: false }
);
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection").then((m) => m.AboutSection),
  { ssr: false }
);
const RoleSwitcherSection = dynamic(
  () => import("@/components/sections/RoleSwitcherSection").then((m) => m.RoleSwitcherSection),
  { ssr: false }
);
const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection").then((m) => m.SkillsSection),
  { ssr: false }
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then((m) => m.ProjectsSection),
  { ssr: false }
);
const CyberShowcaseSection = dynamic(
  () => import("@/components/sections/CyberShowcaseSection").then((m) => m.CyberShowcaseSection),
  { ssr: false }
);
const ReportViewerSection = dynamic(
  () => import("@/components/sections/ReportViewerSection").then((m) => m.ReportViewerSection),
  { ssr: false }
);
const EducationSection = dynamic(
  () => import("@/components/sections/EducationSection").then((m) => m.EducationSection),
  { ssr: false }
);
const BadgesSection = dynamic(
  () => import("@/components/sections/BadgesSection").then((m) => m.BadgesSection),
  { ssr: false }
);
const CertificationsSection = dynamic(
  () => import("@/components/sections/CertificationsSection").then((m) => m.CertificationsSection),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection").then((m) => m.ExperienceSection),
  { ssr: false }
);
const IntegrationsSection = dynamic(
  () => import("@/components/sections/IntegrationsSection").then((m) => m.IntegrationsSection),
  { ssr: false }
);
const CVSection = dynamic(
  () => import("@/components/sections/CVSection").then((m) => m.CVSection),
  { ssr: false }
);
const DownloadCenterSection = dynamic(
  () => import("@/components/sections/DownloadCenterSection").then((m) => m.DownloadCenterSection),
  { ssr: false }
);
const BookingSection = dynamic(
  () => import("@/components/sections/BookingSection").then((m) => m.BookingSection),
  { ssr: false }
);
const TrustSection = dynamic(
  () => import("@/components/sections/TrustSection").then((m) => m.TrustSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then((m) => m.ContactSection),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import("@/components/sections/TestimonialsSection").then((m) => m.TestimonialsSection),
  { ssr: false }
);
const FaqSection = dynamic(
  () => import("@/components/sections/FaqSection").then((m) => m.FaqSection),
  { ssr: false }
);

// --- Dynamic Imports for UI/Layout Enhancements ---

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
const SectionPrefetchCues = dynamic(
  () => import("@/components/layout/SectionPrefetchCues").then((m) => m.SectionPrefetchCues),
  { ssr: false, loading: () => null },
);
const IdleAmbientLayer = dynamic(
  () => import("@/components/layout/IdleAmbientLayer").then((m) => m.IdleAmbientLayer),
  { ssr: false, loading: () => null },
);
const MobileQuickActions = dynamic(
  () => import("@/components/layout/MobileQuickActions").then((m) => m.MobileQuickActions),
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
    
    // Initialize AOS after the boot sequence completes
    AOS.init({
      duration: 860,
      easing: "ease-out-quart",
      once: false,
      offset: 120,
      mirror: true,
      anchorPlacement: "top-bottom",
    });

    // Refresh AOS and ScrollTrigger once the boot sequence is finished
    // and the main content is rendered.
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      AOS.refresh();
    }, 150);
    return () => window.clearTimeout(id);
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
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.lowEnd || p.isMobileWidth) return;

    const l1 = layer1.current;
    const l2 = layer2.current;
    const l3 = layer3.current;
    if (!l1 || !l2 || !l3) return;

    // Use a direct scrub: true for a more responsive native-scroll feel
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => {
        const t = self.progress;
        gsap.set(l1, { yPercent: -18 * t });
        gsap.set(l2, { yPercent: -9 * t });
        gsap.set(l3, { yPercent: -4 * t });
      },
    });
    return () => st.kill();
  }, [bootDone]);

  // Removed internal hero scroll tracking to fix potential state-update glitching during scroll.

  useEffect(() => {
    if (!bootDone) return;
    // Land users at top after boot without hash mutation jumps.
    window.scrollTo(0, 0);
  }, [bootDone]);

  return (
    <>
      {/* DevStats removed to eliminate redundant GPU monitor */}
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
        {enhancementsReady ? <CommandPalette /> : null}
        {enhancementsReady && cursorAccent ? <CustomCursor /> : null}
        {enhancementsReady ? <ContextMenu /> : null}
        {enhancementsReady ? <SectionPrefetchCues /> : null}
        <ToastViewport />
        {enhancementsReady ? <MotionQaOverlay /> : null}
        {enhancementsReady ? <EasterTerminal /> : null}
        {enhancementsReady ? <Screensaver /> : null}
        {bootDone ? <StickySectionRail /> : null}
        {bootDone ? <NarrativeChapters /> : null}
        {bootDone ? <CardSpotlight /> : null}

        <main id="main-content" className="pt-14">
          <ErrorBoundary label="Hero">
          <HeroSection
            scrollProgressRef={heroScrollRef}
            lowEnd={lowEnd}
            reducedMotion={reducedMotion}
            isActive={bootDone}
            onFirstScroll={onFirstScroll}
            hasScrolled={hasScrolled}
          />
          </ErrorBoundary>
          <SectionDivider />
          <ErrorBoundary label="About"><AboutSection /></ErrorBoundary>
          <SectionDivider variant="wave" />
          <ErrorBoundary label="Now"><NowSection /></ErrorBoundary>
          <SectionDivider variant="wave" />
          <ErrorBoundary label="Roles"><RoleSwitcherSection /></ErrorBoundary>
          <SectionDivider variant="wave" />
          <ErrorBoundary label="Skills"><SkillsSection /></ErrorBoundary>
          <SectionDivider />
          <ErrorBoundary label="Projects"><ProjectsSection /></ErrorBoundary>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Experience"><ExperienceSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Cyber"><CyberShowcaseSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Reports"><ReportViewerSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Education"><EducationSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={3}>
            <ErrorBoundary label="Badges"><BadgesSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={3}>
            <ErrorBoundary label="Certs"><CertificationsSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={3}>
            <ErrorBoundary label="Integrations"><IntegrationsSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="CV"><CVSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Downloads"><DownloadCenterSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Booking"><BookingSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Trust"><TrustSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Contact"><ContactSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Testimonials"><TestimonialsSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="FAQ"><FaqSection /></ErrorBoundary>
          </LazySection>
        </main>
        <Footer />
      </div>
    </>
  );
}
