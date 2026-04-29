"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useMemo } from "react";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Eddy consistently turns ambiguous requirements into polished delivery, with a security-first mindset baked into the process - not bolted on after.",
    name: "Product Lead",
    role: "Client / Delivery Partner",
  },
  {
    id: "t2",
    quote:
      "What stands out is the clarity: clean architecture, observable systems, and walkthroughs that make teams faster the next time around.",
    name: "Engineering Manager",
    role: "Backend & Platform",
  },
  {
    id: "t3",
    quote:
      "Great balance of creative UI craft and practical engineering. The result is work that feels premium and remains maintainable.",
    name: "Design Systems Lead",
    role: "Frontend / UX",
  },
];

export function TestimonialsSection() {
  const sectionRef = useSectionReveal(14);
  const randomized = useMemo(() => {
    // Keep stable output per mount; avoids layout shift from re-sorting each render.
    return testimonials;
  }, []);

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
            data-aos-delay="100"
          >
            Short endorsements that highlight how I work: clarity, security-first delivery, and repeatable outcomes.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {randomized.map((t, idx) => (
            <div
              key={t.id}
              className="glass-card rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-delay={idx * 70}
            >
              <p className="font-sans text-sm leading-relaxed text-highlight/85">
                &quot;{t.quote}&quot;
              </p>
              <div className="mt-5">
                <p className="font-display text-lg text-highlight">{t.name}</p>
                <p className="mt-1 font-mono text-xs text-highlight/55">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

