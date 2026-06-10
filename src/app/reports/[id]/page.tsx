import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { securityReports, type ReportFinding, type Severity } from "@/content/portfolio";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { BackButton } from "@/components/ui/BackButton";
import { decodeProjectId, encodeProjectId } from "@/lib/projectId";
import { AosInit } from "@/components/ui/AosInit";
import { NetworkDiagramSection } from "@/components/sections/NetworkDiagramSection";

type Props = { params: { id: string } };

export function generateStaticParams() {
  return securityReports.map((r) => ({ id: encodeProjectId(r.id) }));
}

export function generateMetadata({ params }: Props): Metadata {
  const realId = decodeProjectId(params.id);
  const report = securityReports.find((r) => r.id === realId) ?? securityReports.find((r) => r.id === params.id);
  if (!report) return {};
  return {
    title: `${report.title} — Security Report`,
    description: report.purpose,
    openGraph: {
      title: `${report.title} — Security Report`,
      description: report.purpose,
      type: "article",
    },
  };
}

const typeLabel: Record<string, string> = {
  pentest: "Penetration Test",
  ir: "Incident Response",
  vuln: "Vulnerability Assessment",
  network: "Network Infrastructure",
};

const typeBadge: Record<string, string> = {
  pentest: "border-accent/40 bg-accent/10 text-accent",
  ir: "border-accent/40 bg-accent/10 text-accent",
  vuln: "border-accent/40 bg-accent/10 text-accent",
  network: "border-accent/40 bg-accent/10 text-accent",
};

const typeSkills: Record<string, string[]> = {
  pentest: ["Web application security", "Vulnerability exploitation", "Attack chain mapping", "Risk prioritisation"],
  ir: ["Incident triage", "Root cause analysis", "Evidence collection", "Containment & eradication"],
  vuln: ["Vulnerability scanning", "Manual verification", "CVSS scoring", "Remediation guidance"],
  network: ["Network reconnaissance", "Service enumeration", "Infrastructure hardening", "Topology mapping"],
};

const typeRoleRelevance: Record<string, string> = {
  pentest: "Red Team · Application Security · Security Assessment",
  ir: "Blue Team · SOC Analyst · Forensics & Response",
  vuln: "Security Analyst · Vulnerability Management · Risk Assessment",
  network: "Network Security · Infrastructure · Architecture Review",
};

// Severity → theme color mapping
const sevBadge: Record<Severity, string> = {
  critical: "border-cyber/50 bg-cyber/15 text-cyber",
  high:     "border-cyber/35 bg-cyber/10 text-cyber/75",
  medium:   "border-accent/50 bg-accent/15 text-accent",
  low:      "border-eng/40 bg-eng/10 text-eng",
};

const sevDot: Record<Severity, string> = {
  critical: "bg-cyber",
  high:     "bg-cyber/60",
  medium:   "bg-accent",
  low:      "bg-eng",
};

const sevBorderL: Record<Severity, string> = {
  critical: "border-l-cyber",
  high:     "border-l-cyber/60",
  medium:   "border-l-accent",
  low:      "border-l-eng",
};

const sevPill: Record<Severity, string> = {
  critical: "border-cyber/40 bg-cyber/10 text-cyber",
  high:     "border-cyber/30 bg-cyber/8 text-cyber/70",
  medium:   "border-accent/40 bg-accent/10 text-accent",
  low:      "border-eng/35 bg-eng/8 text-eng",
};

