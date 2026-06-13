"use client";

import {
  profile,
  projects,
  skillsByRole,
  type RoleMode,
} from "@/content/portfolio";
import { useRole } from "@/context/RoleContext";
import { useTheme } from "@/context/ThemeContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

gsap.registerPlugin(ScrollTrigger);
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { SplittingHeading } from "@/components/ui/SplittingHeading";

const RoleParticles = dynamic(
  () => import("./RoleParticles").then((m) => m.RoleParticles),
  { ssr: false },
);

const modes: { id: RoleMode; label: string; icon: string; tagline: string }[] = [
  { id: "engineering", label: "Developer", icon: "</> ", tagline: "Build it" },
  { id: "cyber",       label: "CyberSec",  icon: "[*] ", tagline: "Defend it" },
];

const roleTheme: Record<RoleMode, {
  accent: string;
  glow: string;
  tag: string;
  tagText: string;
  border: string;
  badgeBg: string;
}> = {
  cyber: {
    accent:  "#ff4c4c",
    glow:    "rgba(255,76,76,0.18)",
    tag:     "rgba(255,76,76,0.12)",
    tagText: "#ff4c4c",
    border:  "rgba(255,76,76,0.25)",
    badgeBg: "rgba(255,76,76,0.08)",
  },
  engineering: {
    accent:  "#2e7a5a",
    glow:    "rgba(46,122,90,0.2)",
    tag:     "rgba(46,122,90,0.12)",
    tagText: "#a8d9b8",
    border:  "rgba(46,122,90,0.3)",
    badgeBg: "rgba(46,122,90,0.08)",
  },
  web: {
    accent:  "#4c9eff",
    glow:    "rgba(76,158,255,0.18)",
    tag:     "rgba(76,158,255,0.12)",
    tagText: "#4c9eff",
    border:  "rgba(76,158,255,0.25)",
    badgeBg: "rgba(76,158,255,0.08)",
  },
};

const roleInsights: Record<
  "cyber" | "engineering",
  {
    focus: string;
    impact: string;
    stack: string[];
    mission: string;
    stats: { label: string; value: string }[];
    pillars: { title: string; detail: string; metric: string; jumpTo: string }[];
  }
> = {
  cyber: {
    focus: "Detection engineering, incident response, and hands-on offensive simulation — blue team operations grounded in how attackers actually move.",
    impact: "Documented investigations with CVSS-scored findings, remediation guidance, and proof-of-concept evidence across network, web, and cloud targets.",
    stack: ["SIEM", "Threat Hunting", "Purple Team", "Hardening"],
    mission: "Secure systems by design — not just post-incident patching.",
    stats: [
      { label: "Reports filed",   value: "12+" },
      { label: "CVEs tracked",    value: "6"   },
      { label: "Uptime improved", value: "40%" },
    ],
    pillars: [
      {
        title: "Threat Detection",
        detail: "Build and tune detections that are actionable, low-noise, and mapped to ATT&CK behavior.",
        metric: "Lower false positives",
        jumpTo: "reports",
      },
      {
        title: "Incident Readiness",
        detail: "Practice response workflows and escalation paths to reduce time-to-containment.",
        metric: "Faster response cycles",
        jumpTo: "cyber",
      },
      {
        title: "Platform Hardening",
        detail: "Apply secure defaults, segmentation, and policy-as-code for resilient environments.",
        metric: "Stronger baseline posture",
        jumpTo: "experience",
      },
    ],
  },
  engineering: {
    focus: "Full-stack product engineering — from React UIs and design systems to NestJS APIs, event-driven backends, and cloud delivery pipelines.",
    impact: "Shipped 10+ production applications across fintech, logistics, edtech, and SaaS — from solo builds to collaborative delivery.",
    stack: ["React", "Next.js", "Angular", "NestJS", "PostgreSQL", "Docker", "CI/CD"],
    mission: "Build products that hold up under scale and stay maintainable over time.",
    stats: [
      { label: "Apps shipped",   value: "10+" },
      { label: "Perf score avg", value: "92"  },
      { label: "Services built", value: "8+"  },
    ],
    pillars: [
      {
        title: "Frontend Craft",
        detail: "Build React/Angular UIs with clean component architecture, strong accessibility, and motion-aware interactions.",
        metric: "Polished user journeys",
        jumpTo: "projects",
      },
      {
        title: "Backend Reliability",
        detail: "Design NestJS APIs with clear domain boundaries, type-safe Prisma data layers, and observable failure handling.",
        metric: "Stable production systems",
        jumpTo: "projects",
      },
      {
        title: "Delivery Velocity",
        detail: "CI/CD guardrails, Docker-first environments, and progressive release patterns to ship confidently and frequently.",
        metric: "Faster, safer releases",
        jumpTo: "experience",
      },
    ],
  },
};

