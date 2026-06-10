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
              I am a <strong className="text-highlight font-semibold">software engineer and web developer</strong> making a deliberate transition into cybersecurity.
              I spent years building full-stack applications — React frontends, NestJS APIs, and cloud-deployed services — and now I am applying that same engineering mindset to blue team operations.
              Understanding how systems are built gives me a real edge in understanding how they can be broken and defended.
            </p>
            <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-highlight/70">
              I am a <strong className="text-highlight/80 font-medium">SOC Analyst focused on blue team operations</strong> — learning to monitor networks, investigate security alerts, and respond to incidents.
              I have been building my skills through hands-on home lab work, CTF challenges on TryHackMe and HackTheBox, and self-directed study of tools used in real Security Operations Centres.
            </p>
            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-highlight/70">
              {profile.homelab}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 max-w-2xl">
              {[
                "SOC / Blue Team", "Threat Detection", "Incident Response",
                "SIEM (Wazuh / Splunk)", "Log Analysis", "Alert Triage",
                "Full-Stack Dev", "React / Next.js", "NestJS / Node",
                "MITRE ATT&CK",
              ].map(kw => (
                <span key={kw} className="rounded-full border border-cyber/25 bg-cyber/8 px-3 py-1 font-mono text-[11px] text-cyber/80">
                  {kw}
                </span>
              ))}
            </div>
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
              <li>SOC alert triage & blue team ops</li>
              <li>Full-stack engineering (React, NestJS)</li>
              <li>Home lab attack simulation</li>
              <li>Incident response & threat detection</li>
            </ul>
          </aside>
        </ParallaxDrift>

        <ParallaxDrift speed={0.35} className="md:col-span-2">
          <aside
            className="glass-card rounded-2xl border border-highlight/15 p-5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Active Learning</p>
            <div className="mt-3 space-y-3">
              {[
                {
                  logoSrc: "https://img.shields.io/badge/TryHackMe-SOC%20L1-212C42?logo=tryhackme&logoColor=white&style=flat-square",
                  label: "TryHackMe",
                  detail: "SOC Level 1 path",
                  href: "https://tryhackme.com/p/eddy.kilonzo",
                },
                {
                  logoSrc: "https://img.shields.io/badge/CompTIA-Security+-EA0000?logo=comptia&logoColor=white&style=flat-square",
                  label: "CompTIA Security+",
                  detail: "Exam prep in progress",
                  href: "https://www.comptia.org/certifications/security",
                },
                {
                  logoSrc: "https://img.shields.io/badge/Home%20Lab-VirtualBox-183A61?logo=virtualbox&logoColor=white&style=flat-square",
                  label: "Home Lab",
                  detail: "Kali Linux + Wazuh SIEM",
                  href: null as string | null,
                },
              ].map(({ logoSrc, label, detail, href }) => (
                <a
                  key={label}
                  href={href ?? undefined}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noreferrer" : undefined}
                  className={`flex items-center gap-3 rounded-xl border border-highlight/10 bg-surface/10 px-3 py-2.5 transition-colors ${href ? "hover:border-highlight/20 cursor-pointer" : "cursor-default"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoSrc} alt={label} className="h-5 w-auto shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-highlight/80">{label}</p>
                    <p className="font-mono text-[10px] text-highlight/65">{detail}</p>
                  </div>
                  {href && <span className="font-mono text-[10px] text-accent/60">↗</span>}
                </a>
              ))}
            </div>
          </aside>
        </ParallaxDrift>
      </div>
    </section>
  );
}
