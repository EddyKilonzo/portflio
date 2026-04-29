"use client";

import { certifications, type CertItem } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { motionTokens } from "@/lib/motion-tokens";
import { useMotionProfile } from "@/hooks/useMotionProfile";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionAnimRef = useRef<HTMLElement | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const { shouldReduce } = useMotionProfile();
  const list = certifications.filter(
    (c) => tab === "all" || c.category === tab,
  );

  useEffect(() => {
    sectionAnimRef.current = document.getElementById("certs");
  }, []);

  useEffect(() => {
    const sectionEl = sectionAnimRef.current;
    if (!sectionEl) return;
    const heading = sectionEl.querySelectorAll<HTMLElement>("[data-cert-step='heading']");
    const controls = sectionEl.querySelectorAll<HTMLElement>("[data-cert-step='controls']");
    const cards = sectionEl.querySelectorAll<HTMLElement>("[data-cert-step='card']");
    const all = Array.from(heading).concat(Array.from(controls), Array.from(cards));
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 76%",
      once: true,
      onEnter: () => {
        all.forEach((el) => (el.style.willChange = "transform, opacity"));
        const tl = gsap.timeline({
          onComplete: () => all.forEach((el) => (el.style.willChange = "auto")),
        });
        tl.fromTo(
          heading,
          { y: shouldReduce ? 0 : 14, opacity: 0 },
          { y: 0, opacity: 1, duration: motionTokens.duration.base, ease: motionTokens.ease.standard },
        ).fromTo(
          controls,
          { y: shouldReduce ? 0 : 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.duration.base,
            ease: motionTokens.ease.standard,
            stagger: shouldReduce ? 0 : motionTokens.stagger.section,
          },
          "-=0.1",
        ).fromTo(
          cards,
          { y: shouldReduce ? 0 : 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.duration.base,
            ease: motionTokens.ease.standard,
            stagger: shouldReduce ? 0 : 0.06,
          },
          "-=0.08",
        );
      },
    });
    return () => st.kill();
  }, [shouldReduce, tab]);

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
          <h2 
            className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl"
            data-cert-step="heading"
          >
            Certifications & Learning Path
          </h2>
          <p 
            className="mb-4 max-w-3xl font-sans text-highlight/70"
            data-cert-step="heading"
          >
            Structured certification track with active progression in cyber, cloud, and
            engineering domains.
          </p>
        </ParallaxDrift>
        <div className="mb-4 flex flex-wrap gap-2" data-cert-step="controls">
          <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">
            Last updated: Apr 2026
          </span>
          <span className="rounded-full border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/65">
            Verified links
          </span>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" data-cert-step="controls">
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
        <p className="mb-6 max-w-3xl font-sans text-sm text-highlight/65" data-cert-step="controls">
          {categorySummary[tab]}
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-3" data-cert-step="controls">
          <ParallaxDrift speed={0.05} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="zoom-in" data-aos-delay="300">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                Total credentials
              </p>
              <p className="mt-1 font-display text-3xl text-highlight">{certifications.length}</p>
            </div>
          </ParallaxDrift>
          <ParallaxDrift speed={0.1} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="zoom-in" data-aos-delay="400">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                In progress
              </p>
              <p className="mt-1 font-display text-3xl text-accent">
                {certifications.filter((c) => c.inProgress).length}
              </p>
            </div>
          </ParallaxDrift>
          <ParallaxDrift speed={0.15} className="w-full">
            <div className="glass-card rounded-xl p-4" data-aos="zoom-in" data-aos-delay="500">
              <p className="font-mono text-[10px] uppercase tracking-wide text-highlight/50">
                Security focused
              </p>
              <p className="mt-1 font-display text-3xl text-highlight">
                {certifications.filter((c) => c.category === "security").length}
              </p>
            </div>
          </ParallaxDrift>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <div key={c.id} data-cert-step="card">
              <CertCard cert={c} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert, index }: { cert: CertItem; index: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        delay: index * 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );
  }, [index]);

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
          {
            width: `${cert.progressPct ?? 0}%`,
            duration: 1.2,
            ease: "expo.out",
          },
        );
      },
    });
    return () => st.kill();
  }, [cert.inProgress, cert.progressPct]);

  const spin = (deg: number) => {
    const el = inner.current;
    if (!el) return;
    animate(el, {
      rotateY: deg,
      duration: 500,
      ease: "inOut(1)",
    });
  };

  return (
    <div
      ref={wrap}
      className="h-56 will-change-transform"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => spin(180)}
      onMouseLeave={() => spin(0)}
    >
      <div
        ref={inner}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="glass-card absolute inset-0 flex flex-col justify-between rounded-2xl p-5"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div>
            <p className="font-display text-xl text-highlight">{cert.name}</p>
            <p className="font-mono text-xs text-accent">{cert.issuer}</p>
            <p className="mt-2 font-mono text-[10px] text-highlight/50">
              Earned {cert.earned}
              {cert.expires ? ` · Exp ${cert.expires}` : ""}
            </p>
          </div>
          {cert.inProgress ? (
            <div>
              <div className="h-1.5 w-full rounded-full bg-surface/40">
                <div
                  ref={barRef}
                  className="h-1.5 rounded-full bg-surfaceMid"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] text-highlight/50">
                In progress
              </p>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-highlight/40">
              Hover for back
            </span>
          )}
        </div>

        <div
          className="glass-card absolute inset-0 flex rotate-y-180 flex-col justify-center rounded-2xl p-5"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="font-mono text-xs text-highlight/60">
            ID: {cert.credentialId ?? "—"}
          </p>
          {cert.verifyUrl ? (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 font-mono text-sm text-accent underline"
            >
              Verify credential
            </a>
          ) : null}
          <div className="mt-4 h-16 rounded-lg bg-surface/30" />
        </div>
      </div>
    </div>
  );
}
