"use client";

import { projects as allProjects, type Project, type RoleMode } from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useMemo, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { CodePanel } from "@/components/sections/CodePanel";
import { DemoHost } from "@/components/demos/DemoHost";
import { Marquee } from "@/components/ui/Marquee";
import { AppModal } from "@/components/ui/AppModal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { VideoModal } from "@/components/sections/VideoModal";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

const roleMeta: Record<RoleMode, { title: string; subtitle: string }> = {
  engineering: {
    title: "Software Engineering",
    subtitle:
      "Backend-heavy systems work focused on reliability, observability, and delivery velocity.",
  },
  web: {
    title: "Web Development",
    subtitle:
      "Product-facing interfaces blending performance, motion, and maintainable component architecture.",
  },
  cyber: {
    title: "Cybersecurity",
    subtitle:
      "Security labs, offensive simulations, and blue-team workflows built for realistic practice.",
  },
};

export function ProjectsSection() {
  const { activeSkill } = useSkillFilter();
  const sectionRef = useSectionReveal(2);
  const [videoProjectId, setVideoProjectId] = useState<string | null>(null);
  const [demoProjectId, setDemoProjectId] = useState<string | null>(null);
  const [codeProjectId, setCodeProjectId] = useState<string | null>(null);
  const [caseProjectId, setCaseProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RoleMode>("engineering");
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!activeSkill) return allProjects;
    return allProjects.filter((p) => p.skills.includes(activeSkill));
  }, [activeSkill]);

  const grouped = useMemo(
    () => ({
      engineering: filtered.filter((p) => p.roleMode === "engineering"),
      web: filtered.filter((p) => p.roleMode === "web"),
      cyber: filtered.filter((p) => p.roleMode === "cyber"),
    }),
    [filtered],
  );

  const videoProject = filtered.find((p) => p.id === videoProjectId) ?? null;
  const demoProject = filtered.find((p) => p.id === demoProjectId) ?? null;
  const codeProject = filtered.find((p) => p.id === codeProjectId) ?? null;
  const caseProject = filtered.find((p) => p.id === caseProjectId) ?? null;
  const tabProjects = grouped[activeTab];
  const skillChips = useMemo(() => {
    const set = new Set<string>();
    tabProjects.forEach((p) => {
      p.tech.forEach((t) => set.add(t));
      p.skills.forEach((s) => set.add(s));
    });
    return ["all", ...Array.from(set).slice(0, 10)];
  }, [tabProjects]);
  const activeProjects = tabProjects.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q));
    const matchesSkill =
      skillFilter === "all" ||
      p.tech.some((t) => t.toLowerCase() === skillFilter.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());
    return matchesQuery && matchesSkill;
  });
  const marqueeItems = [
    `${roleMeta.engineering.title}: ${grouped.engineering.length} projects`,
    `${roleMeta.web.title}: ${grouped.web.length} projects`,
    `${roleMeta.cyber.title}: ${grouped.cyber.length} projects`,
  ];

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        data-section="projects"
        className="relative overflow-hidden py-24 section-bg"
      >
        <SectionNumber n="04" sectionId="projects" />
        <DecorNetwork />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <ScrollReveal from="up">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Projects by Track
            </h2>
            <p className="mt-2 max-w-3xl font-sans text-highlight/70">
              Deeper breakdown of delivery across software engineering, web development,
              and cybersecurity.
            </p>
          </ScrollReveal>
          <Marquee items={marqueeItems} speedSec={18} className="mt-5" />

          <div className="mt-10 space-y-6">
            <div className="flex flex-wrap gap-2">
              {(["engineering", "web", "cyber"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveTab(role)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                    activeTab === role
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/70 hover:border-highlight/35"
                  }`}
                >
                  {roleMeta[role].title}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full max-w-sm rounded-lg border border-highlight/20 bg-surface/20 px-3 py-2 font-mono text-xs text-highlight outline-none"
              />
              {skillChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSkillFilter(chip)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
                    skillFilter === chip
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/70"
                  }`}
                >
                  {chip === "all" ? "All Stack" : chip}
                </button>
              ))}
            </div>

            {!filtered.length ? (
              <div className="glass-card rounded-2xl p-6 font-mono text-sm text-highlight/70">
                No projects match the active skill filter.
              </div>
            ) : (
              <ProjectTrack
                projects={activeProjects}
                title={roleMeta[activeTab].title}
                subtitle={roleMeta[activeTab].subtitle}
                onWatch={(p) => setVideoProjectId(p.id)}
                onLive={(p) => setDemoProjectId(p.id)}
                onCode={(p) => setCodeProjectId(p.id)}
                onCaseStudy={(p) => setCaseProjectId(p.id)}
              />
            )}
          </div>
        </div>
      </section>

      <VideoModal
        project={videoProject}
        open={!!videoProject}
        onClose={() => setVideoProjectId(null)}
      />
      <DemoHost
        project={demoProject}
        open={!!demoProject}
        onClose={() => setDemoProjectId(null)}
      />
      <CodePanel
        projectId={codeProject?.id ?? null}
        open={!!codeProject}
        onClose={() => setCodeProjectId(null)}
      />
      <AppModal
        open={!!caseProject}
        onClose={() => setCaseProjectId(null)}
        title={caseProject?.title ?? "Case Study"}
        subtitle="Problem → Approach → Stack → Outcome → Demo"
        footer={
          caseProject ? (
            <>
              <button type="button" className="btn-ghost" onClick={() => setCaseProjectId(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn-ghost border-accent/60 text-accent"
                onClick={() => {
                  setCaseProjectId(null);
                  setDemoProjectId(caseProject.id);
                }}
              >
                Open Demo
              </button>
            </>
          ) : undefined
        }
      >
        {caseProject ? (
          <div className="space-y-3 text-sm text-highlight/80">
            <p><span className="font-mono text-xs text-highlight/50">Problem:</span> {caseProject.shortDescription}</p>
            <p><span className="font-mono text-xs text-highlight/50">Approach:</span> Iterative delivery in the {caseProject.roleMode} track with modular architecture.</p>
            <p><span className="font-mono text-xs text-highlight/50">Stack:</span> {caseProject.tech.join(", ")}</p>
            <p><span className="font-mono text-xs text-highlight/50">Outcome:</span> Reusable implementation patterns and validated production-facing workflow.</p>
            <p><span className="font-mono text-xs text-highlight/50">Demo:</span> Use Watch/Live actions for walkthrough.</p>
          </div>
        ) : null}
      </AppModal>
    </>
  );
}

