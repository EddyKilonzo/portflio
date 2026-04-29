"use client";

import { AnimeHoverBloom } from "@/components/motion/AnimeHoverBloom";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { MagneticAnchor, MagneticButton } from "@/components/ui/MagneticButton";
import { useEffect, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";

type HeatDay = { date: string; count: number; level: number };

type HeatWeek = { days: HeatDay[] };

type GhJson = {
  source?: string;
  login?: string;
  pinned?: { name: string; stars: number; language: string; description: string }[];
  recent?: { sha: string; message: string; date: string; repo?: string }[];
  heatmap?: { day: string; count: number; level: number }[];
  heatmapWeeks?: HeatWeek[];
  totalContributions?: number | null;
};

const LEVEL_OPACITY: Record<number, string> = {
  0: "rgba(46, 122, 90, 0.08)",
  1: "rgba(46, 122, 90, 0.22)",
  2: "rgba(46, 122, 90, 0.42)",
  3: "rgba(168, 217, 184, 0.35)",
  4: "rgba(168, 217, 184, 0.65)",
};

/** Username segment from `profile.social.github` when the API payload has no `login`. */
function githubHandleFromUrl(url: string): string {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean)[0];
    return seg ?? "";
  } catch {
    return "";
  }
}

/** e.g. `https://tryhackme.com/p/eddy.kilonzo` → `@eddy.kilonzo` */
function tryhackmeHandleLabel(url: string): string {
  const m = url.match(/tryhackme\.com\/p\/([^/?#]+)/i);
  return m?.[1] ? `@${m[1]}` : "";
}

function GitHubHeatmap({ weeks }: { weeks: HeatWeek[] }) {
  if (!weeks.length) return null;
  return (
    <div className="mt-4 flex flex-nowrap gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.days.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.count} contributions`}
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{
                backgroundColor: LEVEL_OPACITY[d.level] ?? LEVEL_OPACITY[0],
                boxShadow: "inset 0 0 0 1px rgba(168,217,184,0.08)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function IntegrationsSection() {
  const sectionRef = useSectionReveal(8);
  const [gh, setGh] = useState<GhJson | null>(null);
  const [rss, setRss] = useState<{ id: string; title: string }[]>([]);
  const [tick, setTick] = useState(0);
  const tickerLen = profile.learningTicker.length || 1;

  useEffect(() => {
    let cancelled = false;

    const loadGitHub = async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) {
          throw new Error(`GitHub API ${res.status}`);
        }
        const data = (await res.json()) as GhJson;
        if (!cancelled) setGh(data);
      } catch (cause) {
        console.warn("[Integrations] GitHub fetch failed:", cause);
        if (!cancelled) setGh(null);
      }
    };

    const loadRss = async () => {
      try {
        const res = await fetch("/api/rss");
        if (!res.ok) {
          throw new Error(`RSS proxy ${res.status}`);
        }
        const data = (await res.json()) as { items?: { id: string; title: string }[] };
        if (!cancelled) setRss(data.items ?? []);
      } catch (cause) {
        console.warn("[Integrations] RSS fetch failed:", cause);
        if (!cancelled) setRss([]);
      }
    };

    void loadGitHub();
    void loadRss();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % tickerLen);
    }, 3200);
    return () => clearInterval(id);
  }, [tickerLen]);

  const learning = profile.learningTicker[tick % tickerLen] ?? "";
  const weeks = gh?.heatmapWeeks ?? [];
  const githubProfileUrl = profile.social.github;
  const githubHandle =
    (gh?.login && gh.login.trim()) || githubHandleFromUrl(githubProfileUrl);
  const thmLabel = tryhackmeHandleLabel(profile.social.thm);
  const pinned = (gh?.pinned ?? []).filter(
    (p) => Boolean(p?.name?.trim()) || Boolean(p?.description?.trim()),
  );
  const coreStack = [
    "Angular",
    "TypeScript",
    "NestJS",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Prisma",
    "WordPress",
    "WooCommerce",
    "Docker",
    "Git",
    "GitHub",
    "Figma",
    "VS Code",
  ];
  const recent = (gh?.recent ?? []).filter(
    (r) => Boolean(r?.sha?.trim()) || Boolean(r?.message?.trim()),
  );
  const rssItems = rss.filter((item) => Boolean(item?.title?.trim()));

  return (
    <section
      ref={sectionRef}
      id="integrations"
      data-section="integrations"
      className="relative overflow-hidden py-20 section-bg"
    >
      <DecorNetwork />

      <ParallaxDrift
        className="pointer-events-none absolute -left-4 top-24 select-none font-display text-[clamp(4rem,14vw,10rem)] font-bold leading-none text-highlight/[0.06] md:left-4"
        speed={0.55}
        pointerNudge={0.35}
      >
        LIVE
      </ParallaxDrift>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.25} pointerNudge={0.15} className="inline-block">
          <h2 className="glitch-hover mb-8 font-display text-3xl text-highlight md:text-4xl">
            Live data
          </h2>
        </ParallaxDrift>

        <div 
          className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-highlight/15 bg-surface/15 px-4 py-3 font-mono text-sm text-highlight"
          data-aos="fade-up"
        >
          <span className="text-highlight/50">Currently learning: </span>
          <span className="min-w-0 flex-1 text-accent">{learning}</span>
          <div className="flex shrink-0 gap-2">
            <MagneticButton
              type="button"
              className="btn-ghost px-3 py-1 font-mono text-xs"
              aria-label="Previous learning topic"
              onClick={() =>
                setTick((t) => (t - 1 + tickerLen) % tickerLen)
              }
            >
              ←
            </MagneticButton>
            <MagneticButton
              type="button"
              className="btn-ghost px-3 py-1 font-mono text-xs"
              aria-label="Next learning topic"
              onClick={() => setTick((t) => (t + 1) % tickerLen)}
            >
              →
            </MagneticButton>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AnimeHoverBloom className="rounded-2xl" data-aos="fade-right">
            <div className="glass-card h-full rounded-2xl p-6">
            <p className="font-mono text-xs text-highlight/50">
              GitHub {gh?.source ? `(${gh.source})` : ""}{" "}
              {githubHandle ? (
                <MagneticAnchor
                  href={githubProfileUrl}
                  className="text-accent underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  @{githubHandle}
                </MagneticAnchor>
              ) : (
                <MagneticAnchor
                  href={githubProfileUrl}
                  className="text-accent underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Profile
                </MagneticAnchor>
              )}
            </p>
            <p className="mt-2 font-mono text-[11px] text-highlight/55">
              <MagneticAnchor
                href={githubProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost font-mono text-[11px] text-accent hover:text-highlight"
              >
                Open full GitHub profile →
              </MagneticAnchor>
            </p>
            {typeof gh?.totalContributions === "number" ? (
              <p className="mt-1 font-display text-2xl text-highlight">
                {gh.totalContributions}{" "}
                <span className="font-mono text-xs font-normal text-highlight/50">
                  contributions (last year)
                </span>
              </p>
            ) : null}

            {weeks.length > 0 ? (
              <GitHubHeatmap weeks={weeks} />
            ) : (
              <div className="mt-4 flex flex-wrap gap-1">
                {(gh?.heatmap ?? []).slice(0, 112).map((c, i) => (
                  <div
                    key={`${c.day}-${i}`}
                    className="h-3 w-3 rounded-sm bg-surfaceMid"
                    style={{ opacity: 0.25 + (c.level ?? 0) * 0.18 }}
                    title={`${c.day}: ${c.count}`}
                  />
                ))}
              </div>
            )}

            <p className="mt-4 font-mono text-xs text-highlight/50">Pinned</p>
            <ul className="mt-2 space-y-2">
              {pinned.map((p) => (
                <li key={String(p.name)} className="font-mono text-xs text-highlight/80">
                  {p.name}{" "}
                  <span className="text-accent">★ {p.stars}</span>{" "}
                  <span className="text-highlight/50">{p.language}</span>
                  <br />
                  <span className="text-[10px] text-highlight/50">
                    {p.description}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-highlight/50">Recent</p>
            <ul className="mt-1 space-y-1.5 font-mono text-[10px] text-highlight/60">
              {recent.map((r, i) => (
                <li key={i}>
                  <span className="text-accent">{r.sha}</span> ·{" "}
                  <span className="text-highlight/75">{(r.repo ?? "repo").split("/").pop()}</span>{" "}
                  — {r.message?.slice(0, 80)}
                </li>
              ))}
            </ul>
            </div>
          </AnimeHoverBloom>

          <AnimeHoverBloom className="rounded-2xl" data-aos="fade-left">
            <div className="glass-card h-full rounded-2xl p-6">
            <p className="font-mono text-xs text-highlight/50">Blog / writeups</p>
            <ul className="mt-4 space-y-3">
              {rssItems.map((item) => (
                <li key={item.id} className="font-sans text-sm text-highlight/80">
                  {item.title}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="font-mono text-xs text-highlight/50">Stack I use</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coreStack.map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full border border-white/55 px-2.5 py-1 font-mono text-[10px] text-white"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <p className="font-mono text-xs text-highlight/50">Platforms</p>
              <div className="flex flex-wrap gap-3">
                <MagneticAnchor
                  href={profile.social.htb}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded outline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-accent"
                  title="Hack The Box — open profile"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.shields.io/badge/HackTheBox-111927?style=for-the-badge&logo=hackthebox&logoColor=9FEF00"
                    alt="Hack The Box profile"
                    className="h-8"
                  />
                </MagneticAnchor>
                <MagneticAnchor
                  href={profile.social.thm}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded outline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-accent"
                  title="TryHackMe — open profile"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.shields.io/badge/TryHackMe-212C42?style=for-the-badge&logo=tryhackme&logoColor=white"
                    alt="TryHackMe profile"
                    className="h-8"
                  />
                </MagneticAnchor>
              </div>
              <div className="flex flex-wrap gap-4 font-mono text-xs">
                <MagneticAnchor
                  href={profile.social.htb}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline"
                >
                  HTB profile
                </MagneticAnchor>
                <MagneticAnchor
                  href={profile.social.thm}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline"
                >
                  TryHackMe profile{thmLabel ? ` ${thmLabel}` : ""}
                </MagneticAnchor>
              </div>
            </div>
            </div>
          </AnimeHoverBloom>
        </div>
      </div>
    </section>
  );
}