function SkillBar({ name, level, accent }: { name: string; level: number; accent: string }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const id = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(id);
  }, [name, level]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-mono text-highlight/80">{name}</span>
        <span className="font-mono" style={{ color: accent }}>{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface/40">
        <div
          className="h-full rounded-full"
          style={{
            width: animated ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${accent}80, ${accent})`,
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

/* Animated count-up stat — fires only when scrolled into view, re-runs on mode switch. */
function CountUpStat({ label, value, accent, border }: { label: string; value: string; accent: string; border: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const runAnim = useCallback((v: string) => {
    const match = v.match(/^(\d+)(.*)$/);
    if (!match) { setDisplay(v); return () => {}; }
    const target = parseInt(match[1]!, 10);
    const suffix = match[2] ?? "";
    let rafId = 0;
    const t0 = performance.now();
    const DUR = 850;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Gate animation on scroll entry
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        triggered.current = true;
        runAnim(valueRef.current);
      },
    });
    return () => st.kill();
  }, [runAnim]);

  // Re-animate on mode switch after initial trigger
  useEffect(() => {
    if (!triggered.current) return;
    return runAnim(value);
  }, [value, runAnim]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-xl px-3 py-2.5 text-center transition-transform duration-300 hover:-translate-y-0.5"
      style={{ border: `1px solid ${border}`, background: `${accent}08` }}
    >
      <span className="font-display text-xl font-bold tabular-nums" style={{ color: accent }}>{display}</span>
      <span className="mt-0.5 font-mono text-[11px] text-highlight/75">{label}</span>
    </div>
  );
}

export function RoleSwitcherSection() {
  const sectionRef = useSectionReveal(0);
  const { mode, setMode } = useRole();
  const { light } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState<"cyber" | "engineering">(
    mode === "cyber" ? "cyber" : "engineering",
  );
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const switching = useRef(false);

  const theme = useMemo(() => roleTheme[displayMode], [displayMode]);
  const insight = roleInsights[displayMode];
  const activeMode = modes.find((x) => x.id === displayMode);

  useEffect(() => {
    if (mode === "cyber" || mode === "engineering") setDisplayMode(mode);
  }, [mode]);

  const onSelect = useCallback((next: RoleMode) => {
    if (next === mode || switching.current) return;
    switching.current = true;
    const el = panelRef.current;
    if (el) {
      animate(el, {
        opacity: [1, 0],
        x: [0, -24],
        duration: 220,
        ease: "in(3)",
        onComplete: () => {
          setMode(next);
          requestAnimationFrame(() => {
            animate(el, {
              opacity: [0, 1],
              x: [24, 0],
              duration: 320,
              ease: "out(3)",
              onComplete: () => { switching.current = false; },
            });
          });
        },
      });
    } else {
      setMode(next);
      switching.current = false;
    }
  }, [mode, setMode]);

  useEffect(() => { setActivePillarIdx(0); }, [displayMode]);

  const skills = useMemo(() => skillsByRole[displayMode].slice(0, 8), [displayMode]);
  const featured = useMemo(
    () => projects.filter((p) => p.roleMode === displayMode).slice(0, 2),
    [displayMode],
  );
  const activePillar = useMemo(
    () => insight.pillars[activePillarIdx] ?? insight.pillars[0],
    [insight.pillars, activePillarIdx],
  );

  const jumpTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roles"
      data-section="roles"
      className="relative overflow-hidden py-24 section-bg"
      style={{ "--section-tint": "rgba(46, 122, 90, 0.04)" } as React.CSSProperties}
    >
      <SectionNumber n="04" sectionId="roles" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <div data-aos="fade-up">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">
              {"// dual discipline"}
            </p>
            <SplittingHeading
              as="h2"
              text="Two operating modes"
              className="splitting-chars mb-4 font-display text-4xl text-highlight md:text-5xl"
            />
            <p className="mb-10 max-w-2xl font-sans text-highlight/85">
              One engineer, two lenses — I build production software, and I know how
              to defend it. Switch modes to see how each discipline shows up in my work.
            </p>
          </div>
        </ParallaxDrift>

        {/* Mobile tabs */}
        <div className="mb-8 flex flex-wrap gap-2 lg:hidden" data-aos="fade-up" data-aos-delay="80">
          {modes.map((m) => {
            const t = roleTheme[m.id];
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m.id)}
                className="relative rounded-full px-5 py-2 font-mono text-xs font-semibold tracking-wide transition-all duration-300"
                style={{
                  border: `1px solid ${active ? t.border : "rgba(168,217,184,0.25)"}`,
                  background: active ? t.tag : "rgba(30,74,58,0.25)",
                  color: active ? t.tagText : "rgba(216,236,224,0.75)",
                  boxShadow: active ? `0 0 14px ${t.glow}` : "none",
                }}
              >
                <span className="mr-1.5">{m.icon}</span>
                {m.label}
                {active && (
                  <span
                    className="absolute -bottom-px left-1/2 h-px w-3/4 -translate-x-1/2 rounded-full"
                    style={{ background: t.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
          {/* Desktop sidebar tabs */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-24 space-y-2 rounded-2xl border border-highlight/15 bg-bg/40 p-2"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              {modes.map((m) => {
                const t = roleTheme[m.id];
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className="group relative w-full overflow-hidden rounded-xl px-3.5 py-3 text-left transition-all duration-300"
                    style={{
                      border: `1px solid ${active ? t.border : "rgba(168,217,184,0.12)"}`,
                      background: active ? t.tag : "rgba(30,74,58,0.2)",
                      boxShadow: active ? `0 0 16px ${t.glow}` : "none",
                    }}
                  >
                    {/* Accent edge indicator */}
                    <span
                      className="absolute inset-y-2 left-0 w-[3px] rounded-r-full transition-all duration-300"
                      style={{
                        background: t.accent,
                        opacity: active ? 1 : 0,
                        transform: active ? "scaleY(1)" : "scaleY(0.3)",
                      }}
                    />
                    <span className="flex items-center gap-2 font-mono text-xs font-semibold" style={{ color: active ? t.tagText : "rgba(216,236,224,0.8)" }}>
                      <span>{m.icon}</span>
                      {m.label}
                    </span>
                    <span
                      className="mt-0.5 block pl-6 font-mono text-[9px] uppercase tracking-widest transition-colors duration-300"
                      style={{ color: active ? t.accent : "rgba(216,236,224,0.4)" }}
                    >
                      {m.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* LEFT PANEL: Identity + Interactive */}
              <div data-aos="fade-right" data-aos-delay="150">
                <div
                  className="glass-card mi-interactive relative min-h-[340px] overflow-hidden rounded-2xl p-6"
                  style={{
                    borderColor: light ? theme.border : undefined,
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
                    transition: "border-color 0.5s ease",
                  }}
                >
                  {/* Accent shimmer edge */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                      backgroundSize: "200% 100%",
                      animation: "role-edge-shimmer 3.5s linear infinite",
                    }}
                  />
                  <RoleParticles mode={displayMode} />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 20% 15%, ${theme.glow}, transparent 55%)`,
                      transition: "background 0.5s ease",
                    }}
                  />

                  <div className="relative z-10 space-y-5">
                    {/* Identity header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="mono-label text-xs text-highlight/60">
                          {"// identity"}
                        </p>
                        <span
                          className="mono-label flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px]"
                          style={{ background: theme.badgeBg, border: `1px solid ${theme.border}`, color: theme.tagText }}
                        >
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                              background: theme.accent,
                              boxShadow: `0 0 6px ${theme.accent}`,
                              animation: "pulse 2s infinite",
                            }}
                          />
                          Available
                        </span>
                      </div>
                      <p className="mt-2 font-display text-2xl text-highlight drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
                        {profile.name}
                      </p>
                      <p className="mono-label mt-0.5 text-sm" style={{ color: theme.tagText }}>
                        {activeMode?.icon} {activeMode?.label} · {activeMode?.tagline}
                      </p>
                    </div>

                    {/* Focus + mission */}
                    <div>
                      <p className="font-sans text-sm leading-relaxed text-highlight">{insight.focus}</p>
                      <p className="mt-1.5 font-mono text-xs text-highlight/85">↳ {insight.mission}</p>
                    </div>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {insight.stack.map((item, i) => (
                        <span
                          key={item}
                          className="mono-label rounded-full px-2.5 py-1 text-[10px]"
                          style={{
                            background: theme.tag,
                            border: `1px solid ${theme.border}`,
                            color: theme.tagText,
                            animation: `role-tag-in 0.4s ease ${i * 0.05}s both`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Stats row — animated count-up */}
                    <div className="grid grid-cols-3 gap-2">
                      {insight.stats.map((s) => (
                        <CountUpStat
                          key={`${displayMode}-${s.label}`}
                          label={s.label}
                          value={s.value}
                          accent={theme.accent}
                          border={theme.border}
                        />
                      ))}
                    </div>

                    {/* Pillar selector */}
                    <div>
                      <p className="mono-label mb-2 text-[11px] uppercase text-highlight/70">
                        Focus modules
                      </p>
                      <div className="space-y-1.5">
                        {insight.pillars.map((pillar, idx) => {
                          const active = idx === activePillarIdx;
                          return (
                            <button
                              key={pillar.title}
                              type="button"
                              onClick={() => setActivePillarIdx(idx)}
                              className="relative w-full overflow-hidden rounded-xl px-3 py-2 text-left transition-all duration-250"
                              style={{
                                border: `1px solid ${active ? theme.border : "rgba(168,217,184,0.1)"}`,
                                background: active ? theme.tag : "rgba(30,74,58,0.18)",
                                transform: active ? "translateX(3px)" : "translateX(0)",
                              }}
                            >
                              <span
                                className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full transition-all duration-300"
                                style={{ background: theme.accent, opacity: active ? 1 : 0 }}
                              />
                              <div className="flex items-center justify-between pl-1.5">
                                <span
                                  className="mono-label text-xs transition-colors duration-200"
                                  style={{ color: active ? theme.tagText : "rgba(216,236,224,0.7)" }}
                                >
                                  {pillar.title}
                                </span>
                                <span
                                  className="mono-label rounded-full px-2 py-0.5 text-[9px] transition-colors duration-200"
                                  style={{
                                    background: active ? `${theme.accent}20` : "transparent",
                                    color: active ? theme.tagText : "rgba(216,236,224,0.6)",
                                  }}
                                >
                                  {pillar.metric}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Skills + Impact */}
              <div ref={panelRef} className="will-change-transform space-y-4">
                <div data-aos="fade-left" data-aos-delay="200">
                  <div
                    className="glass-card mi-interactive rounded-2xl p-6"
                    style={{ borderColor: light ? `${theme.border}60` : undefined }}
                  >
                    <p className="mono-label mb-3 text-[11px] uppercase text-highlight/70">
                      Skill proficiency
                    </p>
                    <div className="space-y-3">
                      {skills.map((s) => (
                        <SkillBar
                          key={s.name}
                          name={s.name}
                          level={s.level}
                          accent={theme.accent}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div data-aos="fade-left" data-aos-delay="280">
                  <div
                    className="glass-card mi-interactive rounded-2xl p-5"
                    style={{ borderColor: light ? `${theme.border}60` : undefined }}
                  >
                    <p className="mono-label mb-2 text-[11px] uppercase text-highlight/70">Impact</p>
                    <p className="font-sans text-sm leading-relaxed text-highlight/90">{insight.impact}</p>

                    {/* Active module — crossfades when the selected pillar changes */}
                    <div
                      key={`${displayMode}-${activePillar.title}`}
                      className="mt-4 rounded-xl border border-highlight/10 p-3"
                      style={{
                        background: light ? theme.tag : "rgba(30,74,58,0.2)",
                        animation: "role-module-in 0.32s ease both",
                      }}
                    >
                      <p className="mono-label text-[11px] uppercase text-highlight/60">Active module</p>
                      <p className="mt-1 font-display text-lg text-highlight">{activePillar.title}</p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-highlight/80">
                        {activePillar.detail}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="mono-label text-[11px] text-highlight/75">
                          → {activePillar.metric}
                        </span>
                        <button
                          type="button"
                          onClick={() => jumpTo(activePillar.jumpTo)}
                          className="mono-label rounded-lg border border-highlight/15 bg-highlight/5 px-3 py-1 text-[10px] text-highlight/70 transition-all hover:scale-105 hover:border-highlight/25 hover:text-highlight"
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured work */}
        <div data-aos="fade-up" data-aos-delay="380">
          <div
            className="mt-6 glass-card rounded-2xl p-5"
            style={{ borderColor: light ? `${theme.border}60` : undefined }}
          >
            <p className="mono-label mb-3 text-[11px] uppercase text-highlight/70">Featured work</p>
            <div className="grid gap-3 md:grid-cols-2">
              {featured.map((p) => {
                const hovered = hoveredProjectId === p.id;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl px-3 py-3 transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      border: `1px solid ${hovered ? theme.border : "rgba(168,217,184,0.08)"}`,
                      background: hovered ? theme.tag : "rgba(30,74,58,0.15)",
                    }}
                    onMouseEnter={() => setHoveredProjectId(p.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="mono-label text-[10px]" style={{ color: theme.accent }}>▸</span>
                      <p className="text-sm text-highlight/90">{p.title}</p>
                    </div>
                    <p className="mt-1 pl-4 font-sans text-xs leading-relaxed text-highlight/75">
                      {p.shortDescription}
                    </p>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono-label mt-2 ml-4 inline-block text-[10px] transition-opacity hover:opacity-80"
                        style={{ color: theme.accent }}
                      >
                        Live site →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes role-edge-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
        @keyframes role-tag-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes role-module-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
