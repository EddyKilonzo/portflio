"use client";

import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";
import { emitToast } from "@/lib/toast";

const CAL_LINK = "eddy-max-kilonzo-9lgv2r";

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

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.6 21 3 14.4 3 6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1L6.6 10.8z" />
    </svg>
  );
}
function IconChat({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconNote({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}
function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const bookingFields = [
  { label: "Your name",                   badge: "Required", Icon: IconUser  },
  { label: "Email address",               badge: "Required", Icon: IconMail  },
  { label: "Phone number",                badge: "Optional", Icon: IconPhone },
  { label: "What is this meeting about?", badge: "Optional", Icon: IconChat  },
  { label: "Additional notes",            badge: "Optional", Icon: IconNote  },
  { label: "Add guests",                  badge: "Optional", Icon: IconUsers },
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

function useCalEmbed() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_LINK });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          dark: {
            "cal-brand":           "#0d8a3d",
            "cal-bg":              "#1a3028",
            "cal-bg-muted":        "#243d30",
            "cal-text":            "#d8ece0",
            "cal-text-muted":      "#a0c4b0",
            "cal-border":          "#2e5040",
            "cal-border-emphasis": "#3d6e55",
          },
          light: {
            "cal-brand":           "#0a3d1f",
            "cal-bg":              "#ffffff",
            "cal-bg-muted":        "#f4f4f5",
            "cal-text":            "#0a3d1f",
            "cal-text-muted":      "#2e7a5a",
            "cal-border":          "#e4e4e7",
            "cal-border-emphasis": "#2e7a5a",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      setReady(true);
    })();
  }, []);

  return ready;
}

export function BookingSection() {
  const sectionRef = useSectionReveal(17);
  const calReady = useCalEmbed();
  const [opening, setOpening] = useState(false);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSchedule = () => {
    if (!calReady) return;
    setOpening(true);
    emitToast("Opening Google Meet booking calendar…", "info");
    openingTimer.current = setTimeout(() => setOpening(false), 2000);
  };

  useEffect(() => () => { if (openingTimer.current) clearTimeout(openingTimer.current); }, []);

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
            Availability & Engagements
          </h2>
          <p
            className="mt-2 max-w-3xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            Select an engagement that fits your goals and schedule a no-obligation consultation.
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

            {/* Booking requirements */}
            <div
              className="glass-card rounded-2xl p-5"
              data-aos="fade-up"
              data-aos-delay="140"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-highlight/45 mb-3">
                What you'll need to provide
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {bookingFields.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <f.Icon className="h-4 w-4 shrink-0 text-highlight/40" />
                    <span className="flex-1 font-sans text-sm text-highlight/80">{f.label}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      f.badge === "Required"
                        ? "bg-accent/12 text-accent"
                        : "bg-surface/30 text-highlight/40"
                    }`}>
                      {f.badge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="glass-card rounded-2xl p-5"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-highlight/45 mb-2">
                Schedule a consultation
              </p>
              <p className="text-sm leading-relaxed text-highlight/70 mb-4">
                Book a Google Meet session — 30 minutes to walk through your project, requirements, and how I can help. No commitment required.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-cal-namespace={CAL_LINK}
                  data-cal-link={CAL_LINK}
                  data-cal-config='{"layout":"month_view"}'
                  onClick={handleSchedule}
                  disabled={!calReady}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs transition-all duration-200 ${
                    !calReady
                      ? "border-highlight/10 bg-surface/10 text-highlight/30 cursor-wait"
                      : opening
                        ? "border-accent/60 bg-accent/20 text-accent scale-[0.97]"
                        : "border-accent/35 bg-accent/8 text-accent hover:bg-accent/15 active:scale-[0.97]"
                  }`}
                >
                  {!calReady ? (
                    <>
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border border-highlight/20 border-t-highlight/60" />
                      Loading calendar…
                    </>
                  ) : opening ? (
                    <>
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      Opening…
                    </>
                  ) : (
                    "Book a Google Meet →"
                  )}
                </button>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1 font-mono text-xs text-highlight/50 underline-offset-2 hover:underline transition-colors hover:text-highlight/75"
                >
                  Prefer to message instead?
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
