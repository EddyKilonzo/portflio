"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/portfolio";

type GitHubStats = {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: { lang: string; count: number }[];
  fetchedAt: string;
};

type THMStats = {
  rank: string | null;
  points: number | null;
  completedRooms: number | null;
  badgesCount: number | null;
};

/* ── Counter animation ─────────────────────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

/* ── Intersection trigger ──────────────────────────────────────────────────── */
function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* ── Sub-components ────────────────────────────────────────────────────────── */
function LiveDot({ color = "accent" }: { color?: "accent" | "cyber" }) {
  const cls = color === "cyber" ? "bg-[rgb(var(--rgb-cyber))]" : "bg-accent";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${cls}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${cls}`} />
    </span>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[75, 55, 65, 45].map((w) => (
        <div key={w} className="h-3.5 animate-pulse rounded bg-highlight/8" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function AnimatedBar({ pct, color, active }: { pct: number; color: "accent" | "cyber"; active: boolean }) {
  const cls = color === "cyber" ? "bg-[rgb(var(--rgb-cyber))]" : "bg-accent";
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-highlight/10">
      <div
        className={`h-full rounded-full ${cls}`}
        style={{ width: active ? `${pct}%` : "0%", transition: active ? "width 900ms cubic-bezier(0.4,0,0.2,1)" : "none" }}
      />
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-[3px]">
      <span className="font-mono text-xs text-highlight/60">{label}</span>
      <span className="font-mono text-sm font-semibold text-highlight">{value}</span>
    </div>
  );
}

function BigStat({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-mono text-2xl font-bold tabular-nums ${accent ? "text-accent" : "text-[rgb(var(--rgb-cyber))]"}`}>{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-highlight/50">{label}</span>
    </div>
  );
}

function UpdatedBadge({ label }: { label: string }) {
  return <span className="font-mono text-[10px] text-highlight/30">{label}</span>;
}

