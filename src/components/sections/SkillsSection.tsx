"use client";

import { skillsByRole } from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ScrambleTitle } from "@/components/ui/ScrambleTitle";
import { AppModal } from "@/components/ui/AppModal";

gsap.registerPlugin(ScrollTrigger);

function labelForSkill(name: string) {
  if (name === "Express") return "Express.js";
  return name;
}

function SkillGraph({
  skills,
  active,
  onHover,
  onPick,
}: {
  skills: { name: string; related: string[] }[];
  active: string | null;
  onHover: (s: string | null) => void;
  onPick: (s: string) => void;
}) {
  const names = skills.map((s) => s.name);
  const center = { x: 200, y: 160 };
  const radius = 110;
  const nodes = names.map((name, i) => {
    const a = (i / names.length) * Math.PI * 2 - Math.PI / 2;
    return {
      name,
      x: center.x + Math.cos(a) * radius,
      y: center.y + Math.sin(a) * radius,
    };
  });

  const links: { a: string; b: string }[] = [];
  skills.forEach((s) => {
    s.related.forEach((r) => {
      if (names.includes(r)) links.push({ a: s.name, b: r });
    });
  });

  const pos = (n: string) => nodes.find((x) => x.name === n)!;

  return (
    <svg
      viewBox="0 0 400 320"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Skill network"
    >
      <defs>
        <linearGradient id="sk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E7A5A" />
          <stop offset="100%" stopColor="#A8D9B8" />
        </linearGradient>
      </defs>
      {links.map((l, i) => {
        const A = pos(l.a);
        const B = pos(l.b);
        if (!A || !B) return null;
        return (
          <line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke="url(#sk)"
            strokeWidth="1"
            opacity="0.35"
          />
        );
      })}
      <circle cx={center.x} cy={center.y} r="8" fill="#A8D9B8" opacity="0.5" />
      <text
        x={center.x}
        y={center.y + 24}
        textAnchor="middle"
        className="fill-highlight/50 font-mono text-[10px]"
      >
        core
      </text>
      {nodes.map((n) => (
        <g key={n.name}>
          <circle
            cx={n.x}
            cy={n.y}
            r={active === n.name ? 14 : 10}
            fill={active === n.name ? "#2E7A5A" : "#1E4A3A"}
            stroke="#A8D9B8"
            strokeOpacity="0.35"
            className="cursor-pointer transition-all"
            onMouseEnter={() => onHover(n.name)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(n.name)}
          />
          <text
            x={n.x}
            y={n.y + 28}
            textAnchor="middle"
            className="pointer-events-none fill-highlight/70 font-mono text-[9px]"
          >
            {n.name.length > 10 ? n.name.slice(0, 9) + "…" : n.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function SkillsSection() {
  const sectionRef = useSectionReveal(1);
  const { activeSkill, setActiveSkill } = useSkillFilter();
  const [hoverSoftware, setHoverSoftware] = useState<string | null>(null);
  const [hoverCyber, setHoverCyber] = useState<string | null>(null);
  const detailSoftwareRef = useRef<HTMLDivElement>(null);
  const detailCyberRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"all" | "software" | "cyber">("all");
  const [modalSkill, setModalSkill] = useState<{
    name: string;
    level: number;
    related: string[];
    group: "software" | "cyber";
  } | null>(null);

  const webSkills = skillsByRole.web;
  const engineeringSkills = skillsByRole.engineering;
  const cyberSkills = skillsByRole.cyber;
  const imageSkillOrder = useMemo(
    () => [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "Angular",
      "NestJS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "WordPress",
      "WooCommerce",
      "Elementor",
      "Git",
      "GitHub",
      "Figma",
      "Docker",
      "VS Code",
    ],
    [],
  );
  const softwareSkills = useMemo(() => {
    const byName = new Map<string, { name: string; level: number; related: string[] }>();
    [...webSkills, ...engineeringSkills].forEach((s) => {
      byName.set(s.name, s);
    });
    return imageSkillOrder
      .map((name) => byName.get(name))
      .filter(Boolean) as { name: string; level: number; related: string[] }[];
  }, [webSkills, engineeringSkills, imageSkillOrder]);
  const softwareGraphSkills = useMemo(() => softwareSkills.slice(0, 12), [softwareSkills]);

  const softwareDetail = useMemo(() => {
    const name = hoverSoftware ?? activeSkill;
    if (!name) return null;
    return softwareSkills.find((s) => s.name === name) ?? null;
  }, [hoverSoftware, activeSkill, softwareSkills]);

  const cyberDetail = useMemo(() => {
    const name = hoverCyber ?? activeSkill;
    if (!name) return null;
    return cyberSkills.find((s) => s.name === name) ?? null;
  }, [hoverCyber, activeSkill, cyberSkills]);

  useEffect(() => {
    const cards = [detailSoftwareRef.current, detailCyberRef.current].filter(
      Boolean,
    ) as HTMLDivElement[];
    if (!cards.length) return;
    animate(cards, {
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 300,
      ease: "out(3)",
      delay: (_el, i) => i * 40,
    });
  }, [softwareDetail, cyberDetail]);

  useEffect(() => {
    const root = barsRef.current;
    if (!root) return;
    const bars = root.querySelectorAll<HTMLElement>("[data-bar]");
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          bars,
          { width: "0%" },
          {
            width: (i, el) => `${el.getAttribute("data-level")}%`,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.1,
          },
        );
      },
    });
    return () => st.kill();
  }, []);

  const bentoSpans = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1",
    "md:col-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-2",
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-section="skills"
      className="relative overflow-hidden py-24 section-bg"
      style={
        { "--section-tint": "rgba(76, 158, 255, 0.05)" } as React.CSSProperties
      }
    >
      <SectionNumber n="03" sectionId="skills" />
      <DecorNetwork />

      <ParallaxDrift
        className="pointer-events-none absolute -right-8 top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl md:right-10 lg:top-24"
        speed={0.85}
        pointerNudge={0.2}
      >
        <span className="sr-only">Decorative field</span>
      </ParallaxDrift>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.35} pointerNudge={0.12} className="relative inline-block">
        <ScrambleTitle
          as="h2"
          text="Software Engineering & Cyber Skills"
          className="glitch-hover mb-4 font-display text-4xl text-highlight md:text-5xl"
        />
        <p className="mb-10 max-w-3xl font-sans text-highlight/70">
          Interactive skill explorer with graph nodes, category cards, and modal details.
          Pick a skill to filter projects, or use tabs to view all/software/cyber groups.
        </p>
        </ParallaxDrift>

        <div className="grid gap-8 lg:grid-cols-2">
          <div data-aos="fade-right">
            <SkillPanel
              title="Software Engineering Graph"
              skills={softwareGraphSkills}
              active={hoverSoftware ?? activeSkill}
              detail={softwareDetail}
              detailRef={detailSoftwareRef}
              onHover={setHoverSoftware}
              onPick={(s) => setActiveSkill(activeSkill === s ? null : s)}
            />
          </div>
          <div data-aos="fade-left">
            <SkillPanel
              title="Cyber Graph"
              skills={cyberSkills}
              active={hoverCyber ?? activeSkill}
              detail={cyberDetail}
              detailRef={detailCyberRef}
              onHover={setHoverCyber}
              onPick={(s) => setActiveSkill(activeSkill === s ? null : s)}
            />
          </div>
        </div>
        {activeSkill ? (
          <p className="mt-4 font-mono text-xs text-accent">
            Filtering projects by: {activeSkill}{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setActiveSkill(null)}
            >
              clear
            </button>
          </p>
        ) : null}

        <div
          ref={barsRef}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ["all", "All Skills"],
                ["software", "Software Eng"],
                ["cyber", "Cyber"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id as "all" | "software" | "cyber")}
                  className={`rounded-full border px-3 py-1 font-mono text-xs ${
                    tab === id
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {(tab === "all"
            ? [
                ...softwareSkills.map((s) => ({ ...s, group: "software" as const })),
                ...cyberSkills.map((s) => ({ ...s, group: "cyber" as const })),
              ]
            : (tab === "software" ? softwareSkills : cyberSkills).map((s) => ({
                ...s,
                group: tab === "software" ? ("software" as const) : ("cyber" as const),
              }))).map((s, i) => (
            <div
              key={`${s.group}-${s.name}`}
              data-aos="zoom-in"
              data-aos-delay={(i % 8) * 50}
              className={`glass-card cursor-pointer rounded-xl p-4 transition-transform hover:-translate-y-1 ${bentoSpans[i % bentoSpans.length]}`}
              onClick={() => setModalSkill(s)}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <ScrambleTitle
                  text={labelForSkill(s.name)}
                  className="font-mono text-sm text-highlight"
                />
                <span className="rounded-full border border-highlight/15 px-2 py-0.5 font-mono text-[10px] text-highlight/70">
                  {s.group === "software" ? "Software" : "Cyber"}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface/40">
                <div
                  data-bar
                  data-level={s.level}
                  className="h-full rounded-full bg-surfaceMid"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <AppModal
        open={!!modalSkill}
        onClose={() => setModalSkill(null)}
        title={modalSkill?.name ?? "Skill"}
        subtitle={
          modalSkill
            ? `${modalSkill.group === "software" ? "Software Engineering" : "Cybersecurity"} skill`
            : undefined
        }
        footer={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setModalSkill(null)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-ghost border-accent/60 text-accent"
              onClick={() => {
                if (modalSkill) {
                  setActiveSkill(modalSkill.name);
                }
                setModalSkill(null);
              }}
            >
              Filter Projects
            </button>
          </>
        }
      >
        {modalSkill ? (
          <div className="space-y-3">
            <p className="font-display text-2xl text-highlight">
              {labelForSkill(modalSkill.name)}
            </p>
            <p className="font-mono text-sm text-accent">Level {modalSkill.level}%</p>
            <p className="font-mono text-xs text-highlight/50">Related skills</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-highlight/80">
              {modalSkill.related.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </AppModal>
    </section>
  );
}

function SkillPanel({
  title,
  skills,
  active,
  detail,
  detailRef,
  onHover,
  onPick,
}: {
  title: string;
  skills: { name: string; level: number; related: string[] }[];
  active: string | null;
  detail: { name: string; level: number; related: string[] } | null;
  detailRef: RefObject<HTMLDivElement>;
  onHover: (skill: string | null) => void;
  onPick: (skill: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-highlight">{title}</h3>
      <div className="glass-card rounded-2xl p-4">
        <SkillGraph skills={skills} active={active} onHover={onHover} onPick={onPick} />
      </div>
      <div className="relative min-h-[200px]">
        {detail ? (
          <div
            key={detail.name}
            ref={detailRef}
            className="glass-card absolute inset-0 rounded-2xl p-4 will-change-transform"
          >
            <p className="font-mono text-xs text-highlight/50">Skill</p>
            <p className="font-display text-2xl text-highlight">{labelForSkill(detail.name)}</p>
            <p className="mt-2 font-mono text-sm text-accent">
              Level {detail.level}%
            </p>
            <p className="mt-4 font-mono text-xs text-highlight/50">
              Related
            </p>
            <ul className="mt-1 list-inside list-disc text-sm text-highlight/80">
              {detail.related.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="glass-card flex h-full items-center justify-center rounded-2xl p-6 text-center font-mono text-sm text-highlight/50">
            Hover or select a node
          </div>
        )}
      </div>
    </div>
  );
}
