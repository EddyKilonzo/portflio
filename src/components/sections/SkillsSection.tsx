"use client";

import { skillsByRole, projects } from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { CountUp } from "@/components/ui/CountUp";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { AppModal } from "@/components/ui/AppModal";
import Image from "next/image";

/* Animated proficiency bar + live counter for the skill detail modal */
function ModalProficiencyBar({ level, group }: { level: number; group: "developer" | "cyber" }) {
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const proxy = { val: 0 };
    const tween = gsap.to(proxy, {
      val: level,
      duration: 1.3,
      ease: "expo.out",
      delay: 0.15,
      onUpdate: () => {
        const v = Math.round(proxy.val);
        bar.style.width = `${v}%`;
        if (numRef.current) numRef.current.textContent = `${v}%`;
      },
    });
    return () => { tween.kill(); };
  }, [level]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] text-highlight/50">Proficiency</span>
        <span ref={numRef} className="font-mono text-xs text-accent">0%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface/40">
        <div
          ref={barRef}
          className={`h-full rounded-full ${group === "cyber" ? "bg-gradient-to-r from-cyber/60 to-orange-400" : "bg-gradient-to-r from-eng/60 to-accent"}`}
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

// skillicons.dev slugs
const SKILL_ICON_MAP: Record<string, string> = {
  HTML5: "html", CSS3: "css", JavaScript: "js", TypeScript: "ts",
  Angular: "angular", NestJS: "nestjs", "Node.js": "nodejs", Express: "express",
  PostgreSQL: "postgres", Prisma: "prisma", WordPress: "wordpress",
  WooCommerce: "woocommerce", Elementor: "wordpress", Git: "git",
  GitHub: "github", Figma: "figma", Docker: "docker", "VS Code": "vscode",
  React: "react", "Next.js": "nextjs", Python: "python", Linux: "linux",
  Redis: "redis", GraphQL: "graphql", "Three.js": "threejs",
  "Tailwind CSS": "tailwind", Kubernetes: "kubernetes", Bash: "bash",
  "Kali Linux": "kali",
};

// cdn.simpleicons.org slugs — cybersec tools not on skillicons
// color suffix /d8ece0 matches --highlight for dark-theme visibility
const SIMPLEICONS_MAP: Record<string, string> = {
  Wireshark:  "wireshark",
  Metasploit: "metasploit",
  Nmap:       "nmap",
  "Burp Suite": "portswigger",
};

