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
    return (
      <Image
        src={`https://cdn.simpleicons.org/${simpleIcon}/d8ece0`}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="shrink-0 opacity-80"
        style={{ width: size, height: size }}
        unoptimized
      />
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

/* ── Bubble view ────────────────────────────────────────────────────────── */
const FLOAT_ANIMS = ["float-a", "float-b", "float-c"] as const;

function SkillBubble({
  skill, group, index, isActive, onClick,
}: {
  skill: SkillItem; group: "developer" | "cyber"; index: number;
  isActive: boolean; onClick: () => void;
}) {
  const size = Math.max(64, Math.min(96, Math.round(skill.level * 0.62 + 34)));
  const anim = FLOAT_ANIMS[index % 3];
  const dur = 3 + (index % 4) * 0.55;
  const delay = ((index * 0.17) % 2.2).toFixed(2);

  const activeRing = group === "cyber"
    ? "rgba(255,76,76,0.7)" : "rgba(76,158,255,0.7)";
  const activeBg = group === "cyber"
    ? "rgba(255,76,76,0.14)" : "rgba(76,158,255,0.14)";
  const activeText = group === "cyber" ? "var(--cyber)" : "var(--eng)";

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${skill.name} — ${skill.level}%`}
      className="flex flex-col items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 focus-visible:outline-none"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: isActive ? activeBg : "rgba(30,74,58,0.55)",
        border: `1.5px solid ${isActive ? activeRing : "rgba(168,217,184,0.16)"}`,
        boxShadow: isActive ? `0 0 22px ${activeRing}` : "none",
        animation: `${anim} ${dur}s ease-in-out ${delay}s infinite`,
      }}
    >
      <SkillLogo name={skill.name} size={size > 75 ? 22 : 17} />
      <span
        className="mt-1 font-mono leading-tight text-center px-1 overflow-hidden"
        style={{
          fontSize: size > 80 ? "8px" : "7px",
          color: isActive ? activeText : "rgba(216,236,224,0.65)",
          maxWidth: "85%",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          display: "block",
        }}
      >
        {skill.name}
      </span>
    </button>
  );
}

function BubbleCloud({
  skills, group, activeSkill, onPick, label,
}: {
  skills: SkillItem[]; group: "developer" | "cyber";
  activeSkill: string | null; onPick: (name: string) => void; label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${group === "cyber" ? "text-cyber/70" : "text-eng/70"}`}>
          {label}
        </span>
        <span className={`h-px flex-1 ${group === "cyber" ? "bg-cyber/15" : "bg-eng/15"}`} />
        <span className="font-mono text-[10px] text-highlight/60">{skills.length} skills</span>
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-start py-3">
        {skills.map((skill, i) => (
          <SkillBubble
            key={skill.name}
            skill={skill}
            group={group}
            index={i}
            isActive={activeSkill === skill.name}
            onClick={() => onPick(skill.name)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export function SkillsSection() {
  const sectionRef = useSectionReveal(1);
  const { activeSkill, setActiveSkill } = useSkillFilter();
  const [viewMode, setViewMode] = useState<"marquee" | "bubbles">("marquee");
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
                {(["marquee", "bubbles"] as const).map(mode => (
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
                    {mode === "marquee" ? "⟵ Scroll" : "◎ Bubbles"}
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
              <BubbleCloud skills={developerSkills} group="developer" activeSkill={activeSkill} onPick={(n) => handlePick(n, "developer")} label="Developer" />
              <BubbleCloud skills={cyberSkills} group="cyber" activeSkill={activeSkill} onPick={(n) => handlePick(n, "cyber")} label="CyberSec" />
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
