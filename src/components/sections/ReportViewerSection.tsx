"use client";

import { securityReports, type Severity } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useEffect, useMemo, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";

function sevClass(s: Severity) {
  if (s === "critical") return "border-l-red-500 text-red-300";
  if (s === "high") return "border-l-orange-400 text-orange-200";
  if (s === "medium") return "border-l-yellow-300 text-yellow-100";
  return "border-l-blue-400 text-blue-200";
}

function findingDomId(reportId: string, findingId: string) {
  return `finding-${reportId}-${findingId}`;
}

export function ReportViewerSection() {
  const sectionRef = useSectionReveal(4);
  const [reportIdx, setReportIdx] = useState(0);
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<Severity | "all">("all");
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);

  const report = securityReports[reportIdx]!;
  const findings = useMemo(() => {
    return report.findings.filter((f) => {
      const okSev = sev === "all" || f.severity === sev;
      const okQ =
        !q ||
        f.title.toLowerCase().includes(q.toLowerCase()) ||
        f.body.toLowerCase().includes(q.toLowerCase());
      return okSev && okQ;
    });
  }, [report, q, sev]);

  useEffect(() => {
    setActiveFindingId(
      findings[0] ? findingDomId(report.id, findings[0].id) : null,
    );
  }, [report.id, reportIdx, findings]);

  useEffect(() => {
    const ids = findings.map((f) => findingDomId(report.id, f.id));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);

    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.15)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveFindingId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [report.id, findings]);

  const scrollToFinding = (findingId: string) => {
    const id = findingDomId(report.id, findingId);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="reports"
      data-section="reports"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="06" sectionId="reports" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl">
          Report viewer
        </h2>

        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search findings…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight min-w-[200px]"
          />
          <select
            value={sev}
            onChange={(e) => setSev(e.target.value as Severity | "all")}
            className="rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight"
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => window.print()}
          >
            Download PDF
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              const el = document.getElementById("report-body");
              el?.requestFullscreen?.();
            }}
          >
            Fullscreen
          </button>
        </div>

        <div
          id="report-body"
          className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr] print:block"
        >
          <aside className="glass-card h-fit max-h-[min(80vh,520px)] overflow-y-auto rounded-2xl p-4 print:hidden lg:sticky lg:top-24">
            <p className="font-mono text-xs text-highlight/50">Reports</p>
            <ul className="mt-3 space-y-2 border-b border-highlight/10 pb-4">
              {securityReports.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setReportIdx(i)}
                    className={`w-full rounded px-2 py-1 text-left font-mono text-xs ${
                      i === reportIdx
                        ? "bg-surface/40 text-accent"
                        : "text-highlight/70 hover:text-highlight"
                    }`}
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-highlight/50">Findings</p>
            <nav aria-label="Finding sections">
              <ul className="mt-2 space-y-1">
                {findings.map((f) => {
                  const fid = findingDomId(report.id, f.id);
                  const active = activeFindingId === fid;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => scrollToFinding(f.id)}
                        className={`w-full rounded px-2 py-1.5 text-left font-mono text-[11px] leading-snug transition-colors ${
                          active
                            ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                            : "text-highlight/65 hover:bg-surface/25 hover:text-highlight"
                        }`}
                      >
                        <span
                          className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                            f.severity === "critical"
                              ? "bg-red-400"
                              : f.severity === "high"
                                ? "bg-orange-400"
                                : f.severity === "medium"
                                  ? "bg-yellow-300"
                                  : "bg-blue-400"
                          }`}
                          aria-hidden
                        />
                        {f.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-2xl text-highlight">{report.title}</h3>
            <p className="mt-1 font-mono text-xs uppercase text-highlight/50">
              {report.type}
            </p>
            <div className="mt-6 space-y-6">
              {findings.map((f) => (
                <article
                  key={f.id}
                  id={findingDomId(report.id, f.id)}
                  className={`scroll-mt-28 border-l-4 bg-surface/10 py-3 pl-4 ${sevClass(f.severity)}`}
                >
                  <h4 className="font-display text-lg">{f.title}</h4>
                  <p className="mt-2 font-sans text-sm text-highlight/80">
                    {f.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
