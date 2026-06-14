"use client";

import { projectCredibility, type Project } from "@/content/portfolio";
import { useRole } from "@/context/RoleContext";
import { getDeviceProfile } from "@/lib/device-profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCallback, useEffect, useRef, useState } from "react";

const roleBadge: Record<string, string> = {
  cyber: "bg-cyber/20 text-cyber border-cyber/40",
  engineering: "bg-eng/20 text-eng border-eng/40",
  web: "bg-eng/20 text-eng border-eng/40",
};
const roleDisplayLabel: Record<string, string> = {
  cyber: "CyberSec",
  engineering: "Developer",
  web: "Developer",
};

type Props = {
  project: Project;
  onWatch: () => void;
  onLive: () => void;
  onCode: () => void;
  onCaseStudy?: () => void;
  onToggleCompare?: () => void;
  isCompared?: boolean;
};

export function ProjectCard({
  project,
  onWatch,
  onLive,
  onCode,
  onCaseStudy,
  onToggleCompare,
  isCompared = false,
}: Props) {
  const { mode } = useRole();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltOn, setTiltOn] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const [peekMaxHeight, setPeekMaxHeight] = useState(96);
  const [peekClampClass, setPeekClampClass] = useState("line-clamp-2");
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const cred = projectCredibility[project.id];

  const previewSrc = project.liveUrl
    ? `https://api.microlink.io/?url=${encodeURIComponent(project.liveUrl)}&screenshot=true&meta=false&embed=screenshot.url`
    : null;

  useEffect(() => {
    const p = getDeviceProfile();
    setTiltOn(!p.prefersReducedMotion && !p.lowEnd);
  }, []);

  useEffect(() => {
    const updatePeekTuning = () => {
      const w = window.innerWidth;
      if (w <= 360) {
        setPeekMaxHeight(76);
        setPeekClampClass("line-clamp-1");
        return;
      }
      if (w <= 390) {
        setPeekMaxHeight(84);
        setPeekClampClass("line-clamp-2");
        return;
      }
      if (w <= 430) {
        setPeekMaxHeight(88);
        setPeekClampClass("line-clamp-2");
        return;
      }
      if (w <= 768) {
        setPeekMaxHeight(94);
        setPeekClampClass("line-clamp-2");
        return;
      }
      if (w <= 1024) {
        setPeekMaxHeight(98);
        setPeekClampClass("line-clamp-2");
        return;
      }
      setPeekMaxHeight(108);
      setPeekClampClass("line-clamp-3");
    };
    updatePeekTuning();
    window.addEventListener("resize", updatePeekTuning);
    return () => window.removeEventListener("resize", updatePeekTuning);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el || !tiltOn) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const max = 10;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-8px)`;
  }, [tiltOn]);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
    setPeekOpen(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card mi-interactive glass-card group relative w-full overflow-hidden rounded-2xl p-6 transition-shadow duration-300 will-change-transform"
      style={{
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(168,217,184,0.1)",
      }}
      onPointerMove={tiltOn ? onMove : undefined}
      onPointerEnter={() => setPeekOpen(true)}
      onPointerLeave={onLeave}
      onTouchStart={() => setPeekOpen((v) => !v)}
    >
      {/* Live site preview strip */}
      {previewSrc && !previewError && (
        <div className="-mx-6 -mt-6 mb-4 relative" style={{ height: 168 }}>
          {/* Skeleton shimmer while image loads */}
          {!previewLoaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: "rgba(var(--rgb-surface),0.30)" }}
              aria-hidden
            />
          )}
          {/* Fake browser chrome */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 px-3 py-2"
            style={{
              background: "rgba(var(--rgb-bg),0.80)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyber/50" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent/50" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-eng/50" />
            <span
              className="ml-2 flex-1 truncate rounded px-2 py-0.5 font-mono text-[9px] text-highlight/35"
              style={{ background: "rgba(var(--rgb-surface),0.22)" }}
            >
              {project.liveUrl!.replace(/^https?:\/\//, "")}
            </span>
          </div>
          {/* Screenshot */}
          <img
            src={previewSrc}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-opacity duration-500"
            style={{ opacity: previewLoaded ? 1 : 0 }}
            onLoad={() => setPreviewLoaded(true)}
            onError={() => setPreviewError(true)}
          />
          {/* Fade into card body */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
            style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
          />
        </div>
      )}

      <span
        className={`absolute right-5 top-5 z-20 rounded-full border px-2 py-0.5 font-mono text-[10px] ${roleBadge[project.roleMode]}`}
        style={previewSrc && !previewError ? { backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" } : undefined}
      >
        {roleDisplayLabel[project.roleMode] ?? project.roleMode}
      </span>
      <h3 className="font-display text-2xl text-highlight pr-20">{project.title}</h3>
      <p className="mt-0.5 font-mono text-[10px] text-highlight/65">
        <span className="opacity-70">//</span> {project.category}
      </p>
      <p className="mt-2 font-sans text-sm text-highlight/75">
        {project.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-highlight/25 bg-surface/15 px-2 py-0.5 font-mono text-[10px] text-highlight/75"
          >
            {t}
          </span>
        ))}
      </div>
      {cred ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="glass-pill">Perf {cred.performanceScore}</span>
          <span className="glass-pill">A11y {cred.accessibilityScore}</span>
          <span className="glass-pill">LH {cred.lighthouseScore}</span>
          <span className="glass-pill">{cred.loadTime}</span>
        </div>
      ) : null}
      <div
        className={`mt-4 overflow-hidden rounded-xl border border-highlight/15 bg-surface/10 transition-[max-height,opacity,padding] ${
          peekOpen
            ? "duration-220 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "duration-170 ease-[cubic-bezier(0.4,0,1,1)]"
        } ${
          peekOpen ? "p-3 opacity-100" : "max-h-0 p-0 opacity-0"
        }`}
        style={peekOpen ? { maxHeight: `${peekMaxHeight}px` } : undefined}
      >
        <div className="flex items-center justify-between font-mono text-[10px] text-highlight/65">
          <span>Outcome</span>
          <span>{project.difficulty}</span>
        </div>
        <p className={`mt-1 text-xs text-highlight/75 ${peekClampClass}`}>{project.caseStudy.outcome}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {onToggleCompare ? (
          <MagneticButton
            className={`btn-ghost hotspot-magnetic flex-1 text-xs ${isCompared ? "border-accent/60 text-accent" : ""}`}
            onClick={onToggleCompare}
          >
            {isCompared ? "Compared" : "Compare"}
          </MagneticButton>
        ) : null}
        {onCaseStudy ? (
          <MagneticButton className="btn-ghost hotspot-magnetic flex-1 text-xs" onClick={onCaseStudy}>
            Case Study
          </MagneticButton>
        ) : null}
        <MagneticButton className="btn-ghost flex-1 text-xs" onClick={onLive}>
          {project.liveUrl ? "Visit Site ↗" : "Live Demo"}
        </MagneticButton>
        {project.codeUrl ? (
          <MagneticButton
            className="btn-ghost flex-1 text-xs"
            onClick={() => window.open(project.codeUrl, "_blank", "noopener,noreferrer")}
          >
            View Code ↗
          </MagneticButton>
        ) : null}
      </div>
    </div>
  );
}
