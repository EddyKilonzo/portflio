"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";

const packages = [
  {
    name: "Launch Sprint",
    detail: "2-week focused delivery for MVP features and production polish.",
  },
  {
    name: "Security Review",
    detail: "Targeted review of auth, input validation, and deployment posture.",
  },
  {
    name: "UX Performance Pass",
    detail: "Mobile-first optimization, accessibility fixes, and motion tuning.",
  },
];

export function BookingSection() {
  const sectionRef = useSectionReveal(17);

  return (
    <section
      ref={sectionRef}
      id="booking"
      data-section="booking"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="11" sectionId="booking" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
            Availability + Booking
          </h2>
          <p className="mt-2 max-w-3xl font-sans text-highlight/70">
            Structured collaboration packages with a clear booking path.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <article
                key={pkg.name}
                className="glass-card rounded-2xl p-5"
                data-aos="fade-up"
                data-aos-delay={idx * 70}
              >
                <h3 className="font-display text-xl text-highlight">{pkg.name}</h3>
                <p className="mt-2 text-sm text-highlight/75">{pkg.detail}</p>
              </article>
            ))}
          </div>

          <aside className="glass-card rounded-2xl p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              Book a call
            </p>
            <p className="mt-3 text-sm text-highlight/80">
              Pick a slot for a discovery call and share your goals before we start.
            </p>
            <a
              href="https://cal.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-5 inline-block border-accent/40 px-4 py-2 text-xs text-accent"
            >
              Open Booking Calendar
            </a>
            <a href="#contact" className="glass-pill mt-3 inline-block text-highlight/75 underline">
              Prefer form-based inquiry? Go to Contact.
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

