"use client";

import { profile } from "@/content/portfolio";
import { scrambleText } from "@/lib/scramble";
import { useTheme } from "@/context/ThemeContext";
import { animate, stagger } from "animejs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AppModal } from "@/components/ui/AppModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getParallaxScaleForWidth,
  getParallaxScrubForWidth,
  motionTokens,
} from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);
const INTRO_LINE =
  "I build secure, scalable digital experiences across cyber, software, and web.";

type Props = {
  scrollProgressRef: React.MutableRefObject<number>;
  lowEnd: boolean;
  reducedMotion: boolean;
  isActive: boolean;
  onFirstScroll: () => void;
  hasScrolled: boolean;
};

/** Typewriter component — types name char by char, then blinks the cursor. */
function TypedName({
  name,
  reducedMotion,
  start,
  onDone,
}: {
  name: string;
  reducedMotion: boolean;
  start: boolean;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState(reducedMotion ? name : "");
  const [cursorVisible, setCursorVisible] = useState(!reducedMotion);
  const [typing, setTyping] = useState(!reducedMotion);

  useEffect(() => {
    if (!start) {
      setDisplayed("");
      setCursorVisible(false);
      setTyping(false);
      return;
    }
    if (reducedMotion) {
      setDisplayed(name);
      setCursorVisible(false);
      setTyping(false);
      onDone?.();
      return;
    }
    setDisplayed("");
    setCursorVisible(true);
    setTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(name.slice(0, i));
      if (i >= name.length) {
        clearInterval(timer);
        setTyping(false);
        onDone?.();
      }
    }, 112);
    return () => clearInterval(timer);
  }, [name, reducedMotion, onDone, start]);

  // After typing finishes, blink; during typing keep cursor solid
  useEffect(() => {
    if (typing) return;
    const id = setInterval(() => setCursorVisible((c) => !c), 530);
    return () => clearInterval(id);
  }, [typing]);

  return (
    <span>
      {displayed}
      <span
        className={`ml-[0.06em] inline-block h-[0.82em] w-[0.07em] translate-y-[0.06em] rounded-[2px] bg-current align-middle transition-opacity duration-100 ${
          cursorVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </span>
  );
}

export function HeroSection({
  scrollProgressRef,
  lowEnd,
  reducedMotion,
  isActive,
  onFirstScroll,
  hasScrolled,
}: Props) {
  const { light } = useTheme();
  const [sub, setSub] = useState("");
  const [introLineText, setIntroLineText] = useState(reducedMotion ? INTRO_LINE : "");
  const [firstLineDone, setFirstLineDone] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [heroLanded, setHeroLanded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const photoImgWrapRef = useRef<HTMLDivElement>(null);
  const photoOverlayRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const introLineRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      setHeroLanded(false);
      return;
    }
    if (reducedMotion) {
      setHeroLanded(true);
      return;
    }
    const shell = shellRef.current;
    if (!shell) return;
    const fallback = window.setTimeout(() => setHeroLanded(true), 650);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHeroLanded(true);
        window.clearTimeout(fallback);
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(shell);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [isActive, reducedMotion]);

  useEffect(() => {
    if (!isActive) {
      setSceneReady(false);
      return;
    }
    if (reducedMotion || lowEnd) {
      setSceneReady(false);
      return;
    }
    const id = window.setTimeout(() => setSceneReady(true), 500);
    return () => window.clearTimeout(id);
  }, [isActive, reducedMotion, lowEnd]);

  useEffect(() => {
    if (!isActive) {
      setFirstLineDone(false);
      setSub("");
      setIntroLineText(reducedMotion ? INTRO_LINE : "");
      return;
    }
    if (reducedMotion) {
      setFirstLineDone(true);
      setSub(profile.headlineScramble);
      setIntroLineText(INTRO_LINE);
    }
  }, [isActive, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setIntroLineText(INTRO_LINE);
      return;
    }
    if (!isActive || !heroLanded || !firstLineDone) {
      setIntroLineText("");
      return;
    }
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setIntroLineText(INTRO_LINE.slice(0, i));
      if (i >= INTRO_LINE.length) {
        window.clearInterval(timer);
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [firstLineDone, heroLanded, isActive, reducedMotion]);

  useEffect(() => {
    const onScroll = () => onFirstScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onFirstScroll]);

  // Start subtitle scramble only after name finishes typing
  const startSubtitle = useCallback(() => {
    if (reducedMotion) {
      setSub(profile.headlineScramble);
      return;
    }
    scrambleText(
      profile.headlineScramble,
      1400,
      setSub,
      () => {
        if (ctaRef.current) {
          const buttons = ctaRef.current.querySelectorAll("button");
          animate(buttons, {
            opacity: [0, 1],
            y: [20, 0],
            delay: stagger(90),
            duration: 550,
            ease: "out(3)",
          });
        }
      },
    );
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const photoCard = photoCardRef.current;
    const section = shellRef.current;
    if (!photoCard || !section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const y = 20 - progress * 26;
      const scale = 0.985 + progress * 0.03;
      animate(photoCard, {
        translateY: y,
        scale,
        duration: 320,
        ease: "out(3)",
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || lowEnd) return;
    const section = shellRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const photoCard = photoCardRef.current;
    const photoImgWrap = photoImgWrapRef.current;
    const photoOverlay = photoOverlayRef.current;
    const chips = chipsRef.current;
    const pillars = pillarsRef.current;
    if (!section || !leftCol || !rightCol || !photoCard || !photoImgWrap || !photoOverlay)
      return;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      animate(leftCol, {
        translateX: nx * -12,
        translateY: ny * -8,
        duration: 380,
        ease: "out(3)",
      });
      animate(rightCol, {
        translateX: nx * 16,
        translateY: ny * 10,
        duration: 420,
        ease: "out(3)",
      });
      animate(photoCard, {
        rotateY: nx * 4.6,
        rotateX: ny * -3.1,
        duration: 460,
        ease: "out(3)",
      });
      animate(photoImgWrap, {
        scale: 1.05 + Math.abs(nx) * 0.02,
        translateX: nx * 13,
        translateY: ny * 8,
        duration: 460,
        ease: "out(3)",
      });
      animate(photoOverlay, {
        translateX: nx * 8,
        translateY: ny * 6,
        duration: 450,
        ease: "out(3)",
      });
      if (chips) {
        animate(chips, {
          translateX: nx * -5,
          translateY: ny * -3,
          duration: 360,
          ease: "out(3)",
        });
      }
      if (pillars) {
        animate(pillars, {
          translateX: nx * -7,
          translateY: ny * -4,
          duration: 380,
          ease: "out(3)",
        });
      }
    };

    const onLeave = () => {
      animate([leftCol, rightCol], {
        translateX: 0,
        translateY: 0,
        duration: 450,
        ease: "out(4)",
      });
      animate(photoCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 480,
        ease: "out(4)",
      });
      animate(photoImgWrap, {
        scale: 1,
        translateX: 0,
        translateY: 0,
        duration: 480,
        ease: "out(4)",
      });
      animate(photoOverlay, {
        translateX: 0,
        translateY: 0,
        duration: 480,
        ease: "out(4)",
      });
      if (chips) {
        animate(chips, {
          translateX: 0,
          translateY: 0,
          duration: 420,
          ease: "out(4)",
        });
      }
      if (pillars) {
        animate(pillars, {
          translateX: 0,
          translateY: 0,
          duration: 450,
          ease: "out(4)",
        });
      }
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [lowEnd, reducedMotion]);

  useEffect(() => {
    if (!isActive || reducedMotion || !heroLanded) return;
    const shell = shellRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const stats = statsRef.current;
    const subtitle = subtitleRef.current;
    const introLine = introLineRef.current;
    const cta = ctaRef.current;
    const chips = chipsRef.current;
    const pillars = pillarsRef.current;
    const overlay = photoOverlayRef.current;
    if (
      !shell ||
      !leftCol ||
      !rightCol ||
      !stats ||
      !subtitle ||
      !introLine ||
      !cta ||
      !chips ||
      !pillars
    )
      return;

    animate(shell, {
      opacity: [0, 1],
      y: [34, 0],
      duration: 620,
      ease: "out(4)",
    });
    animate(leftCol, {
      opacity: [0, 1],
      x: [-34, 0],
      duration: 760,
      delay: 100,
      ease: "out(3)",
    });
    animate(rightCol, {
      opacity: [0, 1],
      x: [34, 0],
      scale: [0.93, 1],
      duration: 840,
      delay: 200,
      ease: "out(4)",
    });
    animate(stats.children, {
      opacity: [0, 1],
      y: [14, 0],
      delay: stagger(90, { start: 380 }),
      duration: 480,
      ease: "out(3)",
    });
    animate(chips.children, {
      opacity: [0, 1],
      y: [12, 0],
      delay: stagger(70, { start: 270 }),
      duration: 440,
      ease: "out(3)",
    });
    animate(pillars.children, {
      opacity: [0, 1],
      y: [16, 0],
      delay: stagger(90, { start: 340 }),
      duration: 520,
      ease: "out(3)",
    });
    animate(subtitle, {
      opacity: [0, 1],
      y: [10, 0],
      duration: 500,
      delay: 300,
      ease: "out(3)",
    });
    animate(introLine, {
      opacity: [0, 1],
      y: [16, 0],
      duration: 620,
      delay: 260,
      ease: "out(4)",
    });
    animate(cta, {
      opacity: [0, 1],
      y: [22, 0],
      scale: [0.96, 1],
      duration: 620,
      delay: 520,
      ease: "out(4)",
    });
    if (overlay) {
      animate(overlay, {
        opacity: [0, 1],
        y: [12, 0],
        duration: 540,
        delay: 500,
        ease: "out(3)",
      });
    }
  }, [heroLanded, isActive, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || lowEnd) return;
    const section = shellRef.current;
    const bg = bgLayerRef.current;
    const left = leftColRef.current;
    const right = rightColRef.current;
    const photo = photoCardRef.current;
    if (!section || !bg || !left || !right || !photo) return;
    const scale = getParallaxScaleForWidth(window.innerWidth || 1024);
    const scrub = getParallaxScrubForWidth(window.innerWidth || 1024);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bg, { y: -(motionTokens.parallax.hero.bg * scale) * p });
        gsap.set(section, { y: -(motionTokens.parallax.hero.shell * scale) * p });
        gsap.set(left, { y: -(motionTokens.parallax.hero.left * scale) * p });
        gsap.set(right, { y: -(motionTokens.parallax.hero.right * scale) * p });
        gsap.set(photo, { y: -(motionTokens.parallax.hero.photo * scale) * p });
      },
    });
    return () => st.kill();
  }, [lowEnd, reducedMotion]);

  // Theme-adaptive panel backgrounds
  const outerPanel = light
    ? "bg-white/80 border-black/10 backdrop-blur-xl"
    : "bg-[#020711]/96 border-highlight/15";
  const innerPanel = light
    ? "bg-white/60 border-black/8"
    : "bg-[#050b16]/92 border-highlight/10";
  const headText = light ? "text-[#0d1f1a]" : "text-white";
  const mutedText = light ? "text-[#0d1f1a]/60" : "text-highlight/75";
  const statCard = light
    ? "bg-black/5 border-black/12"
    : "bg-black/35 border-highlight/15";
  const statNum = light ? "text-[#0d1f1a]" : "text-white";
  const glowLine = light
    ? "bg-[radial-gradient(circle_at_15%_18%,rgba(76,158,255,0.10),transparent_48%),radial-gradient(circle_at_76%_36%,rgba(46,122,90,0.12),transparent_52%)]"
    : "bg-[radial-gradient(circle_at_15%_18%,rgba(76,158,255,0.18),transparent_48%),radial-gradient(circle_at_76%_36%,rgba(168,217,184,0.20),transparent_52%)]";
  const innerGlow = light
    ? "bg-[radial-gradient(circle_at_30%_38%,rgba(76,158,255,0.10),transparent_45%)]"
    : "bg-[radial-gradient(circle_at_30%_38%,rgba(50,87,130,0.22),transparent_45%)]";
  const frameBg = light
    ? "bg-[radial-gradient(circle_at_50%_25%,rgba(46,122,90,0.10),transparent_58%),linear-gradient(180deg,#f0f7f3_0%,#e8f2ec_100%)]"
    : "bg-[radial-gradient(circle_at_50%_25%,rgba(168,217,184,0.14),transparent_58%),linear-gradient(180deg,#0a0f1d_0%,#080d16_100%)]";
  const frameInner = light
    ? "border-black/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.01))]"
    : "border-highlight/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]";
  const silhouetteBg = light
    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(6,21,18,0.18))]"
    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.34))]";
  const ringBorder = light ? "border-black/12" : "border-highlight/10";
  const ctaBar = light
    ? "border-black/12 bg-white/55"
    : "border-highlight/12 bg-black/45";
  const ctaPrimary = light
    ? "border-[#2e7a5a]/55 bg-gradient-to-r from-[#1f6b4d] to-[#2e7a5a] text-white shadow-[0_0_20px_rgba(46,122,90,0.35)]"
    : "border-surfaceMid/60 bg-gradient-to-r from-[#1e4a3a] to-[#2e7a5a] text-highlight shadow-[0_0_24px_rgba(46,122,90,0.40)]";
  const ctaSecondary = light
    ? "border-black/20 bg-white/70 text-[#0d1f1a] hover:bg-white/90"
    : "border-highlight/22 bg-surface/30 text-highlight hover:bg-surface/45";

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative min-h-screen scroll-mt-16 overflow-hidden px-0 pb-0 pt-0 section-bg"
    >
      {/* Three.js background (fully passive) */}
      <div ref={bgLayerRef} className="pointer-events-none absolute inset-0 z-0 opacity-30">
        {sceneReady ? (
          <HeroScene
            scrollProgressRef={scrollProgressRef}
            lowEnd={lowEnd}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>

      {/* Floating IP / binary ambient text */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-60">
        {["192.168.4.21", "10.0.33.7", "172.16.0.42"].map((ip, i) => (
          <span
            key={ip}
            className="absolute font-mono text-[10px] text-surfaceMid/50"
            style={{
              left: `${10 + i * 24}%`,
              top: `${16 + (i % 3) * 20}%`,
              animation:
                reducedMotion || lowEnd
                  ? "none"
                  : `float-y ${8 + i}s ease-in-out infinite`,
            }}
          >
            {ip}
          </span>
        ))}
        <span
          className="absolute right-[10%] top-[60%] max-w-[200px] break-all font-mono text-[9px] text-surfaceMid/30"
          style={{
            animation:
              reducedMotion || lowEnd
                ? "none"
                : "float-y 14s ease-in-out infinite reverse",
          }}
        >
          01001001 01001110 01010011 01000101 01000011
        </span>
      </div>

      <div
        ref={shellRef}
        className="relative z-10 w-full"
        style={{ opacity: 1 }}
      >
        <div
          className={`relative w-full overflow-hidden border-y p-0 transition-colors duration-500 ${outerPanel}`}
        >
          {/* Outer glow overlay */}
          <div
            className={`pointer-events-none absolute inset-0 transition-all duration-500 ${glowLine}`}
            aria-hidden
          />

          <div
            className={`relative mt-0 grid min-h-[calc(100vh-3.5rem)] overflow-hidden border px-5 pb-6 pt-10 transition-colors duration-500 lg:grid-cols-12 lg:gap-4 ${innerPanel}`}
          >
            {/* Inner depth layers */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className={`absolute inset-0 ${innerGlow}`} />
              <div
                className={`absolute inset-0 ${
                  light
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))]"
                    : "bg-[linear-gradient(180deg,rgba(2,6,18,0.3),rgba(2,6,18,0.7))]"
                }`}
              />
              <div
                className={`absolute -left-16 top-20 h-64 w-64 rounded-full border ${ringBorder}`}
              />
            </div>

            {/* ── Left column ── */}
            <div
              ref={leftColRef}
              className="relative z-[3] flex flex-col justify-between lg:col-span-7"
              style={{ opacity: 1 }}
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div>
                {/* Identity badge */}
                <div className={`mb-7 mt-1 flex items-center gap-3 ${headText}`}>
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border font-mono text-[11px] font-semibold tracking-wide ${
                      light
                        ? "border-[#2e7a5a]/40 bg-[#2e7a5a]/10 text-[#1f6b4d]"
                        : "border-highlight/25 bg-surface/30 text-highlight"
                    }`}
                  >
                    EMK
                  </span>
                  <div>
                    <p className="font-display text-3xl font-semibold leading-none">Security-First Builder</p>
                    <p className={`font-sans text-lg ${mutedText}`}>
                      Web Engineering · Cybersecurity · Product Design
                    </p>
                  </div>
                </div>

                {/* Headline */}
                <h1
                  className={`font-display text-5xl font-black uppercase leading-[0.95] sm:text-7xl ${headText}`}
                >
                  IT&apos;S ME
                  <br />
                  {/* Line 1: "Eddy Max" */}
                  <span
                    className={`bg-gradient-to-r bg-clip-text text-transparent ${
                      light
                        ? "from-[#2e7a5a] via-[#3a9e70] to-[#1a5c3a]"
                        : "from-highlight via-accent to-surfaceMid"
                    }`}
                  >
                    <TypedName
                      name={`${profile.name.split(" ").slice(0, 2).join(" ")}`}
                      reducedMotion={reducedMotion}
                      start={isActive && heroLanded}
                      onDone={() => setFirstLineDone(true)}
                    />
                  </span>
                  <br />
                  {/* Line 2: "Kilonzo" — starts only after line 1 finishes */}
                  <span
                    className={`bg-gradient-to-r bg-clip-text text-transparent ${
                      light
                        ? "from-[#2e7a5a] via-[#3a9e70] to-[#1a5c3a]"
                        : "from-highlight via-accent to-surfaceMid"
                    }`}
                  >
                    {firstLineDone ? (
                      <TypedName
                        name={profile.name.split(" ").slice(2).join(" ")}
                        reducedMotion={reducedMotion}
                        start={isActive && heroLanded && firstLineDone}
                        onDone={startSubtitle}
                      />
                    ) : (
                      /* invisible placeholder keeps layout stable */
                      <span className="invisible">
                        {profile.name.split(" ").slice(2).join(" ")}
                      </span>
                    )}
                  </span>
                </h1>

                <p
                  ref={introLineRef}
                  className={`hero-introline mt-3 font-sans text-base sm:text-lg ${mutedText}`}
                  style={{ opacity: reducedMotion ? 1 : 0 }}
                >
                  {introLineText}
                </p>
                <div
                  className={`mt-4 grid max-w-2xl grid-cols-2 gap-2 rounded-xl border p-3 md:grid-cols-4 ${
                    light ? "border-black/12 bg-white/45" : "border-highlight/15 bg-black/25"
                  }`}
                >
                  {[
                    ["GitHub Repos", "91+"],
                    ["Followers", "37+"],
                    ["Profile Stars", "133+"],
                    ["Updated", "Apr 2026"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-md border border-highlight/10 px-3 py-2"
                    >
                      <p className="font-mono text-[10px] text-highlight/65">{k}</p>
                      <p className={`font-display text-lg leading-none ${headText}`}>{v}</p>
                    </div>
                  ))}
                </div>

                <div ref={chipsRef} className="mt-5 flex flex-wrap gap-2">
                  <MagneticButton
                    className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                      light
                        ? "border-[#2e7a5a]/40 bg-[#2e7a5a]/10 text-[#1f6b4d]"
                        : "border-surfaceMid/50 bg-surface/25 text-highlight"
                    }`}
                    onClick={() =>
                      document.getElementById("cyber")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Cyber Sec
                  </MagneticButton>
                  <MagneticButton
                    className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                      light
                        ? "border-[#1e4a9f]/35 bg-[#4c9eff]/10 text-[#1a4f9e]"
                        : "border-[#4c9eff]/45 bg-[#4c9eff]/20 text-[#9ec8ff]"
                    }`}
                    onClick={() =>
                      document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Soft Eng
                  </MagneticButton>
                  <MagneticButton
                    className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                      light
                        ? "border-[#5e47d6]/35 bg-[#7a68ff]/10 text-[#5e47d6]"
                        : "border-[#7f74ff]/55 bg-[#7a68ff]/15 text-[#bdb6ff]"
                    }`}
                    onClick={() =>
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Web Dev
                  </MagneticButton>
                </div>

                <div ref={pillarsRef} className="mt-7 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    ["Threat Modeling", "Secure-by-design architecture and risk-first planning."],
                    ["API Engineering", "Reliable backend services with observability and scale."],
                    ["Creative Frontend", "Fast, interactive interfaces with polished motion."],
                  ].map(([title, body]) => (
                    <div
                      key={title}
                      className={`interactive-card rounded-xl border px-3 py-3 transition-transform duration-300 hover:-translate-y-1 ${
                        light
                          ? "border-black/12 bg-white/45"
                          : "border-highlight/15 bg-black/30"
                      }`}
                      style={{
                        boxShadow:
                          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
                      }}
                    >
                      <p className={`font-mono text-[11px] uppercase tracking-wide ${headText}`}>
                        {title}
                      </p>
                      <p className={`mt-1 font-sans text-xs leading-relaxed ${mutedText}`}>
                        {body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Subtitle scramble */}
                <p
                  ref={subtitleRef}
                  className={`mt-6 min-h-[1.6em] max-w-2xl font-sans text-lg ${mutedText}`}
                  style={{ opacity: 1 }}
                >
                  {sub}
                </p>
              </div>

              {/* Stats row */}
              <div
                ref={statsRef}
                className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {[
                  ["23", "Security Findings"],
                  ["84", "Labs / CTF Solved"],
                  ["12", "Client Projects Delivered"],
                ].map(([n, label]) => (
                  <div
                    key={label}
                    className={`interactive-card rounded-xl border px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${statCard}`}
                    style={{ opacity: 1 }}
                  >
                    <p className={`font-display text-4xl font-semibold leading-none ${statNum}`}>
                      {n}
                    </p>
                    <p className={`mt-1 font-sans text-sm ${mutedText}`}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column (portrait frame) ── */}
            <div
              ref={rightColRef}
              className="relative mt-4 flex flex-col items-center justify-start lg:col-span-5 lg:-mt-6"
              style={{ opacity: 1 }}
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div
                ref={photoCardRef}
                className={`hero-person-frame relative h-[420px] sm:h-[540px] w-full max-w-[470px] overflow-hidden rounded-[28px] border transition-colors duration-500 ${frameInner.split(" ")[0]} ${frameBg}`}
              >
                <div
                  className={`absolute inset-x-10 bottom-0 top-20 rounded-t-[220px] border ${frameInner}`}
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-center">
                  <div
                    ref={photoImgWrapRef}
                    className="hero-photo-wrap relative h-[94%] w-[88%] -translate-y-5 overflow-hidden rounded-t-[220px] border border-white/10 md:-translate-y-7"
                  >
                    <Image
                      src="https://avatars.githubusercontent.com/EddyKilonzo?v=4"
                      alt={`${profile.name} portrait`}
                      fill
                      priority
                      sizes="(max-width: 768px) 90vw, 470px"
                      className="h-full w-full object-cover object-top saturate-110 contrast-105"
                    />
                    <div
                      className={`hero-silhouette absolute inset-0 rounded-t-[220px] ${silhouetteBg}`}
                    />
                    <div ref={photoOverlayRef} className="absolute inset-x-0 bottom-0 z-[2] px-5 pb-5">
                      <div className="rounded-lg border border-white/12 bg-black/45 px-3 py-2.5 backdrop-blur-[1px]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-highlight/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.75)]">
                          signature project
                        </p>
                        <p className="mt-1 font-sans text-base text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]">
                          Building secure systems with cinematic interfaces.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full max-w-[470px]">
                <div
                  ref={ctaRef}
                  className={`hero-cta-dock grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border p-2 backdrop-blur-md ${ctaBar}`}
                >
                  <MagneticButton
                    className={`inline-flex h-11 w-full items-center justify-center rounded-xl border px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${ctaPrimary}`}
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Schedule a Call
                  </MagneticButton>
                  <MagneticButton
                    className={`inline-flex h-11 min-w-[60px] items-center justify-center rounded-xl border px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${ctaSecondary}`}
                    onClick={() => setCvModalOpen(true)}
                  >
                    CV
                  </MagneticButton>
                </div>
              </div>
            </div>

            {/* Scroll hint */}
            <div
              ref={hintRef}
              className={`absolute bottom-6 left-1/2 z-[3] -translate-x-1/2 transition-opacity duration-500 ${
                hasScrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.25em] ${
                  light ? "text-[#0d1f1a]/40" : "text-highlight/45"
                }`}
              >
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>

      <AppModal
        open={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        title="Choose CV Action"
        subtitle="Pick how you want to continue."
        footer={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setCvModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-ghost border-accent/60 text-accent"
              onClick={() => {
                setCvModalOpen(false);
                document.getElementById("cv")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View CV Section
            </button>
          </>
        }
      >
        <p className="font-sans text-sm text-highlight/80">
          CV download is configurable. You can preview the full CV section now and add a
          direct PDF export anytime.
        </p>
      </AppModal>

      <style jsx>{`
        @keyframes float-y {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .hero-person-frame {
          animation: bob-y 8s ease-in-out infinite;
        }

        .hero-silhouette {
          box-shadow:
            0 0 50px rgba(22, 26, 42, 0.5),
            inset 0 18px 26px rgba(255, 255, 255, 0.04);
        }

        .hero-photo-wrap {
          animation: portrait-breathe 6.2s ease-in-out infinite;
        }

        .hero-cta-dock {
          animation: cta-drift 4.8s ease-in-out infinite;
        }

        .hero-introline {
          animation: introline-breathe 5.2s ease-in-out infinite;
        }

        .hero-photo-wrap::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 26%;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.55)
          );
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          pointer-events: none;
        }

        .interactive-card:hover {
          box-shadow:
            0 16px 38px -22px rgba(12, 20, 30, 0.65),
            0 10px 18px -14px rgba(46, 122, 90, 0.45);
        }

        @keyframes bob-y {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes portrait-breathe {
          0%,
          100% {
            transform: translateY(-20px) scale(1);
          }
          50% {
            transform: translateY(-32px) scale(1.035);
          }
        }

        @keyframes cta-drift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }

        @keyframes introline-breathe {
          0%,
          100% {
            transform: translateY(0);
            filter: drop-shadow(0 0 0 rgba(168, 217, 184, 0));
          }
          50% {
            transform: translateY(-2px);
            filter: drop-shadow(0 0 6px rgba(168, 217, 184, 0.14));
          }
        }
      `}</style>
    </section>
  );
}
