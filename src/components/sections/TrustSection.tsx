"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";

export function TrustSection() {
  const sectionRef = useSectionReveal(19);

  return (
    <section
      ref={sectionRef}
      id="trust"
      data-section="trust"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="19" sectionId="trust" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
            Trust & Verification
          </h2>
          <p className="mt-2 max-w-3xl font-sans text-highlight/70">
            Verifiable links and profile signals with transparent update timestamps.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/55">
              Verified profiles
            </p>
            <ul className="mt-3 space-y-2 text-sm text-highlight/80">
              <li>
                <a className="glass-pill inline-block underline" href={profile.social.github} target="_blank" rel="noreferrer">
                  GitHub profile
                </a>
              </li>
              <li>
                <a className="glass-pill inline-block underline" href={profile.social.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn profile
                </a>
              </li>
              <li>
                <a className="glass-pill inline-block underline" href={profile.social.thm} target="_blank" rel="noreferrer">
                  TryHackMe profile
                </a>
              </li>
              <li>
                <a className="glass-pill inline-block underline" href={profile.social.htb} target="_blank" rel="noreferrer">
                  Hack The Box profile
                </a>
              </li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/55">
              Evidence signals
            </p>
            <ul className="mt-3 space-y-2 text-sm text-highlight/80">
              <li>Last updated: Apr 2026</li>
              <li>Public badges and certifications linked in dedicated sections.</li>
              <li>Project case studies include outcomes and stack transparency.</li>
              <li>Contact channels include direct platform verification links.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

