"use client";

import {
  profile,
  projects,
  skillsByRole,
  type RoleMode,
} from "@/content/portfolio";
import { useRole } from "@/context/RoleContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { animate } from "animejs";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { SplittingHeading } from "@/components/ui/SplittingHeading";

const RoleParticles = dynamic(
  () => import("./RoleParticles").then((m) => m.RoleParticles),
  { ssr: false },
);

const modes: { id: RoleMode; label: string; icon: string }[] = [
  { id: "cyber",       label: "Cybersecurity",   icon: "🛡" },
  { id: "engineering", label: "Software Engineering", icon: "⚙" },
  { id: "web",         label: "Web Development",  icon: "✦" },
];

/** Per-role accent colors */
const roleTheme: Record<RoleMode, {
  accent: string;
  accentRgb: string;
  glow: string;
  tag: string;
  tagText: string;
  border: string;
  badgeBg: string;
}> = {
  cyber: {
    accent:    "#ff4c4c",
    accentRgb: "255 76 76",
    glow:      "rgba(255,76,76,0.18)",
    tag:       "rgba(255,76,76,0.12)",
    tagText:   "#ff4c4c",
    border:    "rgba(255,76,76,0.25)",
    badgeBg:   "rgba(255,76,76,0.08)",
  },
  engineering: {
    accent:    "#2e7a5a",
    accentRgb: "46 122 90",
    glow:      "rgba(46,122,90,0.2)",
    tag:       "rgba(46,122,90,0.12)",
    tagText:   "#a8d9b8",
    border:    "rgba(46,122,90,0.3)",
    badgeBg:   "rgba(46,122,90,0.08)",
  },
  web: {
    accent:    "#4c9eff",
    accentRgb: "76 158 255",
    glow:      "rgba(76,158,255,0.18)",
    tag:       "rgba(76,158,255,0.12)",
    tagText:   "#4c9eff",
    border:    "rgba(76,158,255,0.25)",
    badgeBg:   "rgba(76,158,255,0.08)",
  },
};

const roleInsights: Record<
  RoleMode,
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
    focus: "Detection engineering, incident response, and practical offensive simulation.",
    impact: "Reduced triage noise and improved response confidence in cloud-native environments.",
    stack: ["SIEM", "Threat Hunting", "Purple Team", "Hardening"],
    mission: "Secure systems by design, not just post-incident patching.",
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
    focus: "APIs, backend reliability, and delivery pipelines for high-availability products.",
    impact: "Lower latency, stronger observability, and safer release workflows.",
    stack: ["Python", "APIs", "Cloud Services", "Data Stores", "CI/CD"],
    mission: "Ship resilient systems that hold up under scale and change.",
    stats: [
      { label: "Services built",  value: "8+"  },
      { label: "Latency cut",     value: "60%" },
      { label: "Pipeline runs",   value: "500+" },
    ],
    pillars: [
      {
        title: "API Reliability",
        detail: "Design contracts, retries, and failure boundaries that keep services stable under load.",
        metric: "Higher uptime",
        jumpTo: "projects",
      },
      {
        title: "Delivery Velocity",
        detail: "Use CI/CD guardrails and progressive release strategies to ship faster with confidence.",
        metric: "Safer releases",
        jumpTo: "experience",
      },
      {
        title: "Observability",
        detail: "Instrument traces, logs, and SLO-driven alerts to cut debugging time in production.",
        metric: "Shorter MTTR",
        jumpTo: "reports",
      },
    ],
  },
  web: {
    focus: "Frontend architecture, interaction quality, and performance-first UX.",
    impact: "Faster interfaces with clearer journeys and stronger user trust.",
    stack: ["React", "Design Systems", "Motion", "Accessibility"],
    mission: "Make complex products feel intuitive without sacrificing speed.",
    stats: [
      { label: "Apps shipped",    value: "10+" },
      { label: "Perf score avg",  value: "92"  },
      { label: "Components built","value": "150+" },
    ],
    pillars: [
      {
        title: "Interaction Design",
        detail: "Craft meaningful UI feedback loops so users always understand the next step.",
        metric: "Clearer user flows",
        jumpTo: "projects",
      },
      {
        title: "Performance",
        detail: "Optimize render paths and bundle strategy to maintain speed across devices.",
        metric: "Faster page feel",
        jumpTo: "skills",
      },
      {
        title: "Accessible UI",
        detail: "Build keyboard- and screen-reader-friendly components from the start.",
        metric: "Inclusive experiences",
        jumpTo: "contact",
      },
    ],
  },
};

