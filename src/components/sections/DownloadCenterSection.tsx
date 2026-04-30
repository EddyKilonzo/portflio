"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { profile } from "@/content/portfolio";

const downloads = [
  { title: "Engineering CV", note: "Backend, platform, reliability focus.", variant: "developer" },
  { title: "Cybersecurity CV", note: "Security operations and assessment focus.", variant: "cyber" },
  { title: "Product/UX CV", note: "Experience and interface delivery focus.", variant: "design" },
  { title: "One-page Summary", note: "Quick snapshot for recruiters and clients.", variant: "developer" },
];

export function DownloadCenterSection() {
  const sectionRef = useSectionReveal(18);

  return (
    <section
      ref={sectionRef}
      id="downloads"
      data-section="downloads"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="18" sectionId="downloads" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <div data-aos="fade-up">
            <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
              Download Center
            </h2>
            <p className="mt-2 max-w-3xl font-sans text-highlight/70">
              Tailored CV variants and summary sheets for different review contexts.
            </p>
          </div>
        </ParallaxDrift>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {downloads.map((item, idx) => (
            <article
              key={item.title}
              className="glass-card rounded-2xl p-5"
              data-aos="fade-up"
              data-aos-delay={idx * 60}
            >
              <h3 className="font-display text-2xl text-highlight">{item.title}</h3>
              <p className="mt-2 text-sm text-highlight/75">{item.note}</p>
              <a
                href={`/api/resume?variant=${item.variant}`}
                className="glass-pill mt-4 inline-block text-highlight/85"
              >
                Download
              </a>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2" data-aos="fade-up" data-aos-delay="160">
          <a href={`mailto:${profile.email}`} className="btn-ghost text-xs">Email</a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="btn-ghost text-xs">LinkedIn</a>
          <a href={profile.social.github} target="_blank" rel="noreferrer" className="btn-ghost text-xs">GitHub</a>
        </div>
      </div>
    </section>
  );
}

