"use client";

import { projects as allProjects, type Project, type RoleMode } from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { CodePanel } from "@/components/sections/CodePanel";
import { DemoHost } from "@/components/demos/DemoHost";
import { Marquee } from "@/components/ui/Marquee";
import { AppModal } from "@/components/ui/AppModal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { VideoModal } from "@/components/sections/VideoModal";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { trackEvent } from "@/lib/analytics";
import { emitToast } from "@/lib/toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getParallaxScaleForWidth,
  getParallaxScrubForWidth,
  motionTokens,
} from "@/lib/motion-tokens";
import { playSurfaceEnter } from "@/lib/surface-choreography";

gsap.registerPlugin(ScrollTrigger);

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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [techFilters, setTechFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<
    Project["difficulty"] | "all"
  >("all");
  const hasHydratedFiltersRef = useRef(false);
  const touchXRef = useRef<number | null>(null);
  const sectionAnimRef = useRef<HTMLElement | null>(null);
  const compareDrawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sectionAnimRef.current = document.getElementById("projects");
  }, []);

  const applyFiltersFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const q = params.get("q");
    const tech = params.get("tech");
    const cat = params.get("cat");
    const diff = params.get("diff");

    if (tab === "engineering" || tab === "web" || tab === "cyber") {
      setActiveTab(tab);
    }
    setQuery(q ?? "");
    setTechFilters(tech ? tech.split(",").filter(Boolean) : []);
    setCategoryFilters(cat ? cat.split(",").filter(Boolean) : []);
    if (diff === "beginner" || diff === "intermediate" || diff === "advanced") {
      setDifficultyFilter(diff);
    } else {
      setDifficultyFilter("all");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyFiltersFromUrl();
    hasHydratedFiltersRef.current = true;
  }, []);

  useEffect(() => {
    const onNavState = () => applyFiltersFromUrl();
    window.addEventListener("popstate", onNavState);
    return () => window.removeEventListener("popstate", onNavState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedFiltersRef.current) return;

    // Don't pollute a clean URL with the default state on first render
    const existingParams = new URLSearchParams(window.location.search);
    const urlHasFilters = existingParams.has("tab") || existingParams.has("q") || existingParams.has("tech") || existingParams.has("cat") || existingParams.has("diff");
    const isAtDefaults = activeTab === "engineering" && !query.trim() && !techFilters.length && !categoryFilters.length && difficultyFilter === "all";
    if (isAtDefaults && !urlHasFilters) return;

    const params = new URLSearchParams(window.location.search);
    if (activeTab !== "engineering") params.set("tab", activeTab);
    else params.delete("tab");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (techFilters.length) params.set("tech", techFilters.join(","));
    else params.delete("tech");
    if (categoryFilters.length) params.set("cat", categoryFilters.join(","));
    else params.delete("cat");
    if (difficultyFilter !== "all") params.set("diff", difficultyFilter);
    else params.delete("diff");

    const next = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }, [activeTab, query, techFilters, categoryFilters, difficultyFilter]);

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
  const totalGrouped = useMemo(
    () => ({
      engineering: allProjects.filter((p) => p.roleMode === "engineering").length,
      web: allProjects.filter((p) => p.roleMode === "web").length,
      cyber: allProjects.filter((p) => p.roleMode === "cyber").length,
    }),
    [],
  );

  const videoProject = filtered.find((p) => p.id === videoProjectId) ?? null;
  const demoProject = filtered.find((p) => p.id === demoProjectId) ?? null;
  const codeProject = filtered.find((p) => p.id === codeProjectId) ?? null;
  const caseProject = filtered.find((p) => p.id === caseProjectId) ?? null;
  const tabProjects = grouped[activeTab];
  const techChips = useMemo(() => {
    const set = new Set<string>();
    tabProjects.forEach((p) => {
      p.tech.forEach((t) => set.add(t));
    });
    return Array.from(set).slice(0, 14);
  }, [tabProjects]);
  const categoryChips = useMemo(() => {
    const set = new Set<string>();
    tabProjects.forEach((p) => set.add(p.category));
    return Array.from(set).slice(0, 12);
  }, [tabProjects]);

  const difficultyLabel: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const activeProjects = tabProjects.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q)) ||
      p.skills.some((s) => s.toLowerCase().includes(q));

    const matchesTech =
      techFilters.length === 0 ||
      techFilters.some((tf) =>
        p.tech.some((t) => t.toLowerCase() === tf.toLowerCase()),
      );

    const matchesCategory =
      categoryFilters.length === 0 ||
      categoryFilters.some((cf) => cf.toLowerCase() === p.category.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "all" || p.difficulty === difficultyFilter;

    return matchesQuery && matchesTech && matchesCategory && matchesDifficulty;
  });
  const compareProjects = allProjects.filter((p) => compareIds.includes(p.id));
  const activeCaseIndex = activeProjects.findIndex((p) => p.id === caseProjectId);
  const canCaseNavigate = activeProjects.length > 1 && activeCaseIndex >= 0;
  const projectLabel = (n: number) => `${n} project${n === 1 ? "" : "s"}`;
  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    techFilters.length +
    categoryFilters.length +
    (difficultyFilter === "all" ? 0 : 1);
  const clearAllFilters = () => {
    setQuery("");
    setTechFilters([]);
    setCategoryFilters([]);
    setDifficultyFilter("all");
    trackEvent("projects_filters_cleared");
    emitToast("Filters cleared", "success");
  };
  const toggleTechFilter = (chip: string) => {
    setTechFilters((prev) =>
      prev.includes(chip) ? prev.filter((t) => t !== chip) : [...prev, chip],
    );
    trackEvent("projects_tech_toggle", { chip });
  };
  const toggleCategoryFilter = (chip: string) => {
    setCategoryFilters((prev) =>
      prev.includes(chip) ? prev.filter((t) => t !== chip) : [...prev, chip],
    );
    trackEvent("projects_category_toggle", { chip });
  };
  const toggleCompare = (projectId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(projectId)) return prev.filter((id) => id !== projectId);
      if (prev.length >= 3) return [...prev.slice(1), projectId];
      return [...prev, projectId];
    });
    trackEvent("project_compare_toggle", { projectId });
  };
  const jumpCaseBy = useCallback((delta: -1 | 1) => {
    if (!canCaseNavigate || activeCaseIndex < 0) return;
    const nextIndex = (activeCaseIndex + delta + activeProjects.length) % activeProjects.length;
    setCaseProjectId(activeProjects[nextIndex]?.id ?? null);
  }, [canCaseNavigate, activeCaseIndex, activeProjects]);
  const applyPreset = (preset: "cyber" | "developer") => {
    if (preset === "cyber") {
      setActiveTab("cyber");
      setDifficultyFilter("advanced");
      setTechFilters(["Python", "Docker"]);
      setCategoryFilters([]);
    } else if (preset === "developer") {
      setActiveTab("web");
      setDifficultyFilter("intermediate");
      setTechFilters(["Next.js", "TypeScript"]);
      setCategoryFilters([]);
    }
    emitToast(`Applied ${preset} preset`, "success");
  };

  useEffect(() => {
    const onOpenCaseStudy = () => {
      const first = activeProjects[0];
      if (first) setCaseProjectId(first.id);
    };
    const onCompareProjects = () => {
      if (!activeProjects.length) return;
      setCompareIds((prev) => (prev.length >= 2 ? prev : activeProjects.slice(0, 2).map((p) => p.id)));
      setCompareModalOpen(true);
    };
    window.addEventListener("portfolio:open-case-study", onOpenCaseStudy as EventListener);
    window.addEventListener("portfolio:compare-projects", onCompareProjects as EventListener);
    return () => {
      window.removeEventListener("portfolio:open-case-study", onOpenCaseStudy as EventListener);
      window.removeEventListener("portfolio:compare-projects", onCompareProjects as EventListener);
    };
  }, [activeProjects]);

  useEffect(() => {
    if (!caseProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        jumpCaseBy(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        jumpCaseBy(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [caseProject, jumpCaseBy]);

  useEffect(() => {
    const sectionEl = sectionAnimRef.current;
    if (!sectionEl) return;
    const heading = sectionEl.querySelectorAll<HTMLElement>("[data-project-step='heading']");
    const meta = sectionEl.querySelectorAll<HTMLElement>("[data-project-step='meta']");
    const cards = sectionEl.querySelectorAll<HTMLElement>("[data-project-step='card']");
    const run = (direction: 1 | -1) => {
      const all = Array.from(heading).concat(Array.from(meta), Array.from(cards));
      all.forEach((el) => (el.style.willChange = "transform, opacity"));
      const tl = gsap.timeline({
        onComplete: () => all.forEach((el) => (el.style.willChange = "auto")),
      });
      tl.fromTo(heading, { y: 16 * direction, opacity: 0 }, { y: 0, opacity: 1, duration: motionTokens.duration.base, ease: motionTokens.ease.standard })
        .fromTo(meta, { y: 14 * direction, opacity: 0 }, { y: 0, opacity: 1, duration: motionTokens.duration.base, ease: motionTokens.ease.standard, stagger: motionTokens.stagger.section }, "-=0.12")
        .fromTo(cards, { y: 12 * direction, opacity: 0 }, { y: 0, opacity: 1, duration: motionTokens.duration.base, ease: motionTokens.ease.standard, stagger: 0.06 }, "-=0.08");
    };
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 76%",
      once: false,
      onEnter: () => run(1),
      onEnterBack: () => run(-1),
    });
    return () => st.kill();
  }, [activeTab, activeProjects.length]);

  useEffect(() => {
    const sectionEl = sectionAnimRef.current;
    if (!sectionEl) return;
    const cards = Array.from(sectionEl.querySelectorAll<HTMLElement>("[data-project-parallax]"));
    if (!cards.length) return;
    const scale = getParallaxScaleForWidth(window.innerWidth || 1024);
    const scrub = getParallaxScrubForWidth(window.innerWidth || 1024);
    const triggers = cards.map((card, idx) =>
      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub,
        onUpdate: (self) => {
          const amp =
            idx % 2 === 0
              ? motionTokens.parallax.projects.cardBase
              : motionTokens.parallax.projects.cardAlt;
          gsap.set(card, { y: -(amp * scale) * self.progress });
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [activeProjects.length, activeTab]);

  useEffect(() => {
    if (!compareIds.length) return;
    playSurfaceEnter(compareDrawerRef.current);
  }, [compareIds.length]);

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
            <h2 data-project-step="heading" className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Projects by Track
            </h2>
            <p data-project-step="heading" className="mt-2 max-w-3xl font-sans text-highlight/70">
              Deeper breakdown of delivery across software engineering, web development,
              and cybersecurity.
            </p>
          </ScrollReveal>
          <Marquee
            items={(["engineering", "web", "cyber"] as const).map(
              (role) =>
                `${roleMeta[role].title}: ${projectLabel(grouped[role].length)}${
                  activeSkill ? ` (${projectLabel(totalGrouped[role])} total)` : ""
                }`,
            )}
            speedSec={18}
            className="mt-5 font-mono text-xs text-highlight"
          />

          <div className="mt-10 space-y-4">
            <div className="flex flex-wrap gap-2" data-project-step="meta">
              {(["engineering", "web", "cyber"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setActiveTab(role);
                    trackEvent("projects_tab_change", { tab: role });
                  }}
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
            <div className="flex flex-wrap items-center gap-2" data-project-step="meta">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tech, or skill..."
                className="w-full max-w-sm rounded-lg border border-highlight/20 bg-surface/20 px-3 py-2 font-mono text-xs text-highlight outline-none"
              />
              {(query.trim() || techFilters.length > 0) ? (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[10px] text-highlight/80 hover:border-highlight/40"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2" data-project-step="meta">
              <button
                type="button"
                onClick={() => {
                  setTechFilters([]);
                  trackEvent("projects_tech_reset");
                }}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
                  techFilters.length === 0
                    ? "border-accent bg-surface/30 text-accent"
                    : "border-highlight/20 text-highlight/70"
                }`}
              >
                All
              </button>
              {techChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleTechFilter(chip)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
                    techFilters.includes(chip)
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/70"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {!filtered.length ? (
              <div className="glass-card rounded-2xl p-6 font-mono text-sm text-highlight/70">
                No projects match the active skill filter.
              </div>
            ) : activeProjects.length ? (
              <ProjectTrack
                projects={activeProjects}
                title={roleMeta[activeTab].title}
                subtitle={roleMeta[activeTab].subtitle}
                onWatch={(p) => setVideoProjectId(p.id)}
                onLive={(p) => {
                  if (p.liveUrl) {
                    window.open(p.liveUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setDemoProjectId(p.id);
                  }
                }}
                onCode={(p) => setCodeProjectId(p.id)}
                onCaseStudy={(p) => {
                  setCaseProjectId(p.id);
                  trackEvent("project_case_study_open", { projectId: p.id });
                }}
                onToggleCompare={(p) => toggleCompare(p.id)}
                comparedIds={compareIds}
              />
            ) : (
              <div className="glass-card rounded-2xl p-6 font-mono text-sm text-highlight/70">
                No projects match your search and filters.
              </div>
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
                className="btn-ghost"
                onClick={() => jumpCaseBy(-1)}
                disabled={!canCaseNavigate}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => jumpCaseBy(1)}
                disabled={!canCaseNavigate}
              >
                Next
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
              <a className="btn-ghost border-accent/60 text-accent" href={`/projects/${caseProject.id}`}>
                Full Case Page
              </a>
            </>
          ) : undefined
        }
      >
        {caseProject ? (
          <div
            className="space-y-4 text-sm text-highlight/80"
            onTouchStart={(e) => {
              touchXRef.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchXRef.current === null) return;
              const end = e.changedTouches[0]?.clientX ?? touchXRef.current;
              const delta = end - touchXRef.current;
              if (Math.abs(delta) < 45) return;
              if (delta > 0) jumpCaseBy(-1);
              else jumpCaseBy(1);
              touchXRef.current = null;
            }}
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">Last updated: Apr 2026</span>
              <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">Verified links</span>
              <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">Live data source</span>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-mono text-xs text-highlight/50">Problem:</span>{" "}
                {caseProject.caseStudy.problem}
              </p>
              <div>
                <p className="font-mono text-xs text-highlight/50">Approach:</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {caseProject.caseStudy.approach.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <p>
                <span className="font-mono text-xs text-highlight/50">Stack:</span>{" "}
                {caseProject.tech.join(", ")}
              </p>
              <p>
                <span className="font-mono text-xs text-highlight/50">Outcome:</span>{" "}
                {caseProject.caseStudy.outcome}
              </p>
            </div>

            {(caseProject.caseStudy.metrics?.length ?? 0) > 0 ? (
              <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <p className="font-mono text-xs text-highlight/50">Metrics</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {caseProject.caseStudy.metrics!.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(caseProject.caseStudy.architectureNotes?.length ?? 0) > 0 ? (
              <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <p className="font-mono text-xs text-highlight/50">Architecture notes</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {caseProject.caseStudy.architectureNotes!.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(
              caseProject.caseStudy.screenshots?.length ??
              0
            ) > 0 ? (
              <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <p className="font-mono text-xs text-highlight/50">
                  Screenshots
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {caseProject.caseStudy.screenshots!.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${src}-${i}`}
                      src={src}
                      alt={`Screenshot ${i + 1} for ${caseProject.title}`}
                      className="h-28 w-full rounded-lg border border-highlight/10 object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            ) : caseProject.screenshotFallback ? (
              <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <p className="font-mono text-xs text-highlight/50">Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={caseProject.screenshotFallback}
                  alt={`${caseProject.title} screenshot preview`}
                  className="mt-3 h-32 w-full rounded-lg border border-highlight/10 object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            <p>
              <span className="font-mono text-xs text-highlight/50">Demo:</span>{" "}
              Use <span className="text-accent">Watch</span>/<span className="text-accent">Live</span> actions for walkthrough.
            </p>
            {canCaseNavigate ? (
              <p className="font-mono text-[11px] text-highlight/60">
                Carousel mode: use Prev/Next or keyboard arrows.
              </p>
            ) : null}
            {canCaseNavigate ? (
              <p className="font-mono text-[11px] text-accent/70 sm:hidden animate-pulse">
                Swipe left or right to switch projects
              </p>
            ) : null}
          </div>
        ) : null}
      </AppModal>

      {compareIds.length ? (
        <div
          ref={compareDrawerRef}
          className="fixed bottom-20 left-1/2 z-[10001] w-[min(94vw,56rem)] -translate-x-1/2 rounded-2xl border border-highlight/20 bg-bg/90 p-3 shadow-glass backdrop-blur md:bottom-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p data-surface-item className="font-mono text-xs text-highlight/80">
              Compare drawer: {compareIds.length}/3 selected
            </p>
            <div data-surface-item className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={() => setCompareIds([])}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn-ghost hotspot-magnetic border-accent/60 text-xs text-accent"
                disabled={compareIds.length < 2}
                onClick={() => setCompareModalOpen(true)}
              >
                Compare Selected
              </button>
            </div>
          </div>
          <div data-surface-item className="mt-2 flex flex-wrap gap-2">
            {compareProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[11px] text-highlight/85"
                onClick={() => toggleCompare(p.id)}
              >
                {p.title} ×
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AppModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Project Compare"
        subtitle="Track, stack, and outcomes side by side."
        size="lg"
        footer={
          <>
            <button type="button" className="btn-ghost" onClick={() => setCompareModalOpen(false)}>
              Close
            </button>
          </>
        }
      >
        <div data-surface-item className="grid gap-3 md:grid-cols-2">
          {compareProjects.map((p) => (
            <article key={p.id} className="rounded-xl border border-highlight/15 bg-surface/10 p-4">
              <h4 className="font-display text-lg text-highlight">{p.title}</h4>
              <p className="mt-1 font-mono text-[11px] text-highlight/60">
                {p.roleMode} · {difficultyLabel[p.difficulty]}
              </p>
              <p className="mt-2 text-sm text-highlight/80">{p.shortDescription}</p>
              <p className="mt-3 font-mono text-[11px] text-highlight/60">Tech</p>
              <p className="text-xs text-highlight/85">{p.tech.join(", ")}</p>
              <p className="mt-3 font-mono text-[11px] text-highlight/60">Outcome</p>
              <p className="text-xs text-highlight/85">{p.caseStudy.outcome}</p>
            </article>
          ))}
        </div>
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
  onToggleCompare,
  comparedIds,
}: {
  title: string;
  subtitle: string;
  projects: Project[];
  onWatch: (project: Project) => void;
  onLive: (project: Project) => void;
  onCode: (project: Project) => void;
  onCaseStudy: (project: Project) => void;
  onToggleCompare: (project: Project) => void;
  comparedIds: string[];
}) {
  return (
    <section id="project-track" className="space-y-4">
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
                data-project-step="card"
                data-project-parallax
              >
                <ProjectCard
                  project={p}
                  onCaseStudy={() => onCaseStudy(p)}
                  onWatch={() => onWatch(p)}
                  onLive={() => onLive(p)}
                  onCode={() => onCode(p)}
                  onToggleCompare={() => onToggleCompare(p)}
                  isCompared={comparedIds.includes(p.id)}
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
