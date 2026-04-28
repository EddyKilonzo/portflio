"use client";

import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";

export function BadgesSection() {
  const sectionRef = useSectionReveal(8);

  return (
    <section
      ref={sectionRef}
      id="badges"
      data-section="badges"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="08" sectionId="badges" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 className="glitch-hover font-display text-4xl text-highlight md:text-5xl">
          Community Badges
        </h2>
        <p className="mt-2 max-w-3xl font-sans text-highlight/70">
          Public platform signals from GitHub and cyber training profiles. These
          connect code activity with hands-on security labs.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              GitHub
            </p>
            <div className="mt-4 space-y-3">
              <img
                src={`https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=111827`}
                alt="GitHub profile badge"
                className="h-8"
              />
              <img
                src={`https://img.shields.io/badge/Focus-Software%20Engineering-2e7a5a?style=for-the-badge`}
                alt="Software engineering focus badge"
                className="h-8"
              />
            </div>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-mono text-xs text-accent underline"
            >
              Open GitHub profile
            </a>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              TryHackMe + Hack The Box
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <img
                src="https://img.shields.io/badge/TryHackMe-Profile-212C42?style=for-the-badge&logo=tryhackme&logoColor=white"
                alt="TryHackMe profile badge"
                className="h-8"
              />
              <img
                src="https://img.shields.io/badge/HackTheBox-Profile-111927?style=for-the-badge&logo=hackthebox&logoColor=9FEF00"
                alt="Hack The Box profile badge"
                className="h-8"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs">
              <a
                href={profile.social.thm}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Open TryHackMe
              </a>
              <a
                href={profile.social.htb}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                Open Hack The Box
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
