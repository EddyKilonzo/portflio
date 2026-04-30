"use client";

import { sectionLinks } from "@/content/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { trackEvent } from "@/lib/analytics";
import { emitToast } from "@/lib/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

type CtaConfig = {
  label: string;
  hint: string;
  action: () => void;
};

export function ContextualStickyCta() {
  const activeSection = useActiveSection(sectionLinks.map((s) => s.id));
  const btnRef = useRef<HTMLButtonElement>(null);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ctaBySection = useMemo<Record<string, CtaConfig>>(
    () => ({
      projects: {
        label: "Compare projects",
        hint: "Open compare mode for visible projects.",
        action: () => {
          jumpTo("projects");
          window.dispatchEvent(new Event("portfolio:compare-projects"));
          emitToast("Navigating to Projects", "info");
        },
      },
      contact: {
        label: "Send message",
        hint: "Jump to contact form.",
        action: () => {
          jumpTo("contact");
          emitToast("Navigating to Contact", "info");
        },
      },
      certs: {
        label: "View credentials",
        hint: "Jump to certifications section.",
        action: () => {
          jumpTo("certs");
          emitToast("Navigating to Certifications", "info");
        },
      },
    }),
    [],
  );

  const current = useMemo(() => ctaBySection[activeSection] ?? {
    label: "View Projects",
    hint: "Jump to project track.",
    action: () => {
      jumpTo("project-track");
      emitToast("Navigating to Projects", "info");
    },
  }, [activeSection]);
  const [rendered, setRendered] = useState(current);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) {
      setRendered(current);
      return;
    }
    el.style.willChange = "opacity, transform";
    gsap.to(el, {
      opacity: 0,
      y: 4,
      duration: 0.14,
      onComplete: () => {
        setRendered(current);
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
          onComplete: () => {
            el.style.willChange = "auto";
          },
        });
      },
    });
  }, [current]);

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[9999] w-[min(94vw,38rem)] -translate-x-1/2">
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          rendered.action();
          trackEvent("contextual_sticky_cta_click", { section: activeSection, label: rendered.label });
        }}
        className="pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/55 bg-bg/90 px-3 py-2 font-mono text-xs text-accent shadow-[0_0_20px_rgba(168,217,184,0.3)] backdrop-blur transition hover:border-accent sm:px-4"
      >
        <span>{rendered.label}</span>
        <span className="hidden text-[10px] text-highlight/60 sm:inline">{rendered.hint}</span>
      </button>
    </div>
  );
}
