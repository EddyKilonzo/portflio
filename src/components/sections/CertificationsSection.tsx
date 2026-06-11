"use client";

import { certifications, type CertItem } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import AOS from "aos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

gsap.registerPlugin(ScrollTrigger);

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const proxy = { val: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          val: to,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => { el.textContent = String(Math.round(proxy.val)); },
        });
      },
    });
    return () => st.kill();
  }, [to]);
  return <span ref={ref}>0</span>;
}

const tabs = ["all", "security", "cloud", "development", "networking"] as const;
const categorySummary: Record<(typeof tabs)[number], string> = {
  all: "Full certification portfolio across security, cloud, development, and networking.",
  security: "Hands-on cybersecurity certifications aligned to blue-team and pentest workflows.",
  cloud: "Cloud operations and architecture credentials focused on delivery at scale.",
  development: "Software delivery and platform engineering certifications.",
  networking: "Core networking and infrastructure validation credentials.",
};

export function CertificationsSection() {
  const sectionRef = useSectionReveal(6);
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const list = certifications.filter(
    (c) => tab === "all" || c.category === tab,
  );

  useEffect(() => {
    const id = window.setTimeout(() => AOS.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [tab, list.length]);

  return (
    <section
      ref={sectionRef}
      id="certs"
      data-section="certs"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="09" sectionId="certs" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <div data-aos="fade-up">
            <h2 className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl">
              Certifications & Learning Path
            </h2>
            <p className="mb-4 max-w-3xl font-sans text-highlight/70">
              Structured certification track with active progression in cyber, cloud, and
              engineering domains.
            </p>
          </div>
        </ParallaxDrift>
        <div className="mb-4 flex flex-wrap gap-2" data-aos="fade-up" data-aos-delay="80">
          <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">
            Last updated: Apr 2026
          </span>
          <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">
            Verified links
          </span>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" data-aos="fade-up" data-aos-delay="120">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full border px-3 py-1 font-mono text-xs capitalize ${
                tab === t ? "border-accent text-accent" : "border-highlight/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mb-6 max-w-3xl font-sans text-sm text-highlight/65" data-aos="fade-up" data-aos-delay="140">
          {categorySummary[tab]}
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <ParallaxDrift speed={0.05} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="fade-up" data-aos-delay="160">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                Total credentials
              </p>
              <p className="mt-1 font-display text-3xl text-highlight"><CountUp to={certifications.length} /></p>
            </div>
          </ParallaxDrift>
          <ParallaxDrift speed={0.1} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="fade-up" data-aos-delay="220">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                In progress
              </p>
              <p className="mt-1 font-display text-3xl text-accent">
                <CountUp to={certifications.filter((c) => c.inProgress).length} />
              </p>
            </div>
          </ParallaxDrift>
          <ParallaxDrift speed={0.15} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="fade-up" data-aos-delay="280">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                Security focused
              </p>
              <p className="mt-1 font-display text-3xl text-highlight">
                <CountUp to={certifications.filter((c) => c.category === "security").length} />
              </p>
            </div>
          </ParallaxDrift>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <div key={c.id} data-aos="fade-up" data-aos-delay={Math.min(i, 12) * 45}>
              <CertCard cert={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: CertItem }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!cert.inProgress || !barRef.current) return;
    const st = ScrollTrigger.create({
      trigger: barRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          barRef.current,
          { width: "0%" },
          { width: `${cert.progressPct ?? 0}%`, duration: 1.2, ease: "expo.out" },
        );
      },
    });
    return () => st.kill();
  }, [cert.inProgress, cert.progressPct]);

  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const toggle = () => setFlipped((v) => !v);

  return (
    <div
      className="relative h-56 cursor-pointer overflow-hidden rounded-2xl"
      onMouseEnter={() => { if (canHover()) setFlipped(true); }}
      onMouseLeave={() => { if (canHover()) setFlipped(false); }}
      onClick={() => { if (!canHover()) toggle(); }}
      role="button"
      aria-label={flipped ? `${cert.name} — tap to close` : `${cert.name} — tap to see details`}
    >
      {/* Front face */}
      <div
        className="glass-card absolute inset-0 flex flex-col justify-between rounded-2xl p-5"
        style={{
          opacity: flipped ? 0 : 1,
          transform: flipped ? "translateY(-10px) scale(0.97)" : "translateY(0) scale(1)",
          transition: "opacity 0.35s ease, transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: flipped ? "none" : "auto",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl text-highlight leading-snug">{cert.name}</p>
            <p className="font-mono text-xs text-accent">{cert.issuer}</p>
            <p className="mt-2 font-mono text-[10px] text-highlight/50">
              Earned {cert.earned}
              {cert.expires ? ` · Exp ${cert.expires}` : ""}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-highlight/20 bg-surface/25 px-2 py-0.5 font-mono text-[9px] capitalize text-highlight/55">
            {cert.category}
          </span>
        </div>
        {cert.inProgress ? (
          <div>
            <div className="h-1.5 w-full rounded-full bg-surface/40">
              <div ref={barRef} className="h-1.5 rounded-full bg-surfaceMid" style={{ width: "0%" }} />
            </div>
            <p className="mt-1 font-mono text-[10px] text-highlight/50">In progress</p>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-highlight/15 bg-surface/20 px-2.5 py-1 font-mono text-[10px] text-highlight/60">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-accent/70" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 4H6a3 3 0 000 6h1M3 12h7a3 3 0 000-6H9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 2l2 2-2 2M5 14l-2-2 2-2" />
            </svg>
            <span className="hidden md:inline">Hover</span>
            <span className="md:hidden">Tap</span>
            {" "}to flip
          </span>
        )}
      </div>

      {/* Back face */}
      <div
        className="glass-card absolute inset-0 flex flex-col justify-center gap-2 rounded-2xl p-5"
        style={{
          opacity: flipped ? 1 : 0,
          transform: flipped ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
          transition: "opacity 0.35s ease, transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: flipped ? "auto" : "none",
        }}
      >
        <p className="font-display text-base text-highlight leading-snug">{cert.name}</p>
        <p className="font-mono text-xs text-accent">{cert.issuer}</p>
        <div className="mt-1 rounded-lg border border-highlight/10 bg-surface/20 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-widest text-highlight/40 mb-0.5">Credential ID</p>
          <p className="font-mono text-xs text-highlight/75 break-all">{cert.credentialId ?? "—"}</p>
        </div>
        {cert.verifyUrl ? (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
          >
            Verify credential
            <span className="text-accent/60">↗</span>
          </a>
        ) : (
          <p className="font-mono text-[10px] text-highlight/40">No verify link available</p>
        )}
        <p className="mt-auto font-mono text-[9px] text-highlight/30">
          <span className="md:hidden">Tap card to close</span>
          <span className="hidden md:inline">Mouse away to close</span>
        </p>
      </div>
    </div>
  );
}
