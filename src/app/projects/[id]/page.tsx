import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectCredibility, projectCodeSamples } from "@/content/portfolio";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AosInit } from "@/components/ui/AosInit";
import dynamic from "next/dynamic";

const PacketCapture = dynamic(
  () => import("@/components/demos/PacketCapture").then((m) => m.PacketCapture),
  { ssr: false, loading: () => <div className="h-[460px] animate-pulse rounded-xl bg-surface/20" /> },
);

type Props = { params: { id: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.shortDescription,
      type: "article",
      url: `/projects/${project.id}`,
    },
  };
}

const roleBadge: Record<string, string> = {
  engineering: "border-eng/40 bg-eng/10 text-eng",
  web: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  cyber: "border-cyber/40 bg-cyber/10 text-cyber",
};
const difficultyBadge: Record<string, string> = {
  beginner: "border-green-400/40 text-green-300",
  intermediate: "border-yellow-400/40 text-yellow-200",
  advanced: "border-red-400/40 text-red-300",
};

export default async function ProjectCaseStudyPage({ params }: Props) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();
  const cred = projectCredibility[project.id];
  const codeSamples = projectCodeSamples[project.id] ?? [];
  const moduleHref = project.roleMode === "cyber"
    ? "/?module=cybersec#projects"
    : "/?module=developer#projects";

  return (
    <main className="section-bg min-h-screen px-4 py-20 md:px-6">
      <AosInit />
      <article className="mx-auto max-w-4xl space-y-8">

        {/* Back */}
        <nav className="flex flex-wrap items-center gap-3" data-aos="fade-down">
          <a href={moduleHref} className="glass-pill inline-block text-highlight/80 hover:text-highlight">
            ← Back to {project.roleMode === "cyber" ? "CyberSec" : "Developer"} projects
          </a>
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer"
              className="glass-pill inline-block text-highlight/80 hover:text-highlight">
              GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="glass-pill border-accent/30 text-accent inline-block hover:border-accent/60">
              Live Demo ↗
            </a>
          )}
        </nav>

        {/* Header */}
        <header className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] capitalize ${roleBadge[project.roleMode] ?? ""}`}>
                  {project.roleMode}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] capitalize ${difficultyBadge[project.difficulty] ?? ""}`}>
                  {project.difficulty}
                </span>
                <span className="rounded-full border border-highlight/15 px-2.5 py-0.5 font-mono text-[11px] text-highlight/50">
                  {project.category}
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl text-highlight md:text-4xl">{project.title}</h1>
              <p className="mt-2 max-w-2xl text-highlight/75 leading-relaxed">{project.shortDescription}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="glass-pill text-highlight/80">{t}</span>
            ))}
          </div>
        </header>

        {/* Problem */}
        <Section icon="⊘" title="Problem">
          <p className="leading-relaxed text-highlight/80">{project.caseStudy.problem}</p>
        </Section>

        {/* Approach */}
        <Section icon="⟡" title="Approach">
          <ol className="space-y-4">
            {project.caseStudy.approach.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-accent/70 w-5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-highlight/80 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Live demo — packet capture simulation (network-sniffer only) */}
        {project.id === "network-sniffer" && (
          <Section icon="⏺" title="Live Demo — Packet Capture">
            <p className="mb-4 text-sm text-highlight/60">
              Simulated packet capture showing the sniffer&apos;s real terminal output — TCP/UDP/ICMP with HTTP extraction and DNS decoding. Use the filter buttons to switch BPF expressions.
            </p>
            <PacketCapture />
          </Section>
        )}

        {/* Live link (PhishShield and any project with liveUrl) */}
        {project.liveUrl && project.id !== "network-sniffer" && (
          <Section icon="⎋" title="Live Demo">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-sm text-accent hover:bg-accent/20 transition-colors"
            >
              Open {project.title} ↗
            </a>
            <p className="mt-3 text-sm text-highlight/55">
              Deployed live — opens in a new tab.
            </p>
          </Section>
        )}

        {/* Code samples */}
        {codeSamples.length > 0 && (
          <Section icon="⌨" title="Code">
            <div className="space-y-4">
              {codeSamples.map((file) => (
                <div key={file.path}>
                  <CodeBlock code={file.content} lang={file.language} filename={file.path} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Results */}
        <Section icon="◈" title="Results & Outcome">
          <p className="leading-relaxed text-highlight/80">{project.caseStudy.outcome}</p>
          {project.caseStudy.metrics?.length ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {project.caseStudy.metrics.map((m) => (
                <li key={m} className="flex items-start gap-2 rounded-xl border border-highlight/10 bg-surface/10 px-4 py-3">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span className="font-mono text-xs text-highlight/75">{m}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>

        {/* Architecture */}
        {project.caseStudy.architectureNotes?.length ? (
          <Section icon="⬡" title="Architecture Notes">
            <ul className="space-y-3">
              {project.caseStudy.architectureNotes.map((n) => (
                <li key={n} className="flex items-start gap-3 border-l-2 border-highlight/15 pl-4">
                  <p className="text-sm text-highlight/75 leading-relaxed">{n}</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Lessons learned */}
        {project.caseStudy.lessonsLearned?.length ? (
          <Section icon="◉" title="Lessons Learned">
            <ul className="space-y-4">
              {project.caseStudy.lessonsLearned.map((l, i) => (
                <li key={l} className="flex gap-4 rounded-xl border border-highlight/10 bg-surface/10 p-4">
                  <span className="shrink-0 font-mono text-sm text-accent/60">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-highlight/80 leading-relaxed">{l}</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Quality metrics (web projects) */}
        {cred ? (
          <Section icon="◑" title="Quality Metrics">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Performance", value: cred.performanceScore },
                { label: "Accessibility", value: cred.accessibilityScore },
                { label: "Lighthouse", value: cred.lighthouseScore },
                { label: "Load time", value: cred.loadTime },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-highlight/10 bg-surface/10 p-4 text-center">
                  <p className="font-display text-2xl text-highlight">{value}</p>
                  <p className="mt-1 font-mono text-[10px] text-highlight/50">{label}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Footer nav */}
        <footer className="flex flex-wrap gap-3 border-t border-highlight/10 pt-6">
          <a href={moduleHref} className="glass-pill text-highlight/70 hover:text-highlight">
            ← All Projects
          </a>
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer"
              className="glass-pill border-accent/30 text-accent hover:border-accent/60">
              View on GitHub ↗
            </a>
          )}
        </footer>
      </article>
    </main>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-highlight">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
