"use client";

import { CyberOrbit } from "@/components/cyber/CyberOrbit";
import { cveLog, profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { MagneticAnchor } from "@/components/ui/MagneticButton";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { MagneticButton } from "@/components/ui/MagneticButton";

const CyberDemo = dynamic(
  () => import("@/components/demos/CyberDemo").then((m) => m.CyberDemo),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-surface/35" />
          <div className="h-64 animate-pulse rounded-xl border border-highlight/15 bg-surface/20" />
          <div className="h-2 w-40 animate-pulse rounded bg-surface/25" />
        </div>
        <div className="space-y-4">
          <div className="glass-card h-24 animate-pulse rounded-xl p-4" />
          <div className="glass-card h-24 animate-pulse rounded-xl p-4" />
          <div className="glass-card h-20 animate-pulse rounded-xl p-4" />
        </div>
      </div>
    ),
  },
);

const levels = ["Low", "Medium", "High", "Critical"] as const;

function severityColor(s: string) {
  if (s === "critical") return "text-red-400 border-red-400/50";
  if (s === "high") return "text-orange-400 border-orange-400/50";
  if (s === "medium") return "text-yellow-300 border-yellow-300/40";
  return "text-blue-300 border-blue-300/40";
}

export function CyberShowcaseSection() {
  const sectionRef = useSectionReveal(3);
  const [threat, setThreat] = useState(1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setThreat((t) => {
        const n = t + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(0, Math.min(3, n));
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cyber"
      data-section="cyber"
      className="relative overflow-hidden py-24 section-bg"
      style={
        { "--section-tint": "rgba(255, 76, 76, 0.06)" } as React.CSSProperties
      }
    >
      <SectionNumber n="05" sectionId="cyber" />
      <DecorNetwork />

      <div className="pointer-events-none absolute right-4 top-24 z-[1] hidden h-40 w-40 opacity-90 md:block lg:right-10 lg:top-28 lg:h-48 lg:w-48">
        <CyberOrbit className="h-full w-full rounded-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 className="glitch-hover mb-10 font-display text-4xl text-highlight md:text-5xl">
          Cybersecurity showcase
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-card rounded-2xl p-6 lg:col-span-1">
            <p className="font-mono text-xs text-highlight/50">CTF tracker</p>
            <p className="mt-2 font-display text-2xl text-highlight">
              HTB {profile.ctf.htbRank}
            </p>
            <p className="font-mono text-sm text-accent">
              THM {profile.ctf.thmRank}
            </p>
            <div className="mt-4 flex gap-4 font-mono text-xs text-highlight/70">
              <span>Badges {profile.ctf.badges}</span>
              <span>Solved {profile.ctf.solved}</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-surface/40">
              <div
                className="h-2 rounded-full bg-cyber transition-all duration-700"
                style={{
                  width: `${profile.ctf.progressToNext * 100}%`,
                }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
              <MagneticAnchor
                href={profile.social.htb}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline hover:text-highlight"
              >
                Hack The Box profile
              </MagneticAnchor>
              <MagneticAnchor
                href={profile.social.thm}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline hover:text-highlight"
              >
                TryHackMe profile
              </MagneticAnchor>
              <MagneticAnchor
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline hover:text-highlight"
              >
                GitHub profile
              </MagneticAnchor>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-highlight/50">Bug bounty</p>
            <p className="mt-2 text-3xl font-bold text-highlight">
              {profile.bugBounty.totalFindings}
            </p>
            <p className="font-mono text-xs text-highlight/60">findings</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.bugBounty.platforms.map((p) => (
                <span
                  key={p}
                  className="rounded border border-highlight/15 px-2 py-0.5 font-mono text-[10px]"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
              {(
                [
                  ["C", profile.bugBounty.severities.critical],
                  ["H", profile.bugBounty.severities.high],
                  ["M", profile.bugBounty.severities.medium],
                  ["L", profile.bugBounty.severities.low],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded bg-surface/30 py-2">
                  <div className="text-lg text-highlight">{v}</div>
                  {k}
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-highlight/50">
              Hall of fame: {profile.bugBounty.hallOfFame.join(", ")}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-highlight/50">
              Threat level (easter egg)
            </p>
            <p className="mt-4 font-display text-3xl text-cyber">
              {levels[threat]}
            </p>
            <p className="font-mono text-[10px] text-highlight/40">
              simulated gauge — slow drift
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass-card max-h-80 overflow-y-auto rounded-2xl p-6">
            <p className="mb-4 font-mono text-xs text-highlight/50">
              CVE & disclosure log
            </p>
            <ul className="space-y-3">
              {cveLog.map((c) => (
                <li
                  key={c.id}
                  className="border-l-2 border-highlight/20 pl-3 font-mono text-xs"
                >
                  <span className={severityColor(c.severity)}>{c.severity}</span>{" "}
                  {c.cve ?? "responsible disclosure"} — {c.software}{" "}
                  <span className="text-highlight/50">{c.disclosed}</span>{" "}
                  <span className="text-accent">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-highlight/50">Home lab</p>
            <p className="mt-2 font-sans text-sm text-highlight/80">
              {profile.homelab}
            </p>
            <svg viewBox="0 0 200 100" className="mt-4 w-full opacity-80">
              <rect
                x="10"
                y="20"
                width="60"
                height="40"
                rx="4"
                fill="none"
                stroke="#2E7A5A"
              />
              <rect
                x="90"
                y="15"
                width="50"
                height="50"
                rx="4"
                fill="none"
                stroke="#A8D9B8"
              />
              <line
                x1="70"
                y1="40"
                x2="90"
                y2="40"
                stroke="#2E7A5A"
                strokeDasharray="3 2"
              />
              <text x="20" y="38" className="fill-highlight/50 font-mono text-[8px]">
                proxmox
              </text>
              <text x="95" y="38" className="fill-highlight/50 font-mono text-[8px]">
                siem
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {["Pen test walkthrough", "CTF solve", "Tooling demo"].map((t) => (
            <div key={t} className="glass-card rounded-2xl p-6">
              <p className="font-mono text-xs text-highlight/50">Video</p>
              <p className="mt-2 font-display text-xl text-highlight">{t}</p>
              <MagneticButton className="btn-ghost mt-4 w-full text-xs">
                Watch clip
              </MagneticButton>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="mb-2 font-mono text-xs text-highlight/50">
            Embedded terminal
          </p>
          <div className="glass-card overflow-hidden rounded-2xl">
            <CyberDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
