"use client";

import { profile } from "@/content/portfolio";
import { scrambleText } from "@/lib/scramble";
import { useTheme } from "@/context/ThemeContext";
import { animate, stagger } from "animejs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AppModal } from "@/components/ui/AppModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const INTRO_LINE =
  "Software engineer turned cybersecurity analyst — I know how systems are built, and I am learning every day how to defend them.";

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
  blinkAfterDone = true,
}: {
  name: string;
  reducedMotion: boolean;
  start: boolean;
  onDone?: () => void;
  blinkAfterDone?: boolean;
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

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
      onDoneRef.current?.();
      return;
    }
    setDisplayed("");
    setCursorVisible(true);
    setTyping(true);

    const MS_PER_CHAR = 72;
    const startT = performance.now();
    let raf = 0;
    let lastShown = 0;

    const tick = (now: number) => {
      const n = Math.min(name.length, Math.floor((now - startT) / MS_PER_CHAR));
      if (n !== lastShown) {
        lastShown = n;
        setDisplayed(name.slice(0, n));
      }
      if (n < name.length) {
        raf = requestAnimationFrame(tick);
      } else {
        setTyping(false);
        onDoneRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [name, reducedMotion, start]);

  // After typing finishes, blink; during typing keep cursor solid
  useEffect(() => {
    if (typing || !blinkAfterDone) return;
    const id = setInterval(() => setCursorVisible((c) => !c), 530);
    return () => clearInterval(id);
  }, [blinkAfterDone, typing]);

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
  const [secondLineDone, setSecondLineDone] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [heroLanded, setHeroLanded] = useState(false);
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
    const fallback = window.setTimeout(() => setHeroLanded(true), 150);
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
      setFirstLineDone(false);
      setSecondLineDone(false);
      setSub("");
      setIntroLineText(reducedMotion ? INTRO_LINE : "");
      return;
    }
    if (reducedMotion) {
      setFirstLineDone(true);
      setSecondLineDone(true);
      setSub(profile.headlineScramble);
      setIntroLineText(INTRO_LINE);
    }
  }, [isActive, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setIntroLineText(INTRO_LINE);
      return;
    }
    if (!isActive || !heroLanded || !secondLineDone) {
      setIntroLineText("");
      return;
    }
    const CHAR_INTERVAL = 22;
    const t0 = performance.now();
    let rafId = 0;
    let lastN = -1;
    const tick = (now: number) => {
      const n = Math.min(INTRO_LINE.length, Math.floor((now - t0) / CHAR_INTERVAL));
      if (n !== lastN) {
        lastN = n;
        setIntroLineText(INTRO_LINE.slice(0, n));
      }
      if (n < INTRO_LINE.length) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [heroLanded, isActive, reducedMotion, secondLineDone]);

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
    scrambleText(profile.headlineScramble, 1400, setSub, () => {
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
    });
  }, [reducedMotion]);

  // Photo card scroll parallax is handled by the GSAP ScrollTrigger below —
  // no separate anime.js scroll listener needed.

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

    // RAF gate — only one batch of tweens per rendered frame regardless of
    // how many pointermove events fire (can be 120+/sec on high-refresh displays).
    let rafId = 0;
    let pendingNx = 0;
    let pendingNy = 0;

    const flush = () => {
      rafId = 0;
      const nx = pendingNx;
      const ny = pendingNy;
      // gsap.to with overwrite:"auto" cancels any in-flight tween on the same
      // target+property before starting the new one — no tween pile-up.
      gsap.to(leftCol, { x: nx * -12, y: ny * -8, duration: 0.38, ease: "power3.out", overwrite: "auto" as const });
      gsap.to(rightCol, { x: nx * 16, y: ny * 10, duration: 0.42, ease: "power3.out", overwrite: "auto" as const });
      gsap.to(photoCard, { rotateY: nx * 4.6, rotateX: ny * -3.1, duration: 0.46, ease: "power3.out", overwrite: "auto" as const });
      gsap.to(photoImgWrap, { scale: 1.05 + Math.abs(nx) * 0.02, x: nx * 13, y: ny * 8, duration: 0.46, ease: "power3.out", overwrite: "auto" as const });
      gsap.to(photoOverlay, { x: nx * 8, y: ny * 6, duration: 0.45, ease: "power3.out", overwrite: "auto" as const });
      if (chips) gsap.to(chips, { x: nx * -5, y: ny * -3, duration: 0.36, ease: "power3.out", overwrite: "auto" as const });
      if (pillars) gsap.to(pillars, { x: nx * -7, y: ny * -4, duration: 0.38, ease: "power3.out", overwrite: "auto" as const });
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pendingNx = (e.clientX - rect.left) / rect.width - 0.5;
      pendingNy = (e.clientY - rect.top) / rect.height - 0.5;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const onLeave = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      const leaveOpts = { duration: 0.48, ease: "power3.out", overwrite: "auto" as const };
      gsap.to([leftCol, rightCol], { x: 0, y: 0, ...leaveOpts });
      gsap.to(photoCard, { rotateX: 0, rotateY: 0, ...leaveOpts });
      gsap.to(photoImgWrap, { scale: 1, x: 0, y: 0, ...leaveOpts });
      gsap.to(photoOverlay, { x: 0, y: 0, ...leaveOpts });
      if (chips) gsap.to(chips, { x: 0, y: 0, ...leaveOpts });
      if (pillars) gsap.to(pillars, { x: 0, y: 0, ...leaveOpts });
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [lowEnd, reducedMotion]);

  useEffect(() => {
    if (!isActive || reducedMotion || !heroLanded) return;
    const stats = statsRef.current;
    const cta = ctaRef.current;
    const chips = chipsRef.current;
    const pillars = pillarsRef.current;
    const overlay = photoOverlayRef.current;
    if (!stats || !cta || !chips || !pillars) return;

    // We rely on CSS transitions for the main containers (shell, leftCol, rightCol).
    // These animejs calls handle staggered children that don't have CSS transitions.
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

  // Scroll parallax for hero elements removed to improve scroll performance
  // and maintain a cleaner native-scroll feel. 
  // Background parallax in PortfolioPage is preserved.

  // Theme-adaptive panel backgrounds
  const outerPanel = light
    ? "bg-white/80 border-black/10 backdrop-blur-xl"
    : "bg-[#020711]/96 border-highlight/15";
  const innerPanel = light
    ? "bg-white/60 border-black/8"
    : "bg-[#050b16]/92 border-highlight/10";
  const headText = light ? "text-[#0d1f1a]" : "text-white";
  const mutedText = light ? "text-[#0d1f1a]/60" : "text-highlight/75";
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
  const ringBorder = light ? "border-black/12" : "border-highlight/10";
  const bottomFade = light ? "from-[#e8f2ec]" : "from-[#080d16]";
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
        className={`relative z-10 w-full will-change-[opacity,transform] motion-reduce:transition-none ${
          reducedMotion
            ? "opacity-100"
            : heroLanded
              ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[720ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              : "translate-y-9 opacity-0 transition-none"
        }`}
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
            {/* Outer: GSAP scroll + tilt; inner: CSS entrance (no transform fight). */}
            <div
              ref={leftColRef}
              className="relative z-[3] lg:col-span-7"
            >
              <div
                className={`flex flex-col justify-between will-change-[opacity,transform] motion-reduce:transition-none ${
                  reducedMotion
                    ? "translate-x-0 opacity-100"
                    : heroLanded
                      ? "translate-x-0 opacity-100 transition-[opacity,transform] delay-100 duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      : "-translate-x-[34px] opacity-0 transition-none"
                }`}
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
                    <p className="font-display text-3xl font-semibold leading-none">Cybersecurity Analyst</p>
                    <p className={`font-sans text-lg ${mutedText}`}>
                      Security Monitoring · Incident Response · Blue Team
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
                    className={`bg-gradient-to-r bg-clip-text text-transparent transition-opacity duration-300 ${
                      light
                        ? "from-[#2e7a5a] via-[#3a9e70] to-[#1a5c3a]"
                        : "from-highlight via-accent to-surfaceMid"
                    }`}
                  >
                    <TypedName
                      name="Eddy Max"
                      reducedMotion={reducedMotion}
                      start={isActive && heroLanded}
                      onDone={() => setFirstLineDone(true)}
                      blinkAfterDone={false}
                    />
                  </span>
                  <br />
                  {/* Line 2: "Kilonzo" — starts only after line 1 finishes */}
                  <span
                    className={`bg-gradient-to-r bg-clip-text text-transparent transition-opacity duration-500 ${
                      light
                        ? "from-[#2e7a5a] via-[#3a9e70] to-[#1a5c3a]"
                        : "from-highlight via-accent to-surfaceMid"
                    } ${firstLineDone ? "opacity-100" : "opacity-0"}`}
                  >
                    {firstLineDone ? (
                      <TypedName
                        name="Kilonzo"
                        reducedMotion={reducedMotion}
                        start={isActive && heroLanded && firstLineDone}
                        onDone={() => {
                          setSecondLineDone(true);
                          startSubtitle();
                        }}
                        blinkAfterDone={false}
                      />
                    ) : (
                      /* invisible placeholder keeps layout stable */
                      <span className="invisible">Kilonzo</span>
                    )}
                  </span>
                </h1>

                <p
                  ref={introLineRef}
                  className={`hero-introline mt-3 font-sans text-base sm:text-lg ${mutedText} will-change-[opacity,transform] motion-reduce:transition-none ${
                    reducedMotion
                      ? "opacity-100"
                      : heroLanded
                        ? "translate-y-0 opacity-100 transition-[opacity,transform] delay-[260ms] duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        : "translate-y-4 opacity-0 transition-none"
                  }`}
                >
                  {introLineText}
                </p>

                <div ref={chipsRef} className="mt-5 flex flex-wrap gap-2">
                  <MagneticButton
                    className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                      light
                        ? "border-red-600/40 bg-red-600/10 text-red-700"
                        : "border-cyber/50 bg-cyber/15 text-cyber"
                    }`}
                    onClick={() =>
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    SOC / Blue Team
                  </MagneticButton>
                  <MagneticButton
                    className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                      light
                        ? "border-orange-600/35 bg-orange-500/10 text-orange-700"
                        : "border-orange-400/45 bg-orange-400/15 text-orange-300"
                    }`}
                    onClick={() =>
                      document.getElementById("now")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Home Lab
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
                    Experience
                  </MagneticButton>
                </div>

                <div ref={pillarsRef} className="mt-7 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    ["Security Monitoring", "Watching SIEM dashboards, spotting unusual activity, and investigating alerts before they become incidents."],
                    ["Threat Detection", "Building detection rules mapped to real attacker techniques so threats get caught early."],
                    ["Incident Response", "Following structured IR steps — identify, contain, fix, and document — practised in a home lab environment."],
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
                  className={`mt-6 min-h-[1.6em] max-w-2xl font-display text-lg leading-relaxed ${mutedText} will-change-[opacity,transform] motion-reduce:transition-none ${
                    reducedMotion
                      ? "translate-y-0 opacity-100"
                      : heroLanded
                        ? "translate-y-0 opacity-100 transition-[opacity,transform] delay-[300ms] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        : "translate-y-2.5 opacity-0 transition-none"
                  }`}
                >
                  {sub}
                </p>
              </div>

              <div
                ref={statsRef}
                className="hidden"
              >
                {/* Stats row removed as requested */}
              </div>
              </div>
            </div>

            {/* ── Right column (portrait frame) ── */}
            <div ref={rightColRef} className="relative mt-8 lg:col-span-5 lg:mt-6">
              <div
                className={`flex flex-col items-center justify-start will-change-[opacity,transform] motion-reduce:transition-none ${
                  reducedMotion
                    ? "translate-x-0 scale-100 opacity-100"
                    : heroLanded
                      ? "translate-x-0 scale-100 opacity-100 transition-[opacity,transform] delay-200 duration-[840ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      : "translate-x-[34px] scale-[0.93] opacity-0 transition-none"
                }`}
              >
              <div
                ref={photoCardRef}
                className={`hero-person-frame relative w-full overflow-hidden rounded-[28px] border transition-colors duration-500
                  h-[360px] max-w-[340px]
                  sm:h-[480px] sm:max-w-[420px]
                  md:h-[520px] md:max-w-[450px]
                  lg:h-[560px] lg:max-w-[470px]
                  ${frameInner.split(" ")[0]} ${frameBg}`}
              >
                {/* Atmospheric glow behind the person */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8">
                  <div className="h-48 w-48 rounded-full bg-cyber/20 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
                  <div className="h-28 w-36 rounded-full bg-accent/10 blur-2xl" />
                </div>

                {/* Portrait — background removed, full figure */}
                <div ref={photoImgWrapRef} className="hero-photo-wrap absolute inset-0">
                  <Image
                    src="/DSC_2418-removebg-preview.png"
                    alt={`${profile.name} portrait`}
                    fill
                    priority
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 44vw, 470px"
                    className="object-contain object-bottom drop-shadow-[0_0_32px_rgba(168,217,184,0.18)]"
                  />
                </div>

                {/* Bottom fade — blends feet into card background */}
                <div
                  className={`pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t to-transparent ${bottomFade}`}
                />

                {/* Status overlay */}
                <div ref={photoOverlayRef} className="absolute bottom-3 left-3 right-3 z-[2]">
                  <div className="rounded-xl border border-white/12 bg-black/55 px-3.5 py-2.5 backdrop-blur-sm">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-highlight/85">
                        Open to SOC Analyst roles
                      </p>
                    </div>
                    <p className="font-sans text-sm text-white/80">
                      Detecting threats. Defending systems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 w-full max-w-[340px] sm:max-w-[420px] md:max-w-[450px] lg:max-w-[470px]">
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

        .hero-photo-wrap {
          animation: portrait-breathe 7s ease-in-out infinite;
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
            transform: scale(1);
          }
          50% {
            transform: scale(1.025);
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