/** Animated skill bar */
function SkillBar({ name, level, accent }: { name: string; level: number; accent: string }) {
  const barRef = useRef<HTMLDivElement>(null);
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
          ref={barRef}
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

/** Stat counter card */
function StatCard({ label, value, accent, border }: { label: string; value: string; accent: string; border: string }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl px-3 py-2.5 text-center"
      style={{ border: `1px solid ${border}`, background: `${accent}08` }}
    >
      <span className="font-display text-xl font-bold" style={{ color: accent }}>{value}</span>
      <span className="mt-0.5 font-mono text-[11px] text-highlight/75">{label}</span>
    </div>
  );
}

export function RoleSwitcherSection() {
  const sectionRef = useSectionReveal(0);
  const { mode, setMode } = useRole();
  const panelRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState(mode);
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const switching = useRef(false);

  const theme = roleTheme[displayMode];

  useEffect(() => {
    setDisplayMode(mode);
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
          setDisplayMode(next);
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

  const skills = skillsByRole[displayMode].slice(0, 8);
  const featured = projects.filter((p) => p.roleMode === displayMode).slice(0, 2);
  const insight = roleInsights[displayMode];
  const activePillar = useMemo(
    () => insight.pillars[activePillarIdx] ?? insight.pillars[0],
    [insight.pillars, activePillarIdx],
  );

  useEffect(() => {
    setActivePillarIdx(0);
  }, [displayMode]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      id="roles"
      data-section="roles"
      className="relative overflow-visible py-24 section-bg"
      style={{ "--section-tint": "rgba(46, 122, 90, 0.04)" } as React.CSSProperties}
    >
      <SectionNumber n="02" sectionId="roles" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ScrollReveal from="up">
          <SplittingHeading
            as="h2"
            text="Role switcher"
            className="splitting-chars mb-4 font-display text-4xl text-highlight md:text-5xl"
          />
          <p className="mb-10 max-w-2xl font-sans text-highlight/85">
            One operator, three lenses — flip the stack to see how I show up across
            security, systems, and the web.
          </p>
        </ScrollReveal>

        {/* Mobile tabs */}
        <ScrollReveal from="up" delay={0.1}>
          <div className="mb-8 flex flex-wrap gap-2 lg:hidden">
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
                    border: `1px solid ${active ? t.border : "rgba(168,217,184,0.35)"}`,
                    background: active ? t.tag : "rgba(255,255,255,0.88)",
                    color: active ? t.tagText : "rgba(12, 32, 24, 0.98)",
                    boxShadow: active ? `0 0 14px ${t.glow}` : "0 1px 0 rgba(0,0,0,0.25)",
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
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start">
          {/* Desktop mini sidebar tabs */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2 rounded-2xl border border-highlight/15 bg-bg/40 p-2 backdrop-blur-sm">
              {modes.map((m) => {
                const t = roleTheme[m.id];
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className="relative w-full rounded-xl px-3 py-2 text-left font-mono text-xs font-semibold transition-all duration-300"
                    style={{
                      border: `1px solid ${active ? t.border : "rgba(168,217,184,0.25)"}`,
                      background: active ? t.tag : "rgba(255,255,255,0.88)",
                      color: active ? t.tagText : "rgba(12, 32, 24, 0.98)",
                      boxShadow: active ? `0 0 12px ${t.glow}` : "none",
                    }}
                  >
                    <span className="mr-1.5">{m.icon}</span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* ── LEFT PANEL: Identity + Interactive ── */}
              <ScrollReveal from="left" delay={0.15}>
                <div
                  className="glass-card mi-interactive relative min-h-[340px] overflow-hidden rounded-2xl p-6"
                  style={{
                    borderColor: theme.border,
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
                    transition: "border-color 0.5s ease",
                  }}
                >
                  <RoleParticles mode={displayMode} />

                  {/* Themed radial glow */}
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
                        <p className="mono-label text-xs" style={{ color: theme.accent, opacity: 0.95 }}>
                          {"// identity"}
                        </p>
                        {/* Live pulse badge */}
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
                        {modes.find((x) => x.id === displayMode)?.icon}{" "}
                        {modes.find((x) => x.id === displayMode)?.label}
                      </p>
                    </div>

                    {/* Focus + mission */}
                    <div>
                      <p className="font-sans text-sm leading-relaxed text-highlight">{insight.focus}</p>
                      <p className="mt-1.5 font-mono text-xs text-highlight/85">↳ {insight.mission}</p>
                    </div>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {insight.stack.map((item) => (
                        <span
                          key={item}
                          className="mono-label rounded-full px-2.5 py-1 text-[10px] transition-colors"
                          style={{
                            background: theme.tag,
                            border: `1px solid ${theme.border}`,
                            color: theme.tagText,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      {insight.stats.map((s) => (
                        <StatCard
                          key={s.label}
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
                          const hovered = idx === hoveredPillar;
                          return (
                            <button
                              key={pillar.title}
                              type="button"
                              onClick={() => setActivePillarIdx(idx)}
                              onMouseEnter={() => setHoveredPillar(idx)}
                              onMouseLeave={() => setHoveredPillar(null)}
                              className="w-full rounded-xl px-3 py-2 text-left transition-all duration-200"
                              style={{
                                border: `1px solid ${active || hovered ? theme.border : "rgba(168,217,184,0.08)"}`,
                                background:
                                  active
                                    ? theme.tag
                                    : hovered
                                      ? "rgba(255,255,255,0.95)"
                                      : "rgba(255,255,255,0.88)",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="mono-label text-xs"
                                  style={{ color: active ? theme.tagText : "rgba(16, 36, 28, 0.96)" }}
                                >
                                  {active ? "▶ " : "  "}{pillar.title}
                                </span>
                                <span
                                  className="mono-label rounded-full px-2 py-0.5 text-[9px]"
                                  style={{
                                    background: active ? `${theme.accent}20` : "transparent",
                                    color: active ? theme.accent : "rgba(30, 60, 48, 0.82)",
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
              </ScrollReveal>

              {/* ── RIGHT PANEL: Skills + Impact + Projects ── */}
              <div ref={panelRef} className="will-change-transform space-y-4">
                <ScrollReveal from="right" delay={0.2}>
                  <div
                    className="glass-card mi-interactive rounded-2xl p-6"
                    style={{ borderColor: `${theme.border}60` }}
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
                </ScrollReveal>

                <ScrollReveal from="right" delay={0.28}>
                  <div
                    className="glass-card mi-interactive rounded-2xl p-5"
                    style={{ borderColor: `${theme.border}60` }}
                  >
                    <p className="mono-label mb-2 text-[11px] uppercase text-highlight/70">Impact</p>
                    <p className="font-sans text-sm leading-relaxed text-highlight/90">{insight.impact}</p>

                    {/* Active pillar detail */}
                    <div
                      className="mt-4 rounded-xl p-3"
                      style={{ border: `1px solid ${theme.border}`, background: theme.tag }}
                    >
                      <p className="mono-label text-[11px] uppercase text-highlight/70">Active module</p>
                      <p className="mt-1 font-display text-lg text-highlight">{activePillar.title}</p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-highlight/85">
                        {activePillar.detail}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="mono-label text-[11px]" style={{ color: theme.accent }}>
                          → {activePillar.metric}
                        </span>
                        <button
                          type="button"
                          onClick={() => jumpTo(activePillar.jumpTo)}
                          className="mono-label rounded-lg px-3 py-1 text-[10px] transition-all hover:scale-105"
                          style={{
                            border: `1px solid ${theme.border}`,
                            color: theme.tagText,
                            background: `${theme.accent}10`,
                          }}
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        <ScrollReveal from="up" delay={0.38}>
          <div
            className="mt-6 glass-card rounded-2xl p-5"
            style={{ borderColor: `${theme.border}60` }}
          >
            <p className="mono-label mb-3 text-[11px] uppercase text-highlight/70">Featured work</p>
            <div className="grid gap-3 md:grid-cols-2">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-xl px-3 py-3 transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    border: `1px solid rgba(168,217,184,0.08)`,
                    background: "rgba(30,74,58,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
                    (e.currentTarget as HTMLDivElement).style.background = theme.tag;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,217,184,0.08)";
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(30,74,58,0.15)";
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="mono-label text-[10px]" style={{ color: theme.accent }}>▸</span>
                    <p className="text-sm text-highlight/90">{p.title}</p>
                  </div>
                  <p className="mt-1 pl-4 font-sans text-xs leading-relaxed text-highlight/75">
                    {p.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
