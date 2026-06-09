"use client";

import { skillsByRole, projects } from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useMemo, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { AppModal } from "@/components/ui/AppModal";
import Image from "next/image";

const SKILL_ICON_MAP: Record<string, string> = {
  HTML5: "html", CSS3: "css", JavaScript: "js", TypeScript: "ts",
  Angular: "angular", NestJS: "nestjs", "Node.js": "nodejs", Express: "express",
  PostgreSQL: "postgres", Prisma: "prisma", WordPress: "wordpress",
  WooCommerce: "woocommerce", Elementor: "wordpress", Git: "git",
  GitHub: "github", Figma: "figma", Docker: "docker", "VS Code": "vscode",
  React: "react", "Next.js": "nextjs", Python: "python", Linux: "linux",
  Redis: "redis", GraphQL: "graphql", "Three.js": "threejs",
  "Tailwind CSS": "tailwind", Kubernetes: "kubernetes",
  Metasploit: "linux", "Burp Suite": "linux", Wireshark: "linux",
  Nmap: "linux", "Kali Linux": "linux", OSINT: "linux",
  "SIEM tools": "linux", "Elastic Stack": "linux",
};

function SkillLogo({ name, size = 20 }: { name: string; size?: number }) {
  const icon = SKILL_ICON_MAP[name];
  if (!icon) {
    return (
      <span
        style={{ width: size, height: size }}
        className="grid place-items-center rounded border border-highlight/20 bg-surface/20 font-mono text-[9px] text-highlight/80 shrink-0"
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <Image
      src={`https://skillicons.dev/icons?i=${icon}`}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="rounded shrink-0"
      style={{ width: size, height: size }}
      unoptimized
    />
  );
}

type SkillItem = { name: string; level: number; related: string[] };

function SkillChip({
  skill,
  group,
  isActive,
  onClick,
}: {
  skill: SkillItem;
  group: "developer" | "cyber";
  isActive: boolean;
  onClick: () => void;
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
      <span className="font-mono text-xs whitespace-nowrap">{skill.name}</span>
      <div className="h-1 w-10 overflow-hidden rounded-full bg-surface/40">
        <div
          className={`h-full rounded-full ${group === "cyber" ? "bg-gradient-to-r from-cyber/60 to-orange-400/70" : "bg-gradient-to-r from-eng/60 to-accent/80"}`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </button>
  );
}

function MarqueeRow({
  skills,
  group,
  direction = "left",
  speed = 38,
  activeSkill,
  onPick,
}: {
  skills: SkillItem[];
  group: "developer" | "cyber";
  direction?: "left" | "right";
  speed?: number;
  activeSkill: string | null;
  onPick: (name: string) => void;
}) {
  const doubled = [...skills, ...skills];
  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="overflow-hidden py-1" aria-label={`${group} skills`}>
      <div
        className="flex gap-3 hover:[animation-play-state:paused]"
        style={{
          width: "max-content",
          animation: `${animName} ${speed}s linear infinite`,
        }}
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

export function SkillsSection() {
  const sectionRef = useSectionReveal(1);
  const { activeSkill, setActiveSkill } = useSkillFilter();

  const [modalSkill, setModalSkill] = useState<(SkillItem & { group: "developer" | "cyber" }) | null>(null);

  const developerSkills = useMemo(() => {
    const byName = new Map<string, SkillItem>();
    [...skillsByRole.web, ...skillsByRole.engineering].forEach(s => byName.set(s.name, s));
    return Array.from(byName.values());
  }, []);

  const cyberSkills = useMemo(() => skillsByRole.cyber, []);

  const handlePick = (name: string, group: "developer" | "cyber") => {
    if (activeSkill === name) {
      setActiveSkill(null);
      return;
    }
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
        <SectionNumber n="03" sectionId="skills" />
        <DecorNetwork />

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          {/* Heading */}
          <div data-aos="fade-up" data-aos-once="true">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Skills
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-sm text-highlight/65">
              Click any skill to filter the projects section. Hover a row to pause the scroll.
            </p>
          </div>

          {/* Active filter banner */}
          {activeSkill && (
            <div
              data-aos="fade-up" data-aos-once="true"
              className="mt-5 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2.5 w-fit"
            >
              <span className="font-mono text-xs text-accent">Filtering projects by: <strong>{activeSkill}</strong></span>
              <button
                type="button"
                onClick={() => setActiveSkill(null)}
                className="font-mono text-[11px] text-accent/70 hover:text-accent transition-colors"
              >
                ✕ clear
              </button>
            </div>
          )}

          {/* Developer marquee */}
          <div className="mt-10 space-y-3" data-aos="fade-up" data-aos-delay="80" data-aos-once="true">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-eng/70">Developer</span>
              <span className="h-px flex-1 bg-eng/15" />
              <span className="font-mono text-[10px] text-highlight/40">{developerSkills.length} skills</span>
            </div>
            <MarqueeRow
              skills={developerSkills}
              group="developer"
              direction="left"
              speed={65}
              activeSkill={activeSkill}
              onPick={(name) => handlePick(name, "developer")}
            />
          </div>

          {/* Cyber marquee */}
          <div className="mt-8 space-y-3" data-aos="fade-up" data-aos-delay="160" data-aos-once="true">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyber/70">CyberSec</span>
              <span className="h-px flex-1 bg-cyber/15" />
              <span className="font-mono text-[10px] text-highlight/40">{cyberSkills.length} skills</span>
            </div>
            <MarqueeRow
              skills={cyberSkills}
              group="cyber"
              direction="right"
              speed={60}
              activeSkill={activeSkill}
              onPick={(name) => handlePick(name, "cyber")}
            />
          </div>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4" data-aos="fade-up" data-aos-delay="240" data-aos-once="true">
            {[
              { label: "Total Skills", value: String(developerSkills.length + cyberSkills.length) },
              { label: "Developer", value: String(developerSkills.length) },
              { label: "CyberSec",  value: String(cyberSkills.length) },
              { label: "Projects",  value: String(projects.length) },
            ].map(({ label, value }) => (
              <div key={label} className="glass-card rounded-xl px-4 py-3 text-center">
                <p className="font-display text-2xl text-highlight">{value}</p>
                <p className="font-mono text-[10px] text-highlight/45">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-left {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
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
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-highlight/50">Proficiency</span>
                <span className="font-mono text-xs text-accent">{modalSkill.level}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface/40">
                <div
                  className={`h-full rounded-full ${modalSkill.group === "cyber" ? "bg-gradient-to-r from-cyber/60 to-orange-400" : "bg-gradient-to-r from-eng/60 to-accent"}`}
                  style={{ width: `${modalSkill.level}%`, transition: "width 0.6s ease" }}
                />
              </div>
            </div>
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
