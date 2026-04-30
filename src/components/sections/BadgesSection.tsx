"use client";

import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useEffect, useMemo, useState } from "react";

type GhPinnedRepo = { stars: number };
type GhStats = {
  pinned?: GhPinnedRepo[];
  totalContributions?: number | null;
};

export function BadgesSection() {
  const sectionRef = useSectionReveal(8);
  const [gh, setGh] = useState<GhStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) return;
        const data = (await res.json()) as GhStats;
        if (!cancelled) setGh(data);
      } catch {
        // Non-fatal: section still renders.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pinnedStars = useMemo(() => {
    const total =
      gh?.pinned?.reduce((sum, r) => sum + (Number(r.stars) || 0), 0) ?? 0;
    return total;
  }, [gh]);

  const githubContribs = gh?.totalContributions ?? null;

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
        <ParallaxDrift speed={0.1}>
          <h2 
            className="glitch-hover font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Community Badges
          </h2>
          <p 
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Public platform signals from GitHub and cyber training profiles. These
            connect code activity with hands-on security labs.
          </p>
        </ParallaxDrift>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div
            className="glass-card rounded-2xl p-6"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              CTF solved
            </p>
            <p className="mt-3 font-display text-3xl text-highlight">
              {profile.ctf.solved}
            </p>
            <p className="mt-2 font-mono text-[11px] text-highlight/60">
              Practice-focused learning
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-6"
            data-aos="fade-right"
            data-aos-delay="260"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              Bug bounty findings
            </p>
            <p className="mt-3 font-display text-3xl text-highlight">
              {profile.bugBounty.totalFindings}
            </p>
            <p className="mt-2 font-mono text-[11px] text-highlight/60">
              Security findings count
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-6"
            data-aos="fade-left"
            data-aos-delay="220"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              GitHub pinned stars
            </p>
            <p className="mt-3 font-display text-3xl text-highlight">
              {pinnedStars}
            </p>
            <p className="mt-2 font-mono text-[11px] text-highlight/60">
              From actively maintained repos
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-6"
            data-aos="fade-left"
            data-aos-delay="240"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              LeetCode
            </p>
            <p className="mt-3 font-display text-3xl text-highlight">—</p>
            <p className="mt-2 font-mono text-[11px] text-highlight/60">
              Add handle to show real stats
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-6"
            data-aos="fade-left"
            data-aos-delay="280"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              OSS contributions
            </p>
            <p className="mt-3 font-display text-3xl text-highlight">
              {githubContribs ?? "—"}
            </p>
            <p className="mt-2 font-mono text-[11px] text-highlight/60">
              Last-year contribution total
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-6" data-aos="fade-right" data-aos-delay="200">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              GitHub
            </p>
            <div className="mt-4 space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=111827"
                alt="GitHub profile badge"
                className="h-8 w-auto"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/Focus-Software%20Engineering-2e7a5a?style=for-the-badge"
                alt="Software engineering focus badge"
                className="h-8 w-auto"
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

          <div className="glass-card rounded-2xl p-6" data-aos="fade-left" data-aos-delay="300">
            <p className="font-mono text-xs uppercase tracking-wide text-highlight/50">
              TryHackMe + Hack The Box
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/TryHackMe-Profile-212C42?style=for-the-badge&logo=tryhackme&logoColor=white"
                alt="TryHackMe profile badge"
                className="h-8 w-auto"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/HackTheBox-Profile-111927?style=for-the-badge&logo=hackthebox&logoColor=9FEF00"
                alt="Hack The Box profile badge"
                className="h-8 w-auto"
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
