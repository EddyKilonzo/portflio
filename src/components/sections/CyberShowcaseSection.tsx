"use client";

import { CyberOrbit } from "@/components/cyber/CyberOrbit";
import { MatrixRain } from "@/components/cyber/MatrixRain";
import { cveLog, profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { MagneticAnchor } from "@/components/ui/MagneticButton";
import { CountUp } from "@/components/ui/CountUp";
import dynamic from "next/dynamic";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

const CyberDemo = dynamic(
  () => import("@/components/demos/CyberDemo").then((m) => m.CyberDemo),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-surface/35" />
          <div className="h-64 animate-pulse rounded-xl border border-highlight/15 bg-surface/20" />
        </div>
        <div className="space-y-4">
          <div className="glass-card h-24 animate-pulse rounded-xl p-4" />
          <div className="glass-card h-24 animate-pulse rounded-xl p-4" />
        </div>
      </div>
    ),
  },
);

function severityColor(s: string) {
  if (s === "critical") return "text-red-400 border-red-400/50";
  if (s === "high") return "text-orange-400 border-orange-400/50";
  if (s === "medium") return "text-yellow-300 border-yellow-300/40";
  return "text-blue-300 border-blue-300/40";
}

const severityBars = [
  { label: "Critical", count: profile.bugBounty.severities.critical, bar: "bg-red-500/80",    text: "text-red-400"    },
  { label: "High",     count: profile.bugBounty.severities.high,     bar: "bg-orange-500/80", text: "text-orange-400" },
  { label: "Medium",   count: profile.bugBounty.severities.medium,   bar: "bg-yellow-400/80", text: "text-yellow-300" },
  { label: "Low",      count: profile.bugBounty.severities.low,      bar: "bg-blue-400/80",   text: "text-blue-300"   },
];

const methodology = [
  { phase: "01", label: "Recon",   desc: "OSINT, footprinting & attack surface mapping",         accent: "border-t-highlight/40"  },
  { phase: "02", label: "Scan",    desc: "Port scanning, service enumeration & vuln assessment", accent: "border-t-eng/60"        },
  { phase: "03", label: "Exploit", desc: "Payload delivery, privesc & lateral movement",          accent: "border-t-cyber/60"      },
  { phase: "04", label: "Report",  desc: "CVSS scoring, responsible disclosure & remediation",   accent: "border-t-accent/60"     },
];

const toolsArsenal = [
  "Burp Suite", "Metasploit", "Wireshark", "Nmap", "Kali Linux",
  "OWASP ZAP", "Nikto", "SQLmap", "John the Ripper", "Hashcat",
  "Ghidra", "Shodan", "theHarvester", "Gobuster", "Responder",
  "BloodHound", "Mimikatz", "Nuclei",
];