function SkillLogo({ name, size = 20 }: { name: string; size?: number }) {
  const skillIcon = SKILL_ICON_MAP[name];
  const simpleIcon = SIMPLEICONS_MAP[name];

  if (skillIcon) {
    return (
      <Image
        src={`https://skillicons.dev/icons?i=${skillIcon}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="rounded shrink-0"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }

  if (simpleIcon) {
    // Two color variants toggled by theme — white-ish icons vanish on the light bg
    return (
      <>
        <Image
          src={`https://cdn.simpleicons.org/${simpleIcon}/d8ece0`}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="icon-on-dark shrink-0 opacity-80"
          style={{ width: size, height: size }}
          unoptimized
        />
        <Image
          src={`https://cdn.simpleicons.org/${simpleIcon}/0a3d1f`}
          alt=""
          aria-hidden
          width={size}
          height={size}
          className="icon-on-light shrink-0 opacity-80"
          style={{ width: size, height: size }}
          unoptimized
        />
      </>
    );
  }

  // Styled text badge for tools with no external icon
  const abbr = name
    .split(/[\s-]/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="grid place-items-center rounded-md border border-cyber/30 bg-cyber/10 font-display font-bold text-cyber shrink-0 tracking-tight"
    >
      {abbr}
    </span>
  );
}

type SkillItem = { name: string; level: number; related: string[] };

/* ── Marquee chip (original view) ──────────────────────────────────────── */
function SkillChip({
  skill, group, isActive, onClick,
}: {
  skill: SkillItem; group: "developer" | "cyber"; isActive: boolean; onClick: () => void;
}) {
  const borderColor = isActive
    ? group === "cyber" ? "border-cyber/70 bg-cyber/12 text-cyber" : "border-eng/70 bg-eng/12 text-eng"
    : "border-highlight/15 bg-surface/10 text-highlight/70 hover:border-highlight/30 hover:text-highlight/90";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${borderColor}`}
    >
      <SkillLogo name={skill.name} size={18} />
      <span className="font-sans text-xs whitespace-nowrap">{skill.name}</span>
      <div className="h-1 w-10 overflow-hidden rounded-full bg-surface/40">
        <div
          className={`skill-bar-fill h-full rounded-full ${group === "cyber" ? "bg-gradient-to-r from-cyber/60 to-orange-400/70" : "bg-gradient-to-r from-eng/60 to-accent/80"}`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </button>
  );
}

function MarqueeRow({
  skills, group, direction = "left", speed = 38, activeSkill, onPick,
}: {
  skills: SkillItem[]; group: "developer" | "cyber"; direction?: "left" | "right";
  speed?: number; activeSkill: string | null; onPick: (name: string) => void;
}) {
  const doubled = [...skills, ...skills];
  const animName = direction === "left" ? "marquee-left" : "marquee-right";
  return (
    <div className="overflow-hidden py-1" aria-label={`${group} skills`}>
      <div
        className="flex gap-3 hover:[animation-play-state:paused]"
        style={{ width: "max-content", animation: `${animName} ${speed}s linear infinite` }}
      >
        {doubled.map((skill, i) => (
          <SkillChip
            key={`${skill.name}-${i}`}
            skill={skill}
            group={group}
            isActive={activeSkill === skill.name}
            onClick={() => onPick(skill.name)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Web/graph view ─────────────────────────────────────────────────────── */
type GraphNode = SkillItem & { x: number; y: number; size: number };
type GraphEdge = { from: string; to: string; x1: number; y1: number; x2: number; y2: number };

/** Tiny deterministic hash → 0..1, used to jitter ring positions organically */
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

/** Radial web layout: strongest skill in the middle, rings outward (in %). */
function layoutGraph(skills: SkillItem[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const sorted = [...skills].sort((a, b) => b.level - a.level);
  const nodes: GraphNode[] = [];
  const RINGS = [
    { capacity: 1, radius: 0 },
    { capacity: 7, radius: 21 },
    { capacity: 13, radius: 36 },
    { capacity: 24, radius: 46 },
  ];
  let placed = 0;
  for (let r = 0; r < RINGS.length && placed < sorted.length; r++) {
    const ring = RINGS[r]!;
    const inRing = Math.min(ring.capacity, sorted.length - placed);
    for (let i = 0; i < inRing; i++) {
      const skill = sorted[placed + i]!;
      const jitter = hash01(skill.name);
      const angle = ((i + (r % 2 ? 0.5 : 0)) / inRing) * Math.PI * 2 - Math.PI / 2 + (jitter - 0.5) * 0.35;
      const radius = ring.radius === 0 ? 0 : ring.radius + (jitter - 0.5) * 5;
      nodes.push({
        ...skill,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        size: Math.max(54, Math.min(84, Math.round(skill.level * 0.5 + 30))),
      });
    }
    placed += inRing;
  }

  const byName = new Map(nodes.map((n) => [n.name, n]));
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const addEdge = (a: GraphNode, b: GraphNode) => {
    const key = [a.name, b.name].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ from: a.name, to: b.name, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  };
  const center = nodes[0];
  for (const n of nodes) {
    let connected = false;
    for (const rel of n.related) {
      const other = byName.get(rel);
      if (other && other !== n) { addEdge(n, other); connected = true; }
    }
    // Orphans hook into the hub so the web stays connected
    if (!connected && center && n !== center) addEdge(n, center);
  }
  return { nodes, edges };
}

function SkillGraph({
  skills, group, activeSkill, onPick, label,
}: {
  skills: SkillItem[]; group: "developer" | "cyber";
  activeSkill: string | null; onPick: (name: string) => void; label: string;
}) {
  const { nodes, edges } = useMemo(() => layoutGraph(skills), [skills]);
  const [hovered, setHovered] = useState<string | null>(null);

  const groupColor = group === "cyber" ? "var(--cyber)" : "var(--eng)";
  const groupRgb = group === "cyber" ? "var(--rgb-cyber)" : "var(--rgb-eng)";
  const focus = hovered ?? activeSkill;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${group === "cyber" ? "text-cyber/70" : "text-eng/70"}`}>
          {label}
        </span>
        <span className={`h-px flex-1 ${group === "cyber" ? "bg-cyber/15" : "bg-eng/15"}`} />
        <span className="font-mono text-[10px] text-highlight/60">{skills.length} skills</span>
      </div>

      <div className="relative w-full" style={{ height: "min(560px, 78vw)" }}>
        {/* Edges */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {edges.map((e) => {
            const lit = focus !== null && (e.from === focus || e.to === focus);
            const dim = focus !== null && !lit;
            return (
              <line
                key={`${e.from}|${e.to}`}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={lit ? `rgb(${groupRgb})` : "rgb(var(--rgb-highlight))"}
                strokeOpacity={lit ? 0.55 : dim ? 0.05 : 0.14}
                strokeWidth={lit ? 0.4 : 0.22}
                vectorEffect="non-scaling-stroke"
                style={{ transition: "stroke-opacity 200ms ease, stroke 200ms ease" }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((n) => {
          const isActive = activeSkill === n.name;
          const isFocus = focus === n.name;
          const isNeighbor =
            focus !== null && !isFocus &&
            edges.some((e) => (e.from === focus && e.to === n.name) || (e.to === focus && e.from === n.name));
          const dimmed = focus !== null && !isFocus && !isNeighbor;
          return (
            <button
              key={n.name}
              type="button"
              onClick={() => onPick(n.name)}
              onMouseEnter={() => setHovered(n.name)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.name)}
              onBlur={() => setHovered(null)}
              title={`${n.name} — ${n.level}%`}
              className="absolute flex flex-col items-center justify-center rounded-full transition-[transform,opacity,box-shadow] duration-200 hover:scale-110 focus-visible:outline-none"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                width: n.size,
                height: n.size,
                transform: "translate(-50%, -50%)",
                background: isActive || isFocus
                  ? `rgb(${groupRgb} / 0.14)`
                  : "rgb(var(--rgb-surface) / 0.6)",
                border: `1.5px solid ${isActive || isFocus ? `rgb(${groupRgb} / 0.7)` : "rgb(var(--rgb-highlight) / 0.18)"}`,
                boxShadow: isActive || isFocus ? `0 0 20px rgb(${groupRgb} / 0.45)` : "none",
                opacity: dimmed ? 0.35 : 1,
                zIndex: isFocus ? 2 : 1,
              }}
            >
              <SkillLogo name={n.name} size={n.size > 72 ? 22 : 17} />
              <span
                className="mt-1 block max-w-[85%] overflow-hidden text-ellipsis whitespace-nowrap px-1 text-center font-mono leading-tight"
                style={{
                  fontSize: n.size > 76 ? "8px" : "7px",
                  color: isActive || isFocus ? groupColor : "rgb(var(--rgb-highlight) / 0.65)",
                }}
              >
                {n.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export function SkillsSection() {
  const sectionRef = useSectionReveal(1);
  const { activeSkill, setActiveSkill } = useSkillFilter();
  const [viewMode, setViewMode] = useState<"marquee" | "graph">("marquee");
  const [modalSkill, setModalSkill] = useState<(SkillItem & { group: "developer" | "cyber" }) | null>(null);

  const developerSkills = useMemo(() => {
    const byName = new Map<string, SkillItem>();
    [...skillsByRole.web, ...skillsByRole.engineering].forEach(s => byName.set(s.name, s));
    return Array.from(byName.values());
  }, []);

  const cyberSkills = useMemo(() => skillsByRole.cyber, []);

  const handlePick = (name: string, group: "developer" | "cyber") => {
    if (activeSkill === name) { setActiveSkill(null); return; }
    const pool = group === "developer" ? developerSkills : cyberSkills;
    const skill = pool.find(s => s.name === name);
    if (skill) setModalSkill({ ...skill, group });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="skills"
        data-section="skills"
        className="relative overflow-hidden py-24 section-bg"
      >
        <SectionNumber n="05" sectionId="skills" />
        <DecorNetwork />

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          {/* Heading + view toggle */}
          <ParallaxDrift speed={0.1}>
            <div data-aos="fade-up" className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
                  Skills
                </h2>
                <p className="mt-2 font-mono text-xs text-highlight/55">
                  Click any skill to see matching projects ↓
                </p>
              </div>
              {/* View mode toggle */}
              <div className="flex rounded-xl border border-highlight/10 bg-surface/10 p-1 gap-1">
                {(["marquee", "graph"] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-[11px] transition-all duration-200 capitalize ${
                      viewMode === mode
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "text-highlight/50 hover:text-highlight/75 border border-transparent"
                    }`}
                  >
                    {mode === "marquee" ? "⟵ Scroll" : "⬡ Graph"}
                  </button>
                ))}
              </div>
            </div>
          </ParallaxDrift>

          {/* Active filter banner */}
          {activeSkill && (
            <div
              data-aos="fade-up"
              className="mt-5 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2.5 w-fit"
            >
              <span className="font-mono text-xs text-accent">Filtering by: <strong>{activeSkill}</strong></span>
              <button type="button" onClick={() => setActiveSkill(null)} className="font-mono text-[11px] text-accent/70 hover:text-accent transition-colors">
                ✕ clear
              </button>
            </div>
          )}

          {viewMode === "marquee" ? (
            <>
              {/* Developer marquee */}
              <div className="mt-10 space-y-3" data-aos="fade-up" data-aos-delay="80">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-eng/70">Developer</span>
                  <span className="h-px flex-1 bg-eng/15" />
                  <span className="font-mono text-[10px] text-highlight/60">{developerSkills.length} skills</span>
                </div>
                <MarqueeRow skills={developerSkills} group="developer" direction="left" speed={65} activeSkill={activeSkill} onPick={(n) => handlePick(n, "developer")} />
              </div>

              {/* Cyber marquee */}
              <div className="mt-8 space-y-3" data-aos="fade-up" data-aos-delay="160">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyber/70">CyberSec</span>
                  <span className="h-px flex-1 bg-cyber/15" />
                  <span className="font-mono text-[10px] text-highlight/60">{cyberSkills.length} skills</span>
                </div>
                <MarqueeRow skills={cyberSkills} group="cyber" direction="right" speed={60} activeSkill={activeSkill} onPick={(n) => handlePick(n, "cyber")} />
              </div>
            </>
          ) : (
            <div className="mt-10 space-y-8" data-aos="fade-up">
              <SkillGraph skills={developerSkills} group="developer" activeSkill={activeSkill} onPick={(n) => handlePick(n, "developer")} label="Developer" />
              <SkillGraph skills={cyberSkills} group="cyber" activeSkill={activeSkill} onPick={(n) => handlePick(n, "cyber")} label="CyberSec" />
            </div>
          )}

          {/* Stats row */}
          <StaggerReveal
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
            stagger={0.1} from="up" distance={20} start="top 88%"
          >
            {[
              { label: "Total Skills", target: developerSkills.length + cyberSkills.length },
              { label: "Developer",    target: developerSkills.length },
              { label: "CyberSec",     target: cyberSkills.length },
              { label: "Projects",     target: projects.length },
            ].map(({ label, target }) => (
              <div key={label} className="glass-card rounded-xl px-4 py-3 text-center">
                <p className="font-display text-2xl text-highlight"><CountUp target={target} /></p>
                <p className="font-mono text-[10px] text-highlight/65">{label}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>

        <style>{`
          @keyframes marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
          @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        `}</style>
      </section>

      {/* Skill detail modal */}
      <AppModal
        open={!!modalSkill}
        onClose={() => setModalSkill(null)}
        title={modalSkill?.name ?? "Skill"}
        subtitle={modalSkill ? `${modalSkill.group === "developer" ? "Developer" : "CyberSec"} skill · Level ${modalSkill.level}%` : undefined}
        footer={
          <>
            <button type="button" className="btn-ghost" onClick={() => setModalSkill(null)}>Close</button>
            <button
              type="button"
              className="btn-ghost border-accent/60 text-accent"
              onClick={() => {
                if (modalSkill) setActiveSkill(modalSkill.name);
                setModalSkill(null);
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Filter Projects →
            </button>
          </>
        }
      >
        {modalSkill && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SkillLogo name={modalSkill.name} size={32} />
              <div>
                <p className="font-display text-2xl text-highlight">{modalSkill.name}</p>
                <p className="font-mono text-xs text-highlight/50">{modalSkill.group === "developer" ? "Developer" : "CyberSec"}</p>
              </div>
            </div>
            <ModalProficiencyBar level={modalSkill.level} group={modalSkill.group} />
            {modalSkill.related.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-highlight/50 mb-2">Related skills</p>
                <div className="flex flex-wrap gap-2">
                  {modalSkill.related.map(r => (
                    <span key={r} className="flex items-center gap-1.5 rounded-full border border-highlight/15 px-2.5 py-1 font-mono text-[11px] text-highlight/70">
                      <SkillLogo name={r} size={14} />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(() => {
              const related = projects.filter(p => p.tech.includes(modalSkill.name));
              if (!related.length) return null;
              return (
                <div>
                  <p className="font-mono text-[10px] text-highlight/50 mb-2">Used in {related.length} project{related.length > 1 ? "s" : ""}</p>
                  <ul className="space-y-1.5">
                    {related.map(p => (
                      <li key={p.id} className="flex items-center justify-between rounded-lg border border-highlight/10 bg-surface/15 px-3 py-2">
                        <span className="font-mono text-sm text-highlight">{p.title}</span>
                        <span className="font-mono text-[10px] text-accent/60">{p.category}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        )}
      </AppModal>
    </>
  );
}