function ProjectTrack({
  title,
  subtitle,
  projects,
  onWatch,
  onLive,
  onCode,
  onCaseStudy,
}: {
  title: string;
  subtitle: string;
  projects: Project[];
  onWatch: (project: Project) => void;
  onLive: (project: Project) => void;
  onCode: (project: Project) => void;
  onCaseStudy: (project: Project) => void;
}) {
  return (
    <section className="space-y-4">
      <div data-aos="fade-right">
        <h3 className="font-display text-3xl text-highlight">{title}</h3>
        <p className="mt-1 max-w-2xl font-sans text-sm text-highlight/65">{subtitle}</p>
      </div>
      {projects.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((p, idx) => (
            <ParallaxDrift key={p.id} speed={0.1 + (idx % 2) * 0.1}>
              <div 
                data-aos="fade-up" 
                data-aos-delay={idx * 50}
              >
                <ProjectCard
                  project={p}
                  onCaseStudy={() => onCaseStudy(p)}
                  onWatch={() => onWatch(p)}
                  onLive={() => onLive(p)}
                  onCode={() => onCode(p)}
                />
              </div>
            </ParallaxDrift>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-5 font-mono text-xs text-highlight/60">
          No projects currently listed in this track.
        </div>
      )}
    </section>
  );
}
