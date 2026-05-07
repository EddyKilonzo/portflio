"use client";

import { skillsByRole, projects } from "@/content/portfolio";
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
import { LogoLoop } from "@/components/ui/LogoLoop";
import { motionTokens } from "@/lib/motion-tokens";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function labelForSkill(name: string) {
  if (name === "Express") return "Express.js";
  return name;
}

const SKILL_ICON_MAP: Record<string, string> = {
  HTML5: "html",
  CSS3: "css",
  JavaScript: "js",
  TypeScript: "ts",
  Angular: "angular",
  NestJS: "nestjs",
  "Node.js": "nodejs",
  Express: "express",
  PostgreSQL: "postgres",
  Prisma: "prisma",
  WordPress: "wordpress",
  WooCommerce: "woocommerce",
  Elementor: "wordpress",
  Git: "git",
  GitHub: "github",
  Figma: "figma",
  Docker: "docker",
  "VS Code": "vscode",
  React: "react",
  "Next.js": "nextjs",
  Python: "python",
  Linux: "linux",
  Redis: "redis",
  GraphQL: "graphql",
  "Three.js": "threejs",
  "Tailwind CSS": "tailwind",
  Kubernetes: "kubernetes",
  Metasploit: "linux",
  "Burp Suite": "linux",
  Wireshark: "linux",
  Nmap: "linux",
  "Kali Linux": "linux",
  OSINT: "linux",
  "SIEM tools": "linux",
};

