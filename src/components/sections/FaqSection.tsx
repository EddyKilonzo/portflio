"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { faqs as staticFaqs } from "@/content/portfolio";
import { useState } from "react";
import { useSanityFetch } from "@/hooks/useSanityFetch";
import { getFaqs } from "@/lib/sanityQueries";

export function FaqSection() {
  const sectionRef = useSectionReveal(15);
  const faqs = useSanityFetch(getFaqs, staticFaqs);
  const [open, setOpen] = useState<string | null>(staticFaqs[0]?.id ?? null);

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-section="faq"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="12" sectionId="faq" />
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
            data-aos-delay="80"
          >
            Quick answers about availability, collaboration, and how security fits into delivery.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const isOpen = open === f.id;
              return (
                <div
                  key={f.id}
                  className="glass-card overflow-hidden rounded-xl"
                  data-aos="fade-up"
                  data-aos-delay={80 + idx * 55}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display text-base text-highlight">{f.q}</span>
                    {/* Animated +/× toggle */}
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-highlight/20 font-mono text-sm font-light text-highlight/55 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>

                  {/* Animated collapse */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "240px" : "0px",
                      transition: "max-height 0.32s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <p className="border-t border-highlight/8 px-5 pb-4 pt-3 font-sans text-sm leading-relaxed text-highlight/70">
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aside card */}
          <aside
            className="glass-card flex flex-col rounded-2xl p-6"
            data-aos="fade-left"
            data-aos-delay="150"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-highlight/40">
              Still have questions?
            </p>
            <p className="mt-4 font-display text-2xl text-highlight">Let&apos;s talk.</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-highlight/65">
              Send a message with what you&apos;re building and any deadlines. I&apos;ll come back with a clear plan
              for next steps.
            </p>
            <a
              href="#contact"
              className="mt-auto pt-5 inline-flex items-center gap-1.5 font-mono text-sm text-accent transition-opacity hover:opacity-75"
            >
              Jump to contact →
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
