"use client";

import {
  projects as allProjects,
  securityReports,
  scripts,
  type SecurityReport,
  type SecurityScript,
} from "@/content/portfolio";
import { useSkillFilter } from "@/context/SkillFilterContext";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { CodePanel } from "@/components/sections/CodePanel";
import { DemoHost } from "@/components/demos/DemoHost";
import { AppModal } from "@/components/ui/AppModal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { VideoModal } from "@/components/sections/VideoModal";
import { trackEvent } from "@/lib/analytics";
import { emitToast } from "@/lib/toast";
import { playSurfaceEnter } from "@/lib/surface-choreography";
import { ScriptViewerModal } from "@/components/ui/ScriptViewerModal";
import { PdfModal } from "@/components/ui/PdfModal";
import { encodeProjectId } from "@/lib/projectId";

type Module = "cybersec" | "developer";
type DevSubTab = "all" | "engineering" | "web";
type CyberSubTab = "projects" | "reports" | "scripts";

/* ── colour helpers ───────────────────────────────────────────────────────── */
function sevColor(s: string) {
  if (s === "critical") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (s === "high")     return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  if (s === "medium")   return "bg-yellow-400/20 text-yellow-200 border-yellow-400/30";
  return "bg-blue-500/20 text-blue-300 border-blue-500/30";
}
function catBadge(cat: string) {
  return "border-accent/40 bg-accent/10 text-accent";
}

