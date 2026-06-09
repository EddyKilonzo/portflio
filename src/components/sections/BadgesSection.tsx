"use client";

import { profile, certs, type Cert } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useEffect, useMemo, useState } from "react";
import { PdfModal } from "@/components/ui/PdfModal";

type GhPinnedRepo = { stars: number };
type GhStats = {
  pinned?: GhPinnedRepo[];
  totalContributions?: number | null;
};

const catColor: Record<Cert["category"], string> = {
  security: "border-accent/40 bg-accent/10 text-accent",
  cloud:    "border-accent/30 bg-accent/8 text-accent/80",
  language: "border-accent/30 bg-accent/8 text-accent/80",
  os:       "border-accent/30 bg-accent/8 text-accent/80",
  platform: "border-accent/40 bg-accent/10 text-accent",
};

const localBadgeMap: Record<string, string> = {
  "i2cs":     "/badges/introduction-to-cybersecurity.png",
  "os-basics":"/badges/operating-systems-basics.png",
};

type BadgeEntry = { id: string; src: string; title: string; issuer: string; date?: string; pdfUrl: string };

function BadgeCard({ badge, index = 0 }: { badge: BadgeEntry; index?: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <>
      <article
        className="glass-card flex flex-col items-center gap-4 rounded-2xl p-6 text-center"
        data-aos="fade-up"
        data-aos-delay={index * 80}
        data-aos-once="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badge.src} alt={badge.title} className="h-28 w-28 rounded-full object-cover shadow-md" />
        <div>
          <h3 className="font-display text-base text-highlight leading-snug">{badge.title}</h3>
          <p className="mt-0.5 font-mono text-xs text-accent/70">{badge.issuer}</p>
          {badge.date && <p className="mt-0.5 font-mono text-[10px] text-highlight/40">{badge.date}</p>}
        </div>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
        >
          ◎ View Certificate
        </button>
      </article>
      <PdfModal pdfUrl={badge.pdfUrl} title={badge.title} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}

function CertCard({ cert, index = 0 }: { cert: Cert; index?: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const badgeSrc = localBadgeMap[cert.id];
  return (
    <>
      <article
        className="glass-card flex flex-col gap-3 rounded-2xl p-6 min-h-[200px]"
        data-aos="fade-up"
        data-aos-delay={index * 80}
        data-aos-once="true"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {badgeSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badgeSrc} alt={`${cert.title} badge`} className="h-8 w-8 rounded-full object-cover" />
            )}
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] capitalize ${catColor[cert.category]}`}>
              {cert.category}
            </span>
          </div>
          {cert.date && (
            <span className="font-mono text-[10px] text-highlight/40 shrink-0">{cert.date}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-highlight leading-snug">{cert.title}</h3>
          <p className="mt-0.5 font-mono text-xs text-accent/70">{cert.issuer}</p>
          <p className="mt-2 font-sans text-sm text-highlight/60 leading-relaxed">{cert.description}</p>
          {cert.why && (
            <p className="mt-3 border-l-2 border-accent/40 pl-3 font-sans text-xs italic text-accent/90 leading-relaxed">
              {cert.why}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
        >
          ◎ Preview Certificate
        </button>
      </article>
      <PdfModal
        pdfUrl={cert.pdfUrl}
        title={cert.title}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}

export function BadgesSection() {
  const sectionRef = useSectionReveal(8);
  const [tab, setTab] = useState<"certs" | "badges">("certs");
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
        // Non-fatal
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const pinnedStars = useMemo(
    () => gh?.pinned?.reduce((sum, r) => sum + (Number(r.stars) || 0), 0) ?? 0,
    [gh],
  );

  const githubContribs = gh?.totalContributions ?? null;

  const tabBtn = (id: "certs" | "badges", label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-lg border px-5 py-2 font-mono text-xs transition-colors ${
        tab === id
          ? "border-accent bg-accent/10 text-accent"
          : "border-highlight/15 text-highlight/60 hover:border-highlight/30 hover:text-highlight"
      }`}
    >
      {label}
    </button>
  );

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
            Credentials
          </h2>
          <p
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Certificates earned through structured courses and platform learning paths.
          </p>
        </ParallaxDrift>

        {/* Tabs */}
        <div className="mt-8 flex gap-3" data-aos="fade-up" data-aos-delay="120">
          {tabBtn("certs", "Certificates")}
          {tabBtn("badges", "Platform Badges")}
        </div>

        {/* Certs tab */}
        {tab === "certs" && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        )}

        {/* Badges tab */}
        {tab === "badges" && (
          <div className="mt-6 space-y-6">
            {/* Earned badge cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "i2cs",
                  src: "/badges/introduction-to-cybersecurity.png",
                  title: "Introduction to Cybersecurity",
                  issuer: "Cisco Networking Academy",
                  date: "Feb 2026",
                  pdfUrl: "/certs/I2CSUpdate20260204-32-ry2hbk.pdf",
                },
                {
                  id: "os-basics",
                  src: "/badges/operating-systems-basics.png",
                  title: "Operating Systems Basics",
                  issuer: "Cisco Networking Academy",
                  date: "Feb 2026",
                  pdfUrl: "/certs/OperatingSystemsBasicsUpdate20260204-31-bkrteh.pdf",
                },
              ].map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} index={i} />
              ))}
            </div>

          </div>
        )}

        {/* Platforms — always visible */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://tryhackme.com/p/eddy.kilonzo"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-up"
            data-aos-delay="0"
            data-aos-once="true"
            className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-[#212C42]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.shields.io/badge/THM-212C42?logo=tryhackme&logoColor=white&style=flat-square" alt="TryHackMe" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-base text-highlight">TryHackMe</p>
              <p className="font-mono text-[11px] text-accent/70">eddy.kilonzo</p>
              <p className="font-mono text-[10px] text-highlight/40">SOC Level 1 path</p>
            </div>
            <span className="ml-auto font-mono text-xs text-highlight/30">↗</span>
          </a>

          <a
            href="https://github.com/EddyKilonzo"
            target="_blank"
            rel="noreferrer"
            data-aos="fade-up"
            data-aos-delay="80"
            data-aos-once="true"
            className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-highlight/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.shields.io/badge/GH-181717?logo=github&logoColor=white&style=flat-square" alt="GitHub" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-base text-highlight">GitHub</p>
              <p className="font-mono text-[11px] text-accent/70">EddyKilonzo</p>
              <p className="font-mono text-[10px] text-highlight/40">Projects &amp; code</p>
            </div>
            <span className="ml-auto font-mono text-xs text-highlight/30">↗</span>
          </a>

          <a
            href={profile.social.htb}
            target="_blank"
            rel="noreferrer"
            data-aos="fade-up"
            data-aos-delay="160"
            data-aos-once="true"
            className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-[#9FEF00]/20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.shields.io/badge/HTB-111927?logo=hackthebox&logoColor=9FEF00&style=flat-square" alt="HackTheBox" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-base text-highlight">HackTheBox</p>
              <p className="font-mono text-[11px] text-accent/70">Rank: {profile.ctf.htbRank}</p>
              <p className="font-mono text-[10px] text-highlight/40">CTF labs &amp; machines</p>
            </div>
            <span className="ml-auto font-mono text-xs text-highlight/30">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
