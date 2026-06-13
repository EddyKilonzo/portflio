"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { testimonials } from "@/content/portfolio";

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useSectionReveal(14);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      data-section="testimonials"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="14" sectionId="testimonials" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2
            className="glitch-hover font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Testimonials
          </h2>
          <p
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            What collaborators say about working with me.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, idx) => {
            const initials = t.name
              .split(" ")
              .map((w) => w[0] ?? "")
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={t.id}
                className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={idx * 90}
              >
                {/* Decorative large quote mark */}
                <div
                  className="pointer-events-none absolute -left-1 -top-3 select-none font-display text-[96px] leading-none text-highlight/[0.04]"
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <StarRow />

                {/* Quote */}
                <blockquote className="relative z-10 mt-4 font-sans text-sm leading-relaxed text-highlight/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 font-mono text-xs font-bold text-accent"
                    aria-hidden
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm leading-tight text-highlight">{t.name}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-highlight/45">
                      {t.role}{t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