function formatRelative(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`;
}

/* ── Main component ────────────────────────────────────────────────────────── */
export function LiveStatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  const [gh, setGh] = useState<GitHubStats | null>(null);
  const [thm, setThm] = useState<THMStats | null>(null);
  const [ghDone, setGhDone] = useState(false);
  const [thmDone, setThmDone] = useState(false);

  useEffect(() => {
    fetch("/api/github-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setGh).catch(() => setGh(null)).finally(() => setGhDone(true));
    fetch("/api/thm-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setThm).catch(() => setThm(null)).finally(() => setThmDone(true));
  }, []);

  const { ctf } = profile;

  // GitHub stats — live or static fallback
  const ghRepos   = gh?.publicRepos ?? 97;
  const ghFollowers = gh?.followers ?? 37;
  const ghStars   = gh?.totalStars ?? 251;
  const ghLangs   = gh?.topLanguages ?? [
    { lang: "TypeScript", count: 19 },
    { lang: "JavaScript", count: 15 },
    { lang: "HTML",       count: 12 },
    { lang: "CSS",        count: 9  },
  ];
  const maxLang = ghLangs[0]?.count ?? 1;
  const ghUpdated = gh?.fetchedAt ? formatRelative(gh.fetchedAt) : null;

  // THM stats — always static (THM blocks server requests)
  const thmRooms  = thm?.completedRooms ?? ctf.solved;
  const thmBadges = thm?.badgesCount    ?? ctf.badges;
  const thmPoints = thm?.points;
  const progressPct = Math.round(ctf.progressToNext * 100);

  // Counter animations — fire once the section is in view and data is ready
  const triggerGh  = inView && ghDone;
  const triggerThm = inView && thmDone;
  const cRepos     = useCountUp(ghRepos, triggerGh);
  const cFollowers = useCountUp(ghFollowers, triggerGh);
  const cStars     = useCountUp(ghStars, triggerGh);
  const cRooms     = useCountUp(thmRooms, triggerThm);
  const cBadges    = useCountUp(thmBadges, triggerThm);
  const cStreak    = useCountUp(ctf.streak, triggerThm);
  const cRank      = useCountUp(ctf.thmGlobalRank, triggerThm, 1400);
  const cPts       = useCountUp(thmPoints ?? 0, triggerThm);

  return (
    <section
      ref={sectionRef}
      id="live-stats"
      aria-label="Live activity stats"
      className="mx-auto max-w-5xl px-4 py-10"
      data-aos="fade-up"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <LiveDot />
        <span className="font-mono text-xs uppercase tracking-widest text-highlight/60">
          Live Activity
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* ── GitHub card ── */}
        <div
          className="glass-card rounded-xl p-6"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          {/* Card header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-highlight/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="font-mono text-sm font-semibold text-highlight">GitHub</span>
            </div>
            <a href="https://github.com/EddyKilonzo" target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-accent/80 transition-colors hover:text-accent">
              View profile →
            </a>
          </div>

          {!ghDone ? <Skeleton /> : (
            <>
              {/* Big 3 stats */}
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-highlight/[0.04] px-3 py-4">
                <BigStat value={cRepos}     label="Repos"     accent />
                <BigStat value={cFollowers} label="Followers" accent />
                <BigStat value={cStars}     label="Stars"     accent />
              </div>

              {/* Language bars */}
              <div className="space-y-2">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-highlight/40 mb-2">
                  Top languages
                </span>
                {ghLangs.map(({ lang, count }) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 font-mono text-xs text-highlight/60">{lang}</span>
                    <AnimatedBar pct={(count / maxLang) * 100} color="accent" active={inView} />
                    <span className="w-4 shrink-0 text-right font-mono text-[10px] text-highlight/40">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end border-t border-highlight/8 pt-3">
                <UpdatedBadge label={ghUpdated ? `Updated ${ghUpdated}` : "Refreshes hourly"} />
              </div>
            </>
          )}
        </div>

        {/* ── TryHackMe card ── */}
        <div
          className="glass-card rounded-xl p-6"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          {/* Card header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LiveDot color="cyber" />
              <span className="font-mono text-sm font-semibold text-highlight">TryHackMe</span>
            </div>
            <a href={profile.social.thm} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-[rgb(var(--rgb-cyber)/0.8)] transition-colors hover:text-[rgb(var(--rgb-cyber))]">
              View profile →
            </a>
          </div>

          {!thmDone ? <Skeleton /> : (
            <>
              {/* Rank hero */}
              <div className="mb-5 flex items-center justify-between rounded-lg bg-highlight/[0.04] px-4 py-3">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-highlight/40 mb-1">Rank</span>
                  <span className="font-mono text-lg font-bold text-[rgb(var(--rgb-cyber))]">
                    [{ctf.thmLevel}] {ctf.thmRank}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-highlight/40 mb-1">Global</span>
                  <span className="font-mono text-sm font-semibold text-highlight">#{cRank.toLocaleString()}</span>
                </div>
              </div>

              {/* Big stats row */}
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-highlight/[0.04] px-3 py-4">
                <BigStat value={cRooms}  label="Rooms" />
                <BigStat value={cBadges} label="Badges" />
                <BigStat value={`${cStreak}d`} label="Streak" />
              </div>

              {thmPoints != null && (
                <StatRow label="Points" value={cPts.toLocaleString()} />
              )}

              {/* Progress bar */}
              <div className="mt-3 border-t border-highlight/8 pt-3">
                <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-highlight/40">
                  <span>Progress to next rank</span>
                  <span>{progressPct}%</span>
                </div>
                <AnimatedBar pct={progressPct} color="cyber" active={inView} />
              </div>

              <div className="mt-3 flex justify-end">
                <UpdatedBadge label={`Updated ${ctf.thmLastUpdated}`} />
              </div>

              {/* Top % badge */}
              <div className="mt-3 flex justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--rgb-cyber)/0.2)] bg-[rgb(var(--rgb-cyber)/0.08)] px-3 py-1 font-mono text-[11px] text-[rgb(var(--rgb-cyber))]">
                  Top {ctf.thmTopPct}% globally
                </span>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
