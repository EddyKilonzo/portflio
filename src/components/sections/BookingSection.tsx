"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useEffect, useState } from "react";

function IconRocket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m3.29 15 1.42-1.42" />
      <path d="M17.5 6.5a4.95 4.95 0 0 0-7 7L15 19l4-4z" />
      <path d="M14 6l-3 3" />
      <path d="M20.97 2c0 0-4.87.37-8.2 3.7L8.44 10 14 15.56l4.3-4.33C21.63 7.9 22 3 22 3c0 0-.66-.03-1.03 0z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconZap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const packages = [
  {
    name: "Launch Sprint",
    Icon: IconRocket,
    detail: "2-week focused delivery for MVP features and production polish.",
  },
  {
    name: "Security Review",
    Icon: IconShield,
    detail: "Targeted review of auth, input validation, and deployment posture.",
  },
  {
    name: "UX Performance Pass",
    Icon: IconZap,
    detail: "Mobile-first optimization, accessibility fixes, and motion tuning.",
  },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_ABBR = ["S","M","T","W","T","F","S"];

function LiveCalendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setView({ year: now.getFullYear(), month: now.getMonth() });

    // Refresh at midnight so "today" stays accurate
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const id = setTimeout(() => {
      const next = new Date();
      setToday(next);
      setView({ year: next.getFullYear(), month: next.getMonth() });
    }, msToMidnight);
    return () => clearTimeout(id);
  }, []);

  if (!today || !view) {
    return (
      <div className="space-y-2">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-highlight/8" style={{ width: `${60 + i * 7}%` }} />
        ))}
      </div>
    );
  }

  const { year, month } = view;
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d: number) =>
    today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () =>
    setView((v) => {
      if (!v) return v;
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  const nextMonth = () =>
    setView((v) => {
      if (!v) return v;
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="select-none">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="grid h-7 w-7 place-items-center rounded-lg border border-highlight/15 font-mono text-xs text-highlight/60 transition-colors hover:border-accent/40 hover:text-accent"
        >
          ‹
        </button>
        <p className="font-mono text-sm font-semibold text-highlight">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="grid h-7 w-7 place-items-center rounded-lg border border-highlight/15 font-mono text-xs text-highlight/60 transition-colors hover:border-accent/40 hover:text-accent"
        >
          ›
        </button>
      </div>

      {/* Day-of-week row */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {DAY_ABBR.map((d, i) => (
          <div key={i} className="py-0.5 text-center font-mono text-[10px] tracking-wide text-highlight/30">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-lg font-mono text-[11px] transition-colors ${
              day === null
                ? ""
                : isToday(day)
                  ? "bg-accent font-bold text-bg shadow-[0_0_12px_rgba(13,138,61,0.5)]"
                  : "text-highlight/55 hover:bg-surface/25 hover:text-highlight"
            }`}
          >
            {day ?? ""}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-highlight/30">
        {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
      </p>
    </div>
  );
}

export function BookingSection() {
  const sectionRef = useSectionReveal(17);

  return (
    <section
      ref={sectionRef}
      id="booking"
      data-section="booking"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="11" sectionId="booking" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.12}>
          <h2
            className="glitch-hover font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Availability + Booking
          </h2>
          <p
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            Structured collaboration packages with a clear booking path.
          </p>
        </ParallaxDrift>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_268px]">
          {/* Left: packages + CTA */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {packages.map((pkg, idx) => (
                <article
                  key={pkg.name}
                  className="glass-card rounded-2xl p-5"
                  data-aos="fade-up"
                  data-aos-delay={idx * 70}
                >
                  <pkg.Icon className="h-5 w-5 text-accent/70" />
                  <h3 className="mt-2 font-display text-lg text-highlight">{pkg.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-highlight/70">{pkg.detail}</p>
                </article>
              ))}
            </div>

            <div
              className="glass-card rounded-2xl p-5"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-highlight/45 mb-2">
                Schedule a call
              </p>
              <p className="text-sm leading-relaxed text-highlight/70 mb-4">
                Pick a slot for a discovery call and share your goals before we start.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://cal.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-accent/35 bg-accent/8 px-4 py-2.5 font-mono text-xs text-accent transition-colors hover:bg-accent/15"
                >
                  Open Calendar →
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 font-mono text-xs text-highlight/55 underline transition-colors hover:text-highlight/80"
                >
                  Prefer a form? Contact section
                </a>
              </div>
            </div>
          </div>

          {/* Right: live calendar */}
          <div
            className="glass-card rounded-2xl p-5"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-highlight/45">
                Calendar
              </p>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-accent/70">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Live · updates daily
              </span>
            </div>
            <LiveCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}
