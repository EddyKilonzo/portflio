import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { scripts } from "@/content/portfolio";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { BackButton } from "@/components/ui/BackButton";
import { decodeProjectId, encodeProjectId } from "@/lib/projectId";
import fs from "fs";
import path from "path";

type Props = { params: { id: string } };

export function generateStaticParams() {
  return scripts.map((s) => ({ id: encodeProjectId(s.id) }));
}

export function generateMetadata({ params }: Props): Metadata {
  const realId = decodeProjectId(params.id);
  const script = scripts.find((s) => s.id === realId) ?? scripts.find((s) => s.id === params.id);
  if (!script) return {};
  return {
    title: `${script.title} — Security Script`,
    description: script.shortDescription,
    openGraph: {
      title: `${script.title} — Security Script`,
      description: script.shortDescription,
      type: "article",
    },
  };
}

const catBadge: Record<string, string> = {
  detection: "border-cyber/40 bg-cyber/10 text-cyber",
  recon: "border-orange-400/40 bg-orange-400/10 text-orange-300",
  analysis: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  reporting: "border-green-400/40 bg-green-400/10 text-green-300",
};
const diffBadge: Record<string, string> = {
  beginner: "border-green-400/40 text-green-300",
  intermediate: "border-yellow-400/40 text-yellow-200",
  advanced: "border-red-400/40 text-red-300",
};

export default async function ScriptDetailPage({ params }: Props) {
  const realId = decodeProjectId(params.id);
  const script = scripts.find((s) => s.id === realId) ?? scripts.find((s) => s.id === params.id);
  if (!script) notFound();

  // Load full source from public/projects_docs at build time
  let fullCode = script.code;
  try {
    const filePath = path.join(process.cwd(), "public", "projects_docs", script.filename);
    fullCode = fs.readFileSync(filePath, "utf-8");
  } catch {
    // fall back to embedded code field if file not found
  }

  const idx = scripts.findIndex((s) => s.id === params.id);
  const prev = scripts[idx - 1];
  const next = scripts[idx + 1];

  return (
    <main className="section-bg min-h-screen px-4 py-20 md:px-6">
      <article className="mx-auto max-w-4xl space-y-8">

        {/* Back nav */}
        <nav className="flex flex-wrap items-center gap-3">
          <BackButton label="← Back to Scripts" />
          {prev && (
            <a href={`/scripts/${prev.id}`} className="glass-pill text-highlight/60 hover:text-highlight">
              ← {prev.title}
            </a>
          )}
          {next && (
            <a href={`/scripts/${next.id}`} className="glass-pill text-highlight/60 hover:text-highlight">
              {next.title} →
            </a>
          )}
        </nav>

        {/* Header */}
        <header className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] capitalize ${catBadge[script.category] ?? ""}`}>
                  {script.category}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] capitalize ${diffBadge[script.difficulty] ?? ""}`}>
                  {script.difficulty}
                </span>
                <span className="rounded-full border border-highlight/15 px-2.5 py-0.5 font-mono text-[11px] text-highlight/50 capitalize">
                  {script.language}
                </span>
              </div>
              <h1 className="font-display text-3xl text-highlight md:text-4xl">{script.title}</h1>
              <p className="font-mono text-sm text-highlight/50">{script.filename}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-highlight/75 leading-relaxed">{script.shortDescription}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {script.tech.map((t) => (
              <span key={t} className="glass-pill text-highlight/80">{t}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {script.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-highlight/10 px-2 py-0.5 font-mono text-[10px] text-highlight/45">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Purpose */}
        <Section icon="◎" title="Purpose">
          <p className="text-highlight/80 leading-relaxed">{script.purpose}</p>
        </Section>

        {/* Why */}
        <Section icon="⟡" title="Why I Built This">
          <p className="text-highlight/80 leading-relaxed">{script.why}</p>
        </Section>

        {/* How it works */}
        <Section icon="⊛" title="How It Works">
          <p className="text-highlight/80 leading-relaxed">{script.how}</p>
        </Section>

        {/* Setup */}
        <Section icon="⚙" title="Setup">
          <ol className="space-y-3">
            {script.setupSteps.map((step, i) => (
              <li key={step} className="flex gap-4 border-l-2 border-highlight/15 pl-4">
                <span className="shrink-0 font-mono text-[11px] text-accent/60 w-5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-highlight/80 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Full code */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-xl text-highlight">
            <span className="text-accent">⌨</span>
            Source Code
          </h2>
          <CodeBlock code={fullCode} lang={script.language} filename={script.filename} />
        </section>

        {/* Usage example */}
        <Section icon="▶" title="Usage Example">
          <CodeBlock code={script.usageExample} lang="bash" filename="terminal" />
        </Section>

        {/* Replication steps */}
        <Section icon="⟳" title="How to Replicate">
          <p className="mb-4 text-sm text-highlight/60">
            Step-by-step instructions to reproduce the setup and validate the script works correctly in your own environment.
          </p>
          <ol className="space-y-4">
            {script.replicationSteps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <span className="shrink-0 font-mono text-[13px] font-bold text-accent/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-highlight/80 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Lessons learned */}
        <Section icon="◉" title="Lessons Learned">
          <ul className="space-y-4">
            {script.lessonsLearned.map((l, i) => (
              <li key={l} className="flex gap-4 rounded-xl border border-highlight/10 bg-surface/10 p-4">
                <span className="shrink-0 font-mono text-sm text-accent/60">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-highlight/80 leading-relaxed">{l}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* Footer nav */}
        <footer className="flex flex-wrap gap-3 border-t border-highlight/10 pt-6">
          <BackButton label="← All Scripts" />
          {prev && (
            <a href={`/scripts/${prev.id}`} className="glass-pill text-highlight/60 hover:text-highlight">
              ← {prev.title}
            </a>
          )}
          {next && (
            <a href={`/scripts/${next.id}`} className="glass-pill border-accent/30 text-accent hover:border-accent/60">
              {next.title} →
            </a>
          )}
        </footer>
      </article>
    </main>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6 md:p-8">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-highlight">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
