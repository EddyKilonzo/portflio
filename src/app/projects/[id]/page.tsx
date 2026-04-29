import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectCredibility } from "@/content/portfolio";

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

export default function ProjectCaseStudyPage({ params }: Props) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();
  const cred = projectCredibility[project.id];

  return (
    <main className="section-bg min-h-screen px-6 py-20">
      <article className="mx-auto max-w-4xl space-y-6">
        <a href="/#projects" className="glass-pill inline-block text-highlight/80">
          Back to projects
        </a>
        <header className="glass-card rounded-2xl p-6">
          <h1 className="font-display text-4xl text-highlight">{project.title}</h1>
          <p className="mt-2 text-highlight/80">{project.shortDescription}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="glass-pill text-highlight/80">
                {t}
              </span>
            ))}
          </div>
        </header>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-highlight">Problem</h2>
          <p className="mt-2 text-highlight/80">{project.caseStudy.problem}</p>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-highlight">Approach</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-highlight/80">
            {project.caseStudy.approach.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-highlight">Results</h2>
          <p className="mt-2 text-highlight/80">{project.caseStudy.outcome}</p>
          {project.caseStudy.metrics?.length ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-highlight/75">
              {project.caseStudy.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-highlight">Lessons learned</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-highlight/80">
            {(project.caseStudy.lessonsLearned?.length
              ? project.caseStudy.lessonsLearned
              : [
                  "Scope architecture early so quality attributes are explicit.",
                  "Instrument outcomes with clear metrics to guide iteration.",
                  "Keep implementation modular to reduce maintenance cost.",
                ]
            ).map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </section>

        {cred ? (
          <section className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-2xl text-highlight">Quality metrics</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="glass-pill text-center">Perf {cred.performanceScore}</div>
              <div className="glass-pill text-center">A11y {cred.accessibilityScore}</div>
              <div className="glass-pill text-center">Lighthouse {cred.lighthouseScore}</div>
              <div className="glass-pill text-center">Load {cred.loadTime}</div>
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