function SeverityBadge({ sev }: { sev: Severity }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${sevBadge[sev]}`}>
      {sev}
    </span>
  );
}

function CvssBadge({ score }: { score: string }) {
  const num = parseFloat(score);
  const cls =
    num >= 9 ? "text-cyber" :
    num >= 7 ? "text-cyber/70" :
    num >= 4 ? "text-accent" : "text-eng";
  return (
    <span className={`font-mono text-sm font-bold ${cls}`} title="CVSS v3.1 Base Score">
      CVSS {score}
    </span>
  );
}

function FindingCard({ finding, reportId, index = 0 }: { finding: ReportFinding; reportId: string; index?: number }) {
  const pocLang = finding.poc?.includes("msf6") ? "bash"
    : finding.poc?.includes("import ") ? "python"
    : finding.poc?.includes("curl") ? "bash"
    : finding.poc?.includes("gcloud") ? "bash"
    : "bash";

  return (
    <article
      id={`finding-${reportId}-${finding.id}`}
      className={`scroll-mt-28 rounded-xl border border-l-4 border-highlight/10 bg-surface/10 p-5 space-y-4 ${sevBorderL[finding.severity]}`}
      data-aos="fade-up"
      data-aos-delay={Math.min(index * 60, 120)}
     
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <h3 className="font-display text-xl text-highlight">{finding.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge sev={finding.severity} />
            {finding.cvss && <CvssBadge score={finding.cvss} />}
          </div>
        </div>
      </div>

      {finding.affected && (
        <div className="rounded-lg border border-highlight/10 bg-surface/15 px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-highlight/60">Affected</span>
          <p className="mt-0.5 font-mono text-xs text-highlight/80">{finding.affected}</p>
        </div>
      )}

      <div>
        <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-highlight/60">Description</h4>
        <p className="text-sm text-highlight/80 leading-relaxed">{finding.body}</p>
      </div>

      {finding.impact && (
        <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
          <h4 className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-highlight/60">
            <span>⚠</span> Business Impact
          </h4>
          <p className="text-sm text-highlight/80 leading-relaxed">{finding.impact}</p>
        </div>
      )}

      {finding.poc && (
        <div>
          <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-highlight/60">
            Proof of Concept
          </h4>
          <CodeBlock code={finding.poc} lang={pocLang} filename="poc.sh" />
        </div>
      )}

      {finding.remediation && (
        <div className="rounded-xl border border-highlight/10 bg-surface/10 p-4">
          <h4 className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-highlight/60">
            <span>✓</span> Remediation
          </h4>
          <p className="text-sm text-highlight/80 leading-relaxed">{finding.remediation}</p>
        </div>
      )}
    </article>
  );
}

function Section({ icon, title, children, delay = 100 }: { icon: string; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up" data-aos-delay={delay}>
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-highlight">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ReportDetailPage({ params }: Props) {
  const realId = decodeProjectId(params.id);
  const report = securityReports.find((r) => r.id === realId) ?? securityReports.find((r) => r.id === params.id);
  
  if (!report) {
    notFound();
  }

  const criticals = report.findings.filter((f) => f.severity === "critical").length;
  const highs = report.findings.filter((f) => f.severity === "high").length;
  const mediums = report.findings.filter((f) => f.severity === "medium").length;
  const lows = report.findings.filter((f) => f.severity === "low").length;
  const maxSeverity = criticals > 0 ? "critical" : highs > 0 ? "high" : mediums > 0 ? "medium" : "low";
  
  const maxSeverityLabel: Record<string, string> = {
    critical: "Critical risk identified",
    high: "High risk identified",
    medium: "Medium risk identified",
    low: "Low risk only",
  };
  const maxSeverityColor: Record<string, string> = {
    critical: "text-cyber",
    high: "text-cyber/70",
    medium: "text-accent",
    low: "text-eng",
  };

  return (
    <main className="section-bg min-h-screen px-4 py-20 md:px-6">
      <AosInit />
      <article className="mx-auto max-w-4xl space-y-8">

        {/* Back nav */}
        <nav data-aos="fade-down">
          <BackButton label="← Back to Reports" href="/?module=cybersec&cybertab=reports#projects" />
        </nav>

        {/* Header */}
        <header className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up" data-aos-delay="40">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${typeBadge[report.type]}`}>
                {typeLabel[report.type]}
              </span>
              <h1 className="mt-3 font-display text-3xl text-highlight md:text-4xl leading-tight">
                {report.title}
              </h1>
            </div>
            <span className="rounded-full border border-highlight/15 px-3 py-1 font-mono text-xs text-highlight/65">
              {report.timeline}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-highlight/60">Target</p>
              <p className="mt-1 text-sm text-highlight/80">{report.target}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-highlight/60">Scope</p>
              <p className="mt-1 text-sm text-highlight/80">{report.scope}</p>
            </div>
          </div>

          {/* Severity summary bar */}
          <div className="mt-6 flex flex-wrap gap-3">
            {criticals > 0 && (
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${sevPill.critical}`}>
                {criticals} Critical
              </span>
            )}
            {highs > 0 && (
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${sevPill.high}`}>
                {highs} High
              </span>
            )}
            {mediums > 0 && (
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${sevPill.medium}`}>
                {mediums} Medium
              </span>
            )}
            {lows > 0 && (
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${sevPill.low}`}>
                {lows} Low
              </span>
            )}
          </div>

          {/* Tools */}
          <div className="mt-4 flex flex-wrap gap-2">
            {report.tools.map((t) => (
              <span key={t} className="glass-pill text-[11px]">{t}</span>
            ))}
          </div>
        </header>

        {/* Overview */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8" data-aos="fade-up" data-aos-delay="80">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-xl text-highlight">
              <span className="text-accent mr-2">◈</span>Overview
            </h2>
          </div>

          {/* Key stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
            {[
              { value: report.findings.length, label: "Findings" },
              { value: report.tools.length, label: "Tools Used" },
              { value: maxSeverity, label: maxSeverityLabel[maxSeverity], cls: maxSeverityColor[maxSeverity] },
              { value: report.timeline, label: "Timeline", cls: "text-accent/80 text-sm" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-xl border border-highlight/10 bg-surface/10 px-4 py-3 text-center"
                data-aos="zoom-in"
                data-aos-delay={Math.min(80 + i * 50, 180)}
               
              >
                <p className={`font-mono font-bold uppercase ${stat.cls ?? "text-2xl text-accent"}`}>{stat.value}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-highlight/65">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Role relevance */}
          <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3" data-aos="fade-up" data-aos-delay="160">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent/60 mb-1">Role Relevance</p>
            <p className="font-mono text-sm text-accent/90">{typeRoleRelevance[report.type]}</p>
          </div>

          {/* Skills demonstrated */}
          <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-highlight/60">Skills Demonstrated</p>
            <div className="flex flex-wrap gap-2">
              {(typeSkills[report.type] ?? []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-accent/30 bg-accent/8 px-3 py-1 font-mono text-xs text-accent/90"
                >
                  {skill}
                </span>
              ))}
              {report.tools.slice(0, 5).map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-highlight/20 bg-surface/15 px-3 py-1 font-mono text-xs text-highlight/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Outcome summary */}
          <p className="text-sm text-highlight/80 leading-relaxed border-t border-highlight/10 pt-5">
            {report.outcome}
          </p>
        </section>

        {/* Purpose */}
        <Section icon="◎" title="Purpose" delay={100}>
          <p className="text-highlight/80 leading-relaxed">{report.purpose}</p>
        </Section>

        {/* Why */}
        <Section icon="⟡" title="Why This Engagement" delay={100}>
          <p className="text-highlight/80 leading-relaxed">{report.why}</p>
        </Section>

        {/* Methodology */}
        <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up" data-aos-delay="100">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl text-highlight">
            <span className="text-accent">⊛</span>
            How I Approached This
          </h2>
          <ol className="relative space-y-0">
            {report.methodology.map((step, i) => {
              const isLast = i === report.methodology.length - 1;
              return (
                <li
                  key={step}
                  className="flex gap-5"
                  data-aos="fade-left"
                  data-aos-delay={Math.min(i * 60, 120)}
                 
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                      <span className="font-mono text-[11px] font-bold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="mt-1 w-px flex-1 bg-gradient-to-b from-accent/30 to-transparent min-h-[2rem]" />
                    )}
                  </div>
                  <div className={`pb-6 ${isLast ? "pb-0" : ""} min-w-0 flex-1`}>
                    <p className="text-sm text-highlight/80 leading-relaxed pt-1.5">{step}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Findings */}
        <section>
          <div className="flex items-center gap-3 mb-6" data-aos="fade-up">
            <h2 className="font-display text-2xl text-highlight">
              <span className="text-accent mr-2">⊘</span>Findings
            </h2>
            <span className="rounded-full border border-highlight/15 px-2.5 py-0.5 font-mono text-[11px] text-highlight/65">
              {report.findings.length} total
            </span>
          </div>

          {/* Two-col on desktop: sticky nav sidebar + findings list */}
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-6 lg:items-start">
            {/* Findings nav — sticky on lg */}
            <nav
              className="glass-card rounded-xl p-4 mb-6 lg:mb-0 lg:sticky lg:top-24"
              data-aos="fade-up"
              data-aos-delay="60"
             
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-highlight/60">
                Jump to finding
              </p>
              <ul className="space-y-1.5">
                {report.findings.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`#finding-${report.id}-${f.id}`}
                      className="flex items-center gap-2 rounded px-2 py-1 font-mono text-xs text-highlight/70 hover:bg-surface/20 hover:text-highlight transition-colors"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${sevDot[f.severity]}`} />
                      <span className="truncate">{f.title}</span>
                      <span className="ml-auto shrink-0 font-mono text-[10px] uppercase opacity-50">{f.severity}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-6">
              {report.findings.map((f, i) => (
                <FindingCard key={f.id} finding={f} reportId={report.id} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-highlight">
            <span className="text-accent">◈</span>
            Outcome &amp; Impact
          </h2>
          <p className="text-highlight/80 leading-relaxed">{report.outcome}</p>
        </section>

        {/* Lessons learned */}
        <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl text-highlight">
            <span className="text-accent">◉</span>
            What I Learned
          </h2>
          <ul className="space-y-4">
            {report.lessonsLearned.map((l, i) => (
              <li
                key={l}
                className="flex gap-4 rounded-xl border border-highlight/10 bg-surface/10 p-4"
                data-aos="fade-up"
                data-aos-delay={Math.min(i * 60, 120)}
               
              >
                <span className="shrink-0 font-mono text-sm font-bold text-accent/60">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-highlight/80 leading-relaxed">{l}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Network diagram */}
        {report.networkDiagramUrl && (
          <NetworkDiagramSection imageUrl={report.networkDiagramUrl} title={report.title} />
        )}

        {/* Footer */}
        <footer className="flex flex-wrap gap-3 border-t border-highlight/10 pt-6" data-aos="fade-up">
          <BackButton label="← All Reports" href="/?module=cybersec&cybertab=reports#projects" />
        </footer>
      </article>
    </main>
  );
}
