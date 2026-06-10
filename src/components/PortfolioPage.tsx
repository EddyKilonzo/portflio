"use client";

import { BootSequence } from "@/components/boot/BootSequence";
import { HeroSection } from "@/components/hero/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
// WaveBackground is dynamically imported (ssr:false) to prevent hydration mismatch
// caused by ambientFx reading localStorage on client vs default true on server.
import { SectionDivider } from "@/components/sections/SectionDivider";
import { getDeviceProfile } from "@/lib/device-profile";
import { LazySection } from "@/components/motion/LazySection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/context/ThemeContext";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { StickySectionRail } from "@/components/layout/StickySectionRail";
import { NarrativeChapters } from "@/components/layout/NarrativeChapters";
import { CardSpotlight } from "@/components/ui/CardSpotlight";

const WaveBackground = dynamic(
  () => import("@/components/layout/WaveBackground").then((m) => m.WaveBackground),
  { ssr: false, loading: () => null },
);

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
const EducationSection = dynamic(
  () => import("@/components/sections/EducationSection").then((m) => m.EducationSection),
  { ssr: false }
);
const BadgesSection = dynamic(
  () => import("@/components/sections/BadgesSection").then((m) => m.BadgesSection),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection").then((m) => m.ExperienceSection),
  { ssr: false }
);
const BlogSection = dynamic(
  () => import("@/components/sections/BlogSection").then((m) => m.BlogSection),
  { ssr: false }
);
const CVSection = dynamic(
  () => import("@/components/sections/CVSection").then((m) => m.CVSection),
  { ssr: false }
);
const BookingSection = dynamic(
  () => import("@/components/sections/BookingSection").then((m) => m.BookingSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then((m) => m.ContactSection),
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
  const [bootDone, setBootDone] = useState(false);
  // Captured at mount (before any effects) — true if the user has visited before.
  // Used to skip stale-hash auto-scroll on return visits.
  const isReturnVisitRef = useRef(false);
  // Skip boot animation synchronously before first paint on return visits
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio-booted") === "1") {
        isReturnVisitRef.current = true;
        setBootDone(true);
        // Keep any hash intact so back-button navigation (e.g. /?module=cybersec#projects)
        // correctly scrolls the user to the right section on return visits.
      }
    } catch {}
  }, []);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [enhancementsReady, setEnhancementsReady] = useState(false);
  const [lowEnd, setLowEnd] = useState(false);
  const heroScrollRef = useRef(0);
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  const onFirstScroll = useCallback(() => setHasScrolled(true), []);

  // Sync client-only values after hydration to avoid server/client mismatch
  useEffect(() => {
    setLowEnd(getDeviceProfile().lowEnd);
    if (reducedMotion || sessionStorage.getItem("portfolio-booted") === "1") {
      setBootDone(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bootDone) return;
    
    // Initialize AOS after the boot sequence completes.
    // Simple fades: short duration, plain easing, tiny offset so elements
    // appear as soon as they enter the viewport. once:false (without mirror)
    // re-arms elements that drop below the viewport, so the fade replays on
    // every approach — not only on a fresh page load.
    AOS.init({
      duration: 450,
      easing: "ease-out",
      once: false,
      offset: 24,
      anchorPlacement: "top-bottom",
    });

    // Initial refresh after sections mount
    const id1 = window.setTimeout(() => { ScrollTrigger.refresh(); AOS.refresh(); }, 400);
    // Second pass for lazy-loaded sections
    const id2 = window.setTimeout(() => { AOS.refresh(); }, 1200);

    // When a LazySection swaps its skeleton for real content, AOS must
    // recalculate element positions or the new elements stay invisible.
    const onLazySwap = () => { AOS.refresh(); };
    window.addEventListener("lazysection:swap", onLazySwap);

    // Re-trigger AOS on first scroll for any lazily-revealed elements
    let refreshed = false;
    const onScroll = () => {
      if (refreshed) return;
      refreshed = true;
      AOS.refresh();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(id1);
      window.clearTimeout(id2);
      window.removeEventListener("lazysection:swap", onLazySwap);
      window.removeEventListener("scroll", onScroll);
    };
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

    // After a fresh boot animation, ALWAYS land on the hero: clear any stale
    // hash and disable the browser's scroll restoration, which would otherwise
    // jump back to the pre-reload scroll position once content mounts.
    if (!isReturnVisitRef.current) {
      try { history.scrollRestoration = "manual"; } catch {}
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    // Return visits (boot skipped): honor the hash so back-button navigation
    // like /?module=cybersec#projects lands on the right section.
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(hash);
        if (el) {
          // Small offset so the nav doesn't overlap the section heading
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        } else if (attempts < 16) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      setTimeout(() => tryScroll(), 80);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [bootDone]);

  return (
    <>
      {/* DevStats removed to eliminate redundant GPU monitor */}
      {!bootDone ? (
        <BootSequence
          reducedMotion={reducedMotion}
          onDone={() => { try { sessionStorage.setItem("portfolio-booted", "1"); } catch {} setBootDone(true); }}
        />
      ) : null}

      <div className="page-fx theme-wipe min-h-screen bg-bg">
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

        {/* Gradient mesh — static colour blobs for depth (skipped on low-end GPUs).
            Must stay STATIC: anything animating under the glass-cards' backdrop-filter
            forces every visible card to re-blur its backdrop each frame. */}
        {!lowEnd && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              top: "-12%", left: "3%",
              width: 680, height: 680,
              background: "radial-gradient(circle, var(--accent), transparent 70%)",
              opacity: 0.06,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "38%", right: "-8%",
              width: 560, height: 560,
              background: "radial-gradient(circle, var(--cyber), transparent 70%)",
              opacity: 0.045,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "8%", left: "28%",
              width: 500, height: 500,
              background: "radial-gradient(circle, var(--eng), transparent 70%)",
              opacity: 0.05,
            }}
          />
        </div>
        )}

        <SkipLink />
        <ScrollProgress />
        <Nav />
        {enhancementsReady ? <MobileQuickActions /> : null}
        {enhancementsReady ? <CommandPalette /> : null}
        {enhancementsReady && cursorAccent ? <CustomCursor /> : null}
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
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Education"><EducationSection /></ErrorBoundary>
          </LazySection>
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
          <LazySection skeletonCards={3}>
            <ErrorBoundary label="Badges"><BadgesSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={3}>
            <ErrorBoundary label="Blog"><BlogSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="CV"><CVSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider />
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Booking"><BookingSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="FAQ"><FaqSection /></ErrorBoundary>
          </LazySection>
          <SectionDivider variant="wave" />
          <LazySection skeletonCards={2}>
            <ErrorBoundary label="Contact"><ContactSection /></ErrorBoundary>
          </LazySection>
        </main>
        <Footer />
      </div>
    </>
  );
}