export function CyberShowcaseSection() {
  const sectionRef = useSectionReveal(3);
  const total = profile.bugBounty.totalFindings;

  return (
    <section
      ref={sectionRef}
      id="cyber"
      data-section="cyber"
      className="relative overflow-hidden py-24 section-bg"
      style={{ "--section-tint": "rgba(255, 76, 76, 0.05)" } as React.CSSProperties}
    >
      <MatrixRain className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.18]" />
      <SectionNumber n="05" sectionId="cyber" />
      <DecorNetwork />

      <div className="absolute right-4 top-24 z-[1] hidden h-40 w-40 opacity-80 md:block lg:right-10 lg:top-28 lg:h-52 lg:w-52">
        <CyberOrbit className="h-full w-full rounded-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Heading */}
        <ParallaxDrift speed={0.1}>
          <h2
            className="glitch-hover mb-3 font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Security &amp; Research
          </h2>
          <p
            className="mb-10 max-w-2xl font-mono text-xs text-highlight/55"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            Bug hunting, CTF competition, responsible disclosure and hands-on penetration testing — a live snapshot of active security work.
          </p>
        </ParallaxDrift>

        {/* Stat row */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Bug Findings — numeric CountUp, aurora glow */}
          <div
            className="glass-card aurora-glow rounded-2xl p-5 text-center"
            data-aos="zoom-in"
            data-aos-delay={0}
          >
            <p className="font-display text-3xl text-highlight">
              <CountUp target={total} />
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-highlight/50">Bug Findings</p>
          </div>
          {/* HTB Rank — string, no countup */}
          <div
            className="glass-card rounded-2xl p-5 text-center"
            data-aos="zoom-in"
            data-aos-delay={70}
          >
            <p className="font-display text-3xl text-highlight">{profile.ctf.htbRank}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-highlight/50">HTB Rank</p>
          </div>
          {/* THM Rank — string, no countup */}
          <div
            className="glass-card rounded-2xl p-5 text-center"
            data-aos="zoom-in"
            data-aos-delay={140}
          >
            <p className="font-display text-3xl text-highlight">{profile.ctf.thmRank}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-highlight/50">THM Rank</p>
          </div>
          {/* CTF Solved — numeric CountUp, aurora glow */}
          <div
            className="glass-card aurora-glow rounded-2xl p-5 text-center"
            data-aos="zoom-in"
            data-aos-delay={210}
          >
            <p className="font-display text-3xl text-highlight">
              <CountUp target={profile.ctf.solved} />
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-highlight/50">CTF Solved</p>
          </div>
        </div>

        {/* Bug bounty + CVE grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Bug bounty severity breakdown */}
          <div className="glass-card space-y-5 rounded-2xl p-6" data-aos="fade-right" data-aos-delay="80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-highlight/50">Bug Bounty</p>
                <p className="mt-1 font-display text-3xl text-highlight">
                  {total} <span className="text-lg font-sans text-highlight/55">findings</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.bugBounty.platforms.map((p) => (
                  <span key={p} className="rounded-full border border-highlight/20 px-2.5 py-0.5 font-mono text-[10px] text-highlight/70">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {severityBars.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`w-16 shrink-0 font-mono text-[10px] ${s.text}`}>{s.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface/40">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${s.bar}`}
                      style={{ width: `${Math.round((s.count / total) * 100)}%` }}
                    />
                  </div>
                  <span className={`w-4 text-right font-mono text-xs ${s.text}`}>{s.count}</span>
                </div>
              ))}
            </div>

            <p className="font-mono text-[10px] text-highlight/60">
              Hall of Fame: {profile.bugBounty.hallOfFame.join(", ")}
            </p>

            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <MagneticAnchor href={profile.social.htb} target="_blank" rel="noreferrer" className="text-accent underline hover:text-highlight">
                HTB profile →
              </MagneticAnchor>
              <MagneticAnchor href={profile.social.thm} target="_blank" rel="noreferrer" className="text-accent underline hover:text-highlight">
                THM profile →
              </MagneticAnchor>
              <MagneticAnchor href={profile.social.github} target="_blank" rel="noreferrer" className="text-accent underline hover:text-highlight">
                GitHub →
              </MagneticAnchor>
            </div>
          </div>

          {/* CVE log */}
          <div className="glass-card max-h-72 overflow-y-auto rounded-2xl p-6" data-aos="fade-left" data-aos-delay="120">
            <p className="mb-4 font-mono text-xs text-highlight/50">CVE &amp; Disclosure Log</p>
            <ul className="space-y-3">
              {cveLog.map((c) => (
                <li key={c.id} className="border-l-2 border-highlight/20 pl-3 font-mono text-xs leading-relaxed">
                  <span className={`${severityColor(c.severity)} mr-1`}>{c.severity}</span>
                  {c.cve ?? "responsible disclosure"} — {c.software}{" "}
                  <span className="text-highlight/65">{c.disclosed}</span>{" "}
                  <span className="text-accent">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Penetration testing methodology */}
        <div className="mb-8" data-aos="fade-up">
          <p className="mb-4 font-mono text-xs text-highlight/50">Penetration Testing Methodology</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methodology.map((m, i) => (
              <div
                key={m.phase}
                className={`glass-card rounded-2xl border-t-2 p-5 ${m.accent}`}
                data-aos="fade-up"
                data-aos-delay={i * 75}
              >
                <p className="mb-1 font-mono text-[10px] text-highlight/55">{m.phase}</p>
                <p className="font-display text-lg text-highlight">{m.label}</p>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-highlight/55">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Arsenal */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="80">
          <p className="mb-4 font-mono text-xs text-highlight/50">Tools Arsenal</p>
          <div className="flex flex-wrap gap-2">
            {toolsArsenal.map((tool) => (
              <span key={tool} className="glass-pill">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive terminal — full-width showcase */}
        <div data-aos="fade-up" data-aos-delay="100">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-highlight/10" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-highlight/60">Interactive shell</span>
            <div className="h-px flex-1 bg-highlight/10" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-highlight/15 shadow-[0_0_60px_rgba(22,163,74,0.08)]">
            <CyberDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
