"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { faqs } from "@/content/portfolio";

export function FaqSection() {
  const sectionRef = useSectionReveal(15);

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-section="faq"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="15" sectionId="faq" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2
            className="glitch-hover font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            FAQ
          </h2>
          <p
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Quick answers about availability, collaboration, and how security fits into delivery.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="glass-card rounded-2xl p-6">
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-xl border border-highlight/10 bg-surface/10 px-4 py-3"
                >
                  <summary className="cursor-pointer font-display text-lg text-highlight">
                    {f.q}
                  </summary>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-highlight/75">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <aside className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              Still have questions?
            </p>
            <p className="mt-4 font-display text-2xl text-highlight">Let&apos;s talk.</p>
            <p className="mt-2 font-sans text-sm text-highlight/70">
              Send a message and include what you&apos;re building plus any deadlines. I&apos;ll respond with a
              clear plan for the next steps.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-block font-mono text-xs text-accent underline"
            >
              Jump to contact -&gt;
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

