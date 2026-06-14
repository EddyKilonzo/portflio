"use client";

import { profile, certs as staticCerts, type Cert } from "@/content/portfolio";
import { useSanityFetch } from "@/hooks/useSanityFetch";
import { getCerts } from "@/lib/sanityQueries";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { AnimeHoverBloom } from "@/components/motion/AnimeHoverBloom";
import { useState } from "react";
import { PdfModal } from "@/components/ui/PdfModal";

const catColor: Record<Cert["category"], string> = {
  security:    "border-accent/40 bg-accent/10 text-accent",
  cloud:       "border-accent/30 bg-accent/8 text-accent/80",
  development: "border-eng/40 bg-eng/10 text-eng",
  language:    "border-accent/30 bg-accent/8 text-accent/80",
  os:          "border-accent/30 bg-accent/8 text-accent/80",
  platform:    "border-accent/40 bg-accent/10 text-accent",
};

const localBadgeMap: Record<string, string> = {
  "i2cs":      "/badges/introduction-to-cybersecurity.png",
  "os-basics": "/badges/operating-systems-basics.png",
  "thm-cert-1":"/logos/thm.png",
  "thm-cert-2":"/logos/thm.png",
  "ibm-cad":   "/logos/ibm.png",
  "cti":       "/logos/arcx.jfif",
  "efset":     "/logos/efset.png",
};

type BadgeEntry = { id: string; src: string; title: string; issuer: string; date?: string; pdfUrl: string };

function BadgeCard({ badge, index = 0 }: { badge: BadgeEntry; index?: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <>
      <article
        className="glass-card flex flex-col items-center gap-4 rounded-2xl p-6 text-center"
        data-aos="fade-up"
        data-aos-delay={Math.min(index * 80, 160)}
       
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badge.src} alt={badge.title} className="h-28 w-28 rounded-full object-cover shadow-md" />
        <div>
          <h3 className="font-display text-base text-highlight leading-snug">{badge.title}</h3>
          <p className="mt-0.5 font-mono text-xs text-accent/70">{badge.issuer}</p>
          {badge.date && <p className="mt-0.5 font-mono text-[10px] text-highlight/60">{badge.date}</p>}
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
        className="glass-card flex flex-col gap-3 rounded-2xl p-4 sm:p-6"
        data-aos="fade-up"
        data-aos-delay={Math.min(index * 80, 160)}
       
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {badgeSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={badgeSrc}
                alt={`${cert.title} badge`}
                className="h-10 w-10 rounded-lg object-contain p-0.5 shrink-0"
                style={{ background: "rgba(168,217,184,0.08)", border: "1px solid rgba(168,217,184,0.15)" }}
              />
            )}
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] capitalize ${catColor[cert.category]}`}>
              {cert.category}
            </span>
          </div>
          {cert.date && (
            <span className="font-mono text-[10px] text-highlight/60 shrink-0">{cert.date}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base sm:text-lg text-highlight leading-snug">{cert.title}</h3>
          <p className="mt-0.5 font-mono text-xs text-accent/70">{cert.issuer}</p>
          <p className="mt-2 font-sans text-sm text-highlight/60 leading-relaxed line-clamp-3 sm:line-clamp-none">{cert.description}</p>
          {cert.why && (
            <p className="mt-2 hidden sm:block border-l-2 border-accent/40 pl-3 font-sans text-xs italic text-accent/90 leading-relaxed">
              {cert.why}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-4 py-2 sm:py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
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
  const certs = useSanityFetch(getCerts, staticCerts);
  const [tab, setTab] = useState<"certs" | "badges">("certs");

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
          <AnimeHoverBloom data-aos="fade-up" data-aos-delay="0">
            <a
              href="https://tryhackme.com/p/eddy.kilonzo"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/THM-212C42?logo=tryhackme&logoColor=white&style=flat-square" alt="TryHackMe" className="h-8 w-auto shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-base text-highlight">TryHackMe</p>
                <p className="font-mono text-[11px] text-accent/70">eddy.kilonzo</p>
                <p className="font-mono text-[10px] text-highlight/60">SOC Level 1 path</p>
              </div>
              <span className="ml-auto font-mono text-xs text-highlight/55">↗</span>
            </a>
          </AnimeHoverBloom>

          <AnimeHoverBloom data-aos="fade-up" data-aos-delay="80">
            <a
              href="https://github.com/EddyKilonzo"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-highlight/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/GH-181717?logo=github&logoColor=white&style=flat-square" alt="GitHub" className="h-8 w-auto shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-base text-highlight">GitHub</p>
                <p className="font-mono text-[11px] text-accent/70">EddyKilonzo</p>
                <p className="font-mono text-[10px] text-highlight/60">Projects &amp; code</p>
              </div>
              <span className="ml-auto font-mono text-xs text-highlight/55">↗</span>
            </a>
          </AnimeHoverBloom>

          <AnimeHoverBloom data-aos="fade-up" data-aos-delay="160">
            <a
              href={profile.social.htb}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-accent/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/badge/HTB-111927?logo=hackthebox&logoColor=9FEF00&style=flat-square" alt="HackTheBox" className="h-8 w-auto shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-base text-highlight">HackTheBox</p>
                <p className="font-mono text-[11px] text-accent/70">Rank: {profile.ctf.htbRank}</p>
                <p className="font-mono text-[10px] text-highlight/60">CTF labs &amp; machines</p>
              </div>
              <span className="ml-auto font-mono text-xs text-highlight/55">↗</span>
            </a>
          </AnimeHoverBloom>
        </div>
      </div>
    </section>
  );
}