function SkillLogo({ name }: { name: string }) {
  const icon = SKILL_ICON_MAP[name];
  if (!icon) {
    return (
      <span className="grid h-5 w-5 place-items-center rounded border border-highlight/20 bg-surface/20 font-mono text-[9px] text-highlight/80">
        {name.slice(0, 1)}
      </span>
    );
  }
  return (
    <Image
      src={`https://skillicons.dev/icons?i=${icon}`}
      alt={`${labelForSkill(name)} logo`}
      width={20}
      height={20}
      className="h-5 w-5 rounded"
      unoptimized
    />
  );
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
  const activeSkill = active ?? null;
  const relatedSet = new Set(
    activeSkill
      ? (skills.find((s) => s.name === activeSkill)?.related ?? [])
      : [],
  );

  function handleNodeClick(e: React.MouseEvent<SVGCircleElement>, name: string) {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: "back.out(2)", transformOrigin: "center" },
    );
    onPick(name);
  }

  const activeConnections = new Set(
    activeSkill
      ? links
          .filter((l) => l.a === activeSkill || l.b === activeSkill)
          .flatMap((l) => [l.a, l.b])
      : [],
  );

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

      {/* Glow lines behind active connections */}
      {activeSkill &&
        links.map((l, i) => {
          const A = pos(l.a);
          const B = pos(l.b);
          if (!A || !B) return null;
          const isActive = l.a === activeSkill || l.b === activeSkill;
          if (!isActive) return null;
          return (
            <line
              key={`glow-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="url(#sk)"
              strokeWidth="4"
              opacity="0.3"
              className="transition-all duration-200"
            />
          );
        })}

      {links.map((l, i) => {
        const A = pos(l.a);
        const B = pos(l.b);
        if (!A || !B) return null;
        const isConnected =
          !activeSkill ||
          l.a === activeSkill ||
          l.b === activeSkill ||
          (relatedSet.has(l.a) && relatedSet.has(l.b));
        return (
          <line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke="url(#sk)"
            strokeWidth={isConnected ? "1.6" : "1"}
            opacity={isConnected ? "0.7" : "0.18"}
            className="transition-all duration-200"
          />
        );
      })}
      <circle cx={center.x} cy={center.y} r="8" fill="#A8D9B8" opacity="0.5" />
      <text
        x={center.x}
        y={center.y + 24}
        textAnchor="middle"
        fill="#a8d9b8"
        fillOpacity="0.75"
        fontSize="10"
        fontFamily="monospace"
      >
        core
      </text>
      {nodes.map((n) => (
        <g key={n.name}>
          {activeSkill === n.name ? (
            <circle
              cx={n.x}
              cy={n.y}
              r="18"
              fill="none"
              stroke="#A8D9B8"
              strokeOpacity="0.45"
              className="animate-pulse"
            />
          ) : null}
          <circle
            cx={n.x}
            cy={n.y}
            r={activeSkill === n.name ? 14 : relatedSet.has(n.name) ? 12 : 10}
            fill={
              activeSkill === n.name
                ? "#2E7A5A"
                : relatedSet.has(n.name)
                  ? "#245c47"
                  : "#1E4A3A"
            }
            stroke="#A8D9B8"
            strokeOpacity={activeSkill === n.name || relatedSet.has(n.name) ? "0.65" : "0.35"}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => onHover(n.name)}
            onMouseLeave={() => onHover(null)}
            onClick={(e) => handleNodeClick(e, n.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(n.name);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Select ${n.name} skill`}
          />
          <text
            x={n.x}
            y={n.y + 28}
            textAnchor="middle"
            fill={activeSkill === n.name || relatedSet.has(n.name) ? "#a8d9b8" : "#a8d9b8"}
            fillOpacity={activeSkill === n.name ? "1" : relatedSet.has(n.name) ? "0.85" : "0.7"}
            fontSize={activeSkill === n.name ? "11" : "9"}
            fontFamily="monospace"
            className="pointer-events-none transition-all duration-200"
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
  const [tab, setTab] = useState<"all" | "developer" | "cyber">("all");
  const [modalSkill, setModalSkill] = useState<{
    name: string;
    level: number;
    related: string[];
    group: "software" | "cyber";
  } | null>(null);
  const sectionAnimRef = useRef<HTMLElement | null>(null);
  const { shouldReduce } = useMotionProfile();

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
  const developerSkills = useMemo(() => {
    const byName = new Map<string, { name: string; level: number; related: string[] }>();
    [...webSkills, ...engineeringSkills].forEach((s) => {
      byName.set(s.name, s);
    });
    return imageSkillOrder
      .map((name) => byName.get(name))
      .filter(Boolean) as { name: string; level: number; related: string[] }[];
  }, [webSkills, engineeringSkills, imageSkillOrder]);
  const developerGraphSkills = useMemo(() => developerSkills.slice(0, 12), [developerSkills]);
  const logoLoopItems = useMemo(
    () =>
      developerSkills
        .map((skill) => ({
          label: labelForSkill(skill.name),
          icon: SKILL_ICON_MAP[skill.name],
        }))
        .filter((item): item is { label: string; icon: string } => Boolean(item.icon)),
    [developerSkills],
  );

  const developerDetail = useMemo(() => {
    const name = hoverSoftware ?? activeSkill;
    if (!name) return null;
    return developerSkills.find((s) => s.name === name) ?? null;
  }, [hoverSoftware, activeSkill, developerSkills]);

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
  }, [developerDetail, cyberDetail]);

  useEffect(() => {
    sectionAnimRef.current = document.getElementById("skills");
  }, []);

  useEffect(() => {
    const sectionEl = sectionAnimRef.current;
    if (!sectionEl) return;
    const heading = sectionEl.querySelectorAll<HTMLElement>("[data-sk-step='heading']");
    const graphs = sectionEl.querySelectorAll<HTMLElement>("[data-sk-step='graph']");
    const bars = sectionEl.querySelectorAll<HTMLElement>("[data-sk-step='bar']");
    const all = Array.from(heading).concat(Array.from(graphs), Array.from(bars));
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 76%",
      once: true,
      onEnter: () => {
        all.forEach((el) => (el.style.willChange = "transform, opacity"));
        if (!shouldReduce) {
          gsap.set(heading, { y: 18, opacity: 0 });
          gsap.set(graphs,  { y: 14, opacity: 0 });
          gsap.set(bars,    { y: 12, opacity: 0 });
        }
        const tl = gsap.timeline({
          onComplete: () => {
            all.forEach((el) => (el.style.willChange = "auto"));
            // Clear GSAP inline transforms from cards so CSS hover states work correctly
            gsap.set(bars, { clearProps: "transform,y,opacity" });
          },
        });
        const base = {
          duration: motionTokens.duration.base,
          ease: "power3.out",
        };
        tl.to(heading, { y: 0, opacity: 1, ...base })
          .to(
            graphs,
            { y: 0, opacity: 1, ...base, stagger: shouldReduce ? 0 : motionTokens.stagger.section },
            "-=0.12",
          )
          .to(
            bars,
            { y: 0, opacity: 1, ...base, stagger: shouldReduce ? 0 : 0.025 },
            "-=0.1",
          );
      },
    });
    return () => st.kill();
  }, [shouldReduce]);

  useEffect(() => {
    const root = barsRef.current;
    if (!root) return;
    const bars = root.querySelectorAll<HTMLElement>("[data-bar]");
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(bars, {
          scaleX: (i, el) => Number(el.getAttribute("data-level")) / 100,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.055,
        });
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
      className="relative overflow-x-hidden py-24 section-bg"
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
        <div data-sk-step="heading">
          <ScrambleTitle
            as="h2"
            text="Developer & Cyber Skills"
            className="glitch-hover mb-4 font-display text-4xl text-highlight md:text-5xl"
          />
        </div>
        <p data-sk-step="heading" className="mb-10 max-w-3xl font-sans text-highlight/70">
          Explore skill clusters with clearer tracks and quick filtering. Pick any skill
          to instantly filter projects, then switch between Developer and Cyber views.
        </p>
        </ParallaxDrift>

        <div className="mb-8 flex flex-wrap items-center gap-2" data-aos="fade-up" data-aos-delay="120">
          <span className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[10px] text-highlight/70">
            Developer: {developerSkills.length}
          </span>
          <span className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[10px] text-highlight/70">
            Cyber: {cyberSkills.length}
          </span>
          {activeSkill ? (
            <button
              type="button"
              className="rounded-full border border-accent/50 px-3 py-1 font-mono text-[10px] text-accent"
              onClick={() => setActiveSkill(null)}
            >
              Clear active skill: {activeSkill}
            </button>
          ) : null}
        </div>

        <div
          className="mb-8 rounded-2xl border border-highlight/15 bg-surface/15 p-4"
          data-aos="fade-up"
          data-aos-delay="180"
        >
          <p className="mb-3 font-mono text-xs text-highlight/55">
            Daily toolkit
          </p>
          <LogoLoop items={logoLoopItems} speedSeconds={28} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div data-sk-step="graph">
            <SkillPanel
              title="Developer Graph"
              skills={developerGraphSkills}
              active={hoverSoftware ?? activeSkill}
              detail={developerDetail}
              detailRef={detailSoftwareRef}
              onHover={setHoverSoftware}
              onPick={(s) => setActiveSkill(activeSkill === s ? null : s)}
            />
          </div>
          <div data-sk-step="graph">
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
                ["developer", "Developer"],
                ["cyber", "Cyber"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id as "all" | "developer" | "cyber")}
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
                ...developerSkills.map((s) => ({ ...s, group: "software" as const })),
                ...cyberSkills.map((s) => ({ ...s, group: "cyber" as const })),
              ]
            : (tab === "developer" ? developerSkills : cyberSkills).map((s) => ({
                ...s,
                group: tab === "developer" ? ("software" as const) : ("cyber" as const),
              }))).map((s, i) => (
            <div
              key={`${s.group}-${s.name}`}
              data-sk-step="bar"
              className={`glass-card cursor-pointer rounded-xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.025] hover:border-highlight/25 hover:shadow-[0_8px_32px_rgba(168,217,184,0.12)] ${bentoSpans[i % bentoSpans.length]}`}
              onClick={() => setModalSkill(s)}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SkillLogo name={s.name} />
                  <ScrambleTitle
                    text={labelForSkill(s.name)}
                    className="font-mono text-sm text-highlight"
                  />
                </div>
                <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                  s.group === "software"
                    ? "border-eng/40 text-eng"
                    : "border-cyber/40 text-cyber"
                }`}>
                  {s.group === "software" ? "Dev" : "Cyber"}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface/40">
                <div
                  data-bar
                  data-level={s.level}
                  className={`h-full w-full origin-left rounded-full ${s.group === "software" ? "bg-gradient-to-r from-eng/60 to-accent" : "bg-gradient-to-r from-cyber/60 to-orange-400/80"}`}
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <p className="mt-2 font-mono text-[9px] text-highlight/35">click to explore →</p>
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
            ? `${modalSkill.group === "software" ? "Developer" : "Cybersecurity"} skill`
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
            <div className="flex items-center gap-2">
              <SkillLogo name={modalSkill.name} />
              <p className="font-display text-2xl text-highlight">
                {labelForSkill(modalSkill.name)}
              </p>
            </div>
            <p className="font-mono text-sm text-accent">Level {modalSkill.level}%</p>
            <p className="font-mono text-xs text-highlight/50">Related skills</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-highlight/80">
              {modalSkill.related.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <SkillLogo name={r} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            {(() => {
              const relatedProjects = projects.filter((p) => p.tech.includes(modalSkill.name));
              if (!relatedProjects.length) return null;
              return (
                <>
                  <p className="font-mono text-xs text-highlight/50 mt-4">Projects built with this</p>
                  <ul className="space-y-2">
                    {relatedProjects.map((p) => (
                      <li key={p.id} className="flex items-start gap-2 rounded-lg border border-highlight/10 bg-surface/20 px-3 py-2">
                        <span className="font-mono text-sm text-highlight">{p.title}</span>
                        <span className="ml-auto shrink-0 font-mono text-[10px] text-accent/70">{p.category}</span>
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()}
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
      <p className="font-mono text-xs text-highlight/55">
        Click any node to reveal its details below.
      </p>
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
            <div className="mt-1 flex items-center gap-2">
              <SkillLogo name={detail.name} />
              <p className="font-display text-2xl text-highlight">{labelForSkill(detail.name)}</p>
            </div>
            <p className="mt-2 font-mono text-sm text-accent">
              Level {detail.level}%
            </p>
            <p className="mt-4 font-mono text-xs text-highlight/50">
              Related
            </p>
            <ul className="mt-1 list-inside list-disc text-sm text-highlight/80">
              {detail.related.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <SkillLogo name={r} />
                  <span>{r}</span>
                </li>
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
