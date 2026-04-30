"use client";

import { SectionNumber } from "@/components/layout/SectionNumber";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

const availabilityLabel: Record<string, string> = {
  open: "Open to work",
  freelance: "Freelancing",
  unavailable: "Unavailable",
};

export function AboutSection() {
  const sectionRef = useSectionReveal(1);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="01" sectionId="about" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-6">
        <ParallaxDrift speed={0.15} className="md:col-span-4 md:row-span-2">
          <div 
            className="glass-card h-full rounded-2xl p-6"
            data-aos="fade-up"
          >
            <h2 className="mb-4 font-display text-4xl text-highlight md:text-5xl">
              About
            </h2>
            <p className="max-w-3xl font-sans text-lg text-highlight/80">
              Full-stack developer and creative technologist focused on modern web
              engineering, UI/UX craft, and practical cybersecurity fundamentals.
              I turn ideas into clean, user-centered digital products with an
              emphasis on reliability and polish.
            </p>
            <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-highlight/70">
              {profile.homelab}
            </p>
          </div>
        </ParallaxDrift>

        <ParallaxDrift speed={0.25} className="md:col-span-2">
          <aside 
            className="glass-card rounded-2xl border border-highlight/15 p-5"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Availability
            </p>
            <p className="mt-2 font-display text-2xl text-highlight">
              {availabilityLabel[profile.availability] ?? "Open"}
            </p>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Focus areas
            </p>
            <ul className="mt-2 space-y-1 font-sans text-sm text-highlight/75">
              <li>Secure software delivery</li>
              <li>Cybersecurity operations</li>
              <li>Performance-focused web UX</li>
            </ul>
          </aside>
        </ParallaxDrift>

        <ParallaxDrift speed={0.35} className="md:col-span-2">
          <aside 
            className="glass-card rounded-2xl border border-highlight/15 p-5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Proof</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-lg border border-highlight/15 p-2">
                <p className="text-highlight/50">CTF Solved</p>
                <p className="text-lg text-highlight">{profile.ctf.solved}</p>
              </div>
              <div className="rounded-lg border border-highlight/15 p-2">
                <p className="text-highlight/50">Badges</p>
                <p className="text-lg text-highlight">{profile.ctf.badges}</p>
              </div>
              <div className="rounded-lg border border-highlight/15 p-2">
                <p className="text-highlight/50">Findings</p>
                <p className="text-lg text-highlight">{profile.bugBounty.totalFindings}</p>
              </div>
              <div className="rounded-lg border border-highlight/15 p-2">
                <p className="text-highlight/50">Status</p>
                <p className="text-lg text-highlight">Active</p>
              </div>
            </div>
          </aside>
        </ParallaxDrift>
      </div>
    </section>
  );
}