export function ProjectsSection() {
  const { activeSkill } = useSkillFilter();
  const sectionRef = useSectionReveal(2);

  // modal state
  const [videoProjectId, setVideoProjectId] = useState<string | null>(null);
  const [demoProjectId,  setDemoProjectId]  = useState<string | null>(null);
  const [codeProjectId,  setCodeProjectId]  = useState<string | null>(null);
  const [caseProjectId,  setCaseProjectId]  = useState<string | null>(null);

  // module / sub-tab — CyberSec first
  const [activeModule, setActiveModule]   = useState<Module>("cybersec");
  const [devSubTab,    setDevSubTab]      = useState<DevSubTab>("all");
  const [cyberSubTab,  setCyberSubTab]    = useState<CyberSubTab>("reports");

  // filters
  const [query,           setQuery]           = useState("");
  const [techFilters,     setTechFilters]     = useState<string[]>([]);
  const [scriptCatFilter, setScriptCatFilter] = useState<string>("all");
  const [reportTypeFilter,setReportTypeFilter]= useState<string>("all");

  // compare
  const [compareIds,       setCompareIds]       = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const compareDrawerRef = useRef<HTMLDivElement | null>(null);

  const touchXRef            = useRef<number | null>(null);
  const hasHydratedFiltersRef = useRef(false);

  /* ── URL sync ───────────────────────────────────────────────────────────── */
  const applyUrl = () => {
    const p = new URLSearchParams(window.location.search);
    const mod = p.get("module");
    if (mod === "cybersec" || mod === "developer") setActiveModule(mod);
    const tab = p.get("tab");
    if (tab === "all" || tab === "engineering" || tab === "web") setDevSubTab(tab);
    const cyb = p.get("cybertab");
    if (cyb === "projects" || cyb === "reports" || cyb === "scripts") setCyberSubTab(cyb);
    setQuery(p.get("q") ?? "");
    setTechFilters(p.get("tech") ? (p.get("tech") as string).split(",").filter(Boolean) : []);
  };
  useEffect(() => { if (typeof window !== "undefined") { applyUrl(); hasHydratedFiltersRef.current = true; } }, []);
  useEffect(() => {
    window.addEventListener("popstate", applyUrl);
    return () => window.removeEventListener("popstate", applyUrl);
  }, []);
  useEffect(() => {
    if (!hasHydratedFiltersRef.current) return;
    const existing = new URLSearchParams(window.location.search);
    const hasAny = existing.has("module") || existing.has("tab") || existing.has("cybertab") || existing.has("q") || existing.has("tech");
    const isDefault = activeModule === "cybersec" && devSubTab === "all" && cyberSubTab === "reports" && !query && !techFilters.length;
    if (isDefault && !hasAny) return;
    const p = new URLSearchParams(window.location.search);
    activeModule !== "cybersec" ? p.set("module", activeModule) : p.delete("module");
    devSubTab   !== "all"       ? p.set("tab", devSubTab)       : p.delete("tab");
    cyberSubTab !== "reports"   ? p.set("cybertab", cyberSubTab): p.delete("cybertab");
    query.trim()                ? p.set("q", query.trim())      : p.delete("q");
    techFilters.length          ? p.set("tech", techFilters.join(",")) : p.delete("tech");
    window.history.replaceState(null, "", `${window.location.pathname}${p.toString() ? `?${p}` : ""}${window.location.hash}`);
  }, [activeModule, devSubTab, cyberSubTab, query, techFilters]);

  /* ── derived data ───────────────────────────────────────────────────────── */
  const bySkill = useMemo(() =>
    activeSkill ? allProjects.filter(p => p.skills.includes(activeSkill)) : allProjects,
    [activeSkill]
  );
  const cyberProjects = useMemo(() => bySkill.filter(p => p.roleMode === "cyber"), [bySkill]);
  const devBase = useMemo(() => {
    const base = bySkill.filter(p => p.roleMode !== "cyber");
    if (devSubTab === "all") return base;
    return base.filter(p => p.roleMode === devSubTab);
  }, [bySkill, devSubTab]);
  const devFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devBase.filter(p => {
      const okQ   = !q || p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.tech.some(t => t.toLowerCase().includes(q));
      const okTech= !techFilters.length || techFilters.some(tf => p.tech.some(t => t.toLowerCase() === tf.toLowerCase()));
      return okQ && okTech;
    });
  }, [devBase, query, techFilters]);
  const devTechChips = useMemo(() => {
    const s = new Set<string>(); devBase.forEach(p => p.tech.forEach(t => s.add(t))); return Array.from(s).slice(0, 16);
  }, [devBase]);

  // case nav
  const activeCasePool  = activeModule === "developer" ? devFiltered : cyberProjects;
  const activeCaseIndex = activeCasePool.findIndex(p => p.id === caseProjectId);
  const canCaseNav      = activeCasePool.length > 1 && activeCaseIndex >= 0;
  const jumpCase = useCallback((d: -1 | 1) => {
    if (!canCaseNav) return;
    const nx = (activeCaseIndex + d + activeCasePool.length) % activeCasePool.length;
    setCaseProjectId(activeCasePool[nx]?.id ?? null);
  }, [canCaseNav, activeCaseIndex, activeCasePool]);
  useEffect(() => {
    if (!caseProjectId) return;
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") { e.preventDefault(); jumpCase(-1); } if (e.key === "ArrowRight") { e.preventDefault(); jumpCase(1); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [caseProjectId, jumpCase]);

  const toggleTech    = (c: string) => setTechFilters(p => p.includes(c) ? p.filter(t=>t!==c) : [...p,c]);
  const toggleCompare = (id: string) => setCompareIds(p => p.includes(id) ? p.filter(x=>x!==id) : p.length>=3 ? [...p.slice(1),id] : [...p,id]);
  useEffect(() => { if (compareIds.length) playSurfaceEnter(compareDrawerRef.current); }, [compareIds.length]);

  const videoProject   = allProjects.find(p => p.id === videoProjectId) ?? null;
  const demoProject    = allProjects.find(p => p.id === demoProjectId)  ?? null;
  const codeProject    = allProjects.find(p => p.id === codeProjectId)  ?? null;
  const caseProject    = allProjects.find(p => p.id === caseProjectId)  ?? null;
  const compareProjects= allProjects.filter(p => compareIds.includes(p.id));
  const diffLabel: Record<string,string> = { beginner:"Beginner", intermediate:"Intermediate", advanced:"Advanced" };

  /* ── module counts ──────────────────────────────────────────────────────── */
  const cyberCount = bySkill.filter(p=>p.roleMode==="cyber").length + securityReports.length + scripts.length;
  const devCount   = bySkill.filter(p=>p.roleMode!=="cyber").length;

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

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">

          {/* Heading */}
          <ScrollReveal from="up">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Projects by Module
            </h2>
            <p className="mt-2 max-w-2xl font-sans text-sm text-highlight/65">
              Two disciplines — applied cybersecurity and full-stack development. Each with its own depth of work, tools, and documented outcomes.
            </p>
          </ScrollReveal>

          {/* Module tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {([
              { id: "cybersec",  label: "CyberSec",  count: cyberCount, active: "border-cyber/70 bg-cyber/10 text-cyber shadow-[0_0_20px_rgba(255,76,76,0.15)]" },
              { id: "developer", label: "Developer",  count: devCount,   active: "border-eng/70 bg-eng/10 text-eng shadow-[0_0_20px_rgba(76,158,255,0.15)]"    },
            ] as const).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setActiveModule(m.id); trackEvent("projects_module_change", { module: m.id }); }}
                className={`rounded-2xl border px-6 py-3 font-mono text-sm font-semibold transition-all duration-300 ${
                  activeModule === m.id
                    ? m.active
                    : "border-highlight/15 text-highlight/50 hover:border-highlight/30 hover:text-highlight/80"
                }`}
              >
                {m.label}
                <span className={`ml-2.5 rounded-full border px-2 py-0.5 font-mono text-[10px] ${activeModule === m.id ? "border-current/40 bg-current/10" : "border-highlight/15 text-highlight/40"}`}>
                  {m.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── CYBERSEC MODULE ────────────────────────────────────────────── */}
          {activeModule === "cybersec" && (
            <div className="mt-8 space-y-6">

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 rounded-2xl border border-highlight/10 bg-surface/10 p-1.5 w-fit">
                {([
                  { id: "reports",  label: "Security Reports",count: securityReports.length },
                  { id: "scripts",  label: "Scripts & Tools", count: scripts.length },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCyberSubTab(t.id)}
                    className={`rounded-xl px-4 py-2 font-mono text-xs font-medium transition-all duration-200 ${
                      cyberSubTab === t.id
                        ? "bg-accent/15 text-accent border border-accent/40"
                        : "text-highlight/55 hover:text-highlight/80 border border-transparent"
                    }`}
                  >
                    {t.label}
                    <span className="ml-1.5 opacity-60">({t.count})</span>
                  </button>
                ))}
              </div>

              {/* ── Projects ── */}
              {cyberSubTab === "projects" && (
                <div className="space-y-5">
                  <p className="font-sans text-sm text-highlight/55">
                    Hands-on security labs, offensive simulations, and blue team tooling — each with a full case study and replication guide.
                  </p>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {cyberProjects.map((p, i) => (
                      <div key={p.id} data-aos="fade-up" data-aos-delay={i * 60} data-aos-once="true">
                        <ProjectCard
                          project={p}
                          onCaseStudy={() => setCaseProjectId(p.id)}
                          onWatch={() => setVideoProjectId(p.id)}
                          onLive={() => p.liveUrl ? window.open(p.liveUrl,"_blank","noopener") : setDemoProjectId(p.id)}
                          onCode={() => setCodeProjectId(p.id)}
                          onToggleCompare={() => toggleCompare(p.id)}
                          isCompared={compareIds.includes(p.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Reports ── */}
              {cyberSubTab === "reports" && (
                <div className="space-y-5">
                  <p className="font-sans text-sm text-highlight/55">
                    Penetration test and IR reports with full methodology, CVSS-scored findings, remediation guidance, proof-of-concept code, and lessons learned.
                  </p>
                  {/* Report type filters */}
                  <div className="flex flex-wrap gap-2">
                    {([
                      { id: "all",     label: "All" },
                      { id: "network", label: "Network" },
                      { id: "pentest", label: "Pentest" },
                      { id: "ir",      label: "Incident Response" },
                      { id: "vuln",    label: "Vuln Assessment" },
                    ] as const).map(t => {
                      const cnt = t.id === "all" ? securityReports.length : securityReports.filter(r=>r.type===t.id).length;
                      if (!cnt && t.id !== "all") return null;
                      return (
                        <button key={t.id} type="button"
                          onClick={() => setReportTypeFilter(t.id)}
                          className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all ${
                            reportTypeFilter === t.id
                              ? "border-accent/60 bg-accent/10 text-accent"
                              : "border-highlight/35 text-highlight/55 hover:border-highlight/55 hover:text-highlight/80"
                          }`}
                        >
                          {t.label} <span className="opacity-60">({cnt})</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {securityReports
                      .filter(r => reportTypeFilter === "all" || r.type === reportTypeFilter)
                      .map((r, i) => <ReportCard key={r.id} report={r} idx={i} />)}
                  </div>
                </div>
              )}

              {/* ── Scripts ── */}
              {cyberSubTab === "scripts" && (
                <div className="space-y-5">
                  <p className="font-sans text-sm text-highlight/55">
                    Custom security tooling with documented purpose, step-by-step replication guides, and production-grade code.
                  </p>
                  {/* Category filters */}
                  <div className="flex flex-wrap gap-2">
                    {(["all", "detection", "recon", "analysis", "reporting"] as const).map(cat => {
                      const cnt = cat === "all" ? scripts.length : scripts.filter(s=>s.category===cat).length;
                      if (!cnt && cat !== "all") return null;
                      return (
                        <button key={cat} type="button"
                          onClick={() => setScriptCatFilter(cat)}
                          className={`rounded-full border px-3 py-1 font-mono text-[11px] capitalize transition-all ${
                            scriptCatFilter === cat
                              ? "border-accent/60 bg-accent/10 text-accent"
                              : "border-highlight/35 text-highlight/55 hover:border-highlight/55 hover:text-highlight/80"
                          }`}
                        >
                          {cat === "all" ? "All Scripts" : cat} <span className="opacity-60">({cnt})</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {scripts
                      .filter(s => scriptCatFilter === "all" || s.category === scriptCatFilter)
                      .map((s, i) => <ScriptCard key={s.id} script={s} idx={i} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DEVELOPER MODULE ──────────────────────────────────────────── */}
          {activeModule === "developer" && (
            <div className="mt-8 space-y-6">

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 rounded-2xl border border-highlight/10 bg-surface/10 p-1.5 w-fit">
                {([
                  { id: "all",         label: "All Projects" },
                  { id: "engineering", label: "Engineering" },
                  { id: "web",         label: "Web" },
                ] as const).map(t => (
                  <button key={t.id} type="button" onClick={() => setDevSubTab(t.id)}
                    className={`rounded-xl px-4 py-2 font-mono text-xs font-medium transition-all duration-200 ${
                      devSubTab === t.id
                        ? "bg-eng/20 text-eng border border-eng/40 shadow-[0_0_12px_rgba(76,158,255,0.12)]"
                        : "text-highlight/55 hover:text-highlight/80 border border-transparent"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search + tech chips */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search by title or tech…"
                    className="w-full max-w-xs rounded-xl border border-highlight/20 bg-surface/20 px-3 py-2 font-mono text-xs text-highlight outline-none focus:border-highlight/40 transition-colors"
                  />
                  {(query || techFilters.length > 0) && (
                    <button type="button"
                      onClick={() => { setQuery(""); setTechFilters([]); emitToast("Filters cleared","success"); }}
                      className="rounded-full border border-highlight/20 px-3 py-1.5 font-mono text-[11px] text-highlight/70 hover:border-highlight/40 transition-colors"
                    >
                      Clear ×
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setTechFilters([])}
                    className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all ${!techFilters.length ? "border-eng/60 bg-eng/10 text-eng" : "border-highlight/35 text-highlight/55 hover:border-highlight/55"}`}
                  >All</button>
                  {devTechChips.map(chip => (
                    <button key={chip} type="button" onClick={() => toggleTech(chip)}
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all ${techFilters.includes(chip) ? "border-eng/60 bg-eng/10 text-eng" : "border-highlight/35 text-highlight/55 hover:border-highlight/55"}`}
                    >{chip}</button>
                  ))}
                </div>
              </div>

              {devFiltered.length ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {devFiltered.map((p, i) => (
                    <div key={p.id} data-aos="fade-up" data-aos-delay={i * 50} data-aos-once="true">
                      <ProjectCard
                        project={p}
                        onCaseStudy={() => { setCaseProjectId(p.id); trackEvent("project_case_study_open",{projectId:p.id}); }}
                        onWatch={() => setVideoProjectId(p.id)}
                        onLive={() => p.liveUrl ? window.open(p.liveUrl,"_blank","noopener") : setDemoProjectId(p.id)}
                        onCode={() => setCodeProjectId(p.id)}
                        onToggleCompare={() => toggleCompare(p.id)}
                        isCompared={compareIds.includes(p.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center font-mono text-sm text-highlight/50">
                  No projects match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <VideoModal project={videoProject} open={!!videoProject} onClose={() => setVideoProjectId(null)} />
      <DemoHost  project={demoProject}  open={!!demoProject}  onClose={() => setDemoProjectId(null)} />
      <CodePanel projectId={codeProject?.id ?? null} open={!!codeProject} onClose={() => setCodeProjectId(null)} />

      {/* Case study modal */}
      <AppModal
        open={!!caseProject}
        onClose={() => setCaseProjectId(null)}
        title={caseProject?.title ?? "Case Study"}
        subtitle="Problem → Approach → Stack → Outcome → Lessons"
        footer={caseProject ? (
          <>
            <button type="button" className="btn-ghost" onClick={() => setCaseProjectId(null)}>Close</button>
            <button type="button" className="btn-ghost" onClick={() => jumpCase(-1)} disabled={!canCaseNav}>Prev</button>
            <button type="button" className="btn-ghost" onClick={() => jumpCase(1)}  disabled={!canCaseNav}>Next</button>
            <a className="btn-ghost border-accent/60 text-accent" href={`/projects/${caseProject.id}`}>Full Case →</a>
          </>
        ) : undefined}
      >
        {caseProject && (
          <div
            className="space-y-5 text-sm text-highlight/80"
            onTouchStart={e => { touchXRef.current = e.changedTouches[0]?.clientX ?? null; }}
            onTouchEnd={e => {
              if (touchXRef.current === null) return;
              const d = (e.changedTouches[0]?.clientX ?? touchXRef.current) - touchXRef.current;
              if (Math.abs(d) < 45) return;
              d > 0 ? jumpCase(-1) : jumpCase(1);
              touchXRef.current = null;
            }}
          >
            <p><span className="font-mono text-xs text-highlight/45">Problem</span><br />{caseProject.caseStudy.problem}</p>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/45">Approach</p>
              <ul className="space-y-2">
                {caseProject.caseStudy.approach.map((a,i) => (
                  <li key={a} className="flex gap-3">
                    <span className="shrink-0 font-mono text-[10px] text-accent/60 mt-0.5">{String(i+1).padStart(2,"0")}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p><span className="font-mono text-xs text-highlight/45">Stack</span><br />{caseProject.tech.join(", ")}</p>
            <p><span className="font-mono text-xs text-highlight/45">Outcome</span><br />{caseProject.caseStudy.outcome}</p>
            {(caseProject.caseStudy.lessonsLearned?.length ?? 0) > 0 && (
              <div className="rounded-xl border border-accent/15 bg-accent/5 p-4 space-y-2">
                <p className="font-mono text-xs text-highlight/45">Key Takeaway</p>
                <p className="text-xs text-highlight/75">{caseProject.caseStudy.lessonsLearned![0]}</p>
              </div>
            )}
            {canCaseNav && <p className="font-mono text-[11px] text-accent/60 sm:hidden animate-pulse">Swipe to switch projects</p>}
          </div>
        )}
      </AppModal>

      {/* Compare drawer */}
      {compareIds.length > 0 && (
        <div ref={compareDrawerRef} className="fixed bottom-20 left-1/2 z-[10001] w-[min(94vw,52rem)] -translate-x-1/2 rounded-2xl border border-highlight/20 bg-bg/95 p-3 shadow-glass backdrop-blur md:bottom-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p data-surface-item className="font-mono text-xs text-highlight/70">Compare: {compareIds.length}/3</p>
            <div data-surface-item className="flex gap-2">
              <button type="button" className="btn-ghost text-xs" onClick={() => setCompareIds([])}>Clear</button>
              <button type="button" className="btn-ghost text-xs border-accent/60 text-accent" disabled={compareIds.length < 2} onClick={() => setCompareModalOpen(true)}>Compare →</button>
            </div>
          </div>
          <div data-surface-item className="mt-2 flex flex-wrap gap-2">
            {compareProjects.map(p => (
              <button key={p.id} type="button"
                className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[11px] text-highlight/75 hover:border-highlight/40 transition-colors"
                onClick={() => toggleCompare(p.id)}>
                {p.title} ×
              </button>
            ))}
          </div>
        </div>
      )}

      <AppModal open={compareModalOpen} onClose={() => setCompareModalOpen(false)} title="Compare Projects" subtitle="Stack, difficulty, and outcomes side by side" size="lg"
        footer={<button type="button" className="btn-ghost" onClick={() => setCompareModalOpen(false)}>Close</button>}
      >
        <div data-surface-item className="grid gap-4 md:grid-cols-2">
          {compareProjects.map(p => (
            <article key={p.id} className="rounded-xl border border-highlight/15 bg-surface/10 p-5 space-y-3">
              <h4 className="font-display text-lg text-highlight">{p.title}</h4>
              <p className="font-mono text-[11px] text-highlight/50">{p.roleMode === "cyber" ? "CyberSec" : "Developer"} · {diffLabel[p.difficulty]}</p>
              <p className="text-sm text-highlight/75">{p.shortDescription}</p>
              <div><p className="font-mono text-[10px] text-highlight/40 mb-1">Stack</p><p className="text-xs text-highlight/80">{p.tech.join(", ")}</p></div>
              <div><p className="font-mono text-[10px] text-highlight/40 mb-1">Outcome</p><p className="text-xs text-highlight/80">{p.caseStudy.outcome}</p></div>
            </article>
          ))}
        </div>
      </AppModal>
    </>
  );
}

/* ── Report Card ─────────────────────────────────────────────────────────── */
function ReportCard({ report, idx }: { report: SecurityReport; idx: number }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const typeLabel: Record<string,string> = { pentest: "Pentest", ir: "Incident Response", vuln: "Vuln Assessment", network: "Network Infrastructure" };
  const totalFindings = report.findings.length;
  const criticals = report.findings.filter(f=>f.severity==="critical").length;
  const highs     = report.findings.filter(f=>f.severity==="high").length;

  return (
    <>
      <article
        data-aos="fade-up" data-aos-delay={idx * 70} data-aos-once="true"
        className="glass-card flex flex-col gap-4 rounded-2xl border border-t-2 border-highlight/10 border-t-accent/60 p-7 min-h-[300px] transition-all duration-300 hover:border-accent/25 hover:-translate-y-0.5"
      >
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent/70">
            {typeLabel[report.type]}
          </span>
          <h3 className="font-display text-lg text-highlight leading-snug">{report.title}</h3>
          <p className="font-mono text-[10px] text-highlight/40">{report.timeline}</p>
        </div>

        {/* Teaser — the hook */}
        {report.teaser && (
          <p className="font-sans text-sm text-highlight/80 leading-relaxed italic border-l-2 border-accent/40 pl-3">
            {report.teaser}
          </p>
        )}

        {/* Finding summary */}
        <div className="flex flex-wrap gap-2">
          {criticals > 0 && (
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${sevColor("critical")}`}>
              {criticals} Critical
            </span>
          )}
          {highs > 0 && (
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${sevColor("high")}`}>
              {highs} High
            </span>
          )}
          <span className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono text-[10px] text-accent/70">
            {totalFindings} findings total
          </span>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-[3.5rem]">
          {report.tools.slice(0,5).map(t => <span key={t} className="glass-pill text-[10px] shrink-0">{t}</span>)}
          {report.tools.length > 5 && <span className="glass-pill text-[10px] shrink-0">+{report.tools.length-5} more</span>}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          {report.pdfUrl && (
            <button
              type="button"
              onClick={() => setPdfOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2.5 font-mono text-xs text-accent/70 transition-all hover:border-accent/35 hover:text-accent"
            >
              ◎ PDF
            </button>
          )}
          <a
            href={`/reports/${encodeProjectId(report.id)}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
          >
            Full Report <span className="opacity-60">→</span>
          </a>
        </div>
      </article>

      {report.pdfUrl && (
        <PdfModal
          pdfUrl={report.pdfUrl}
          title={report.title}
          isOpen={pdfOpen}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </>
  );
}

/* ── Script Card ─────────────────────────────────────────────────────────── */
function ScriptCard({ script, idx }: { script: SecurityScript; idx: number }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const langLabel: Record<string,string> = { python:"Python", go:"Go", bash:"Bash" };
  const langDot:   Record<string,string> = { python:"bg-accent/80", go:"bg-accent/60", bash:"bg-accent" };

  return (
    <>
      <article
        data-aos="fade-up" data-aos-delay={idx * 70} data-aos-once="true"
        className="glass-card flex flex-col gap-4 rounded-2xl border border-highlight/10 p-7 min-h-[300px] transition-all duration-300 hover:border-accent/25 hover:-translate-y-0.5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] capitalize ${catBadge(script.category)}`}>
            {script.category}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${langDot[script.language] ?? "bg-highlight/40"}`} />
            <span className="font-mono text-[10px] text-highlight/50">{langLabel[script.language] ?? script.language}</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl text-highlight">{script.title}</h3>
          <p className="mt-0.5 font-mono text-[10px] text-highlight/40">{script.filename}</p>
        </div>

        <p className="font-sans text-sm text-highlight/60 leading-relaxed line-clamp-3">{script.shortDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-[3.5rem]">
          {script.tags.slice(0,4).map(t => (
            <span key={t} className="rounded-full border border-highlight/10 px-2 py-0.5 font-mono text-[10px] text-highlight/40 shrink-0">
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-highlight/20 bg-surface/10 px-3 py-2.5 font-mono text-xs text-highlight/70 transition-all hover:border-highlight/35 hover:text-highlight"
          >
            ⌨ View Script
          </button>
          <a href={`/scripts/${encodeProjectId(script.id)}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-3 py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
          >
            Guide <span className="opacity-60">→</span>
          </a>
        </div>
      </article>

      <ScriptViewerModal
        filename={script.filename}
        title={script.title}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}
