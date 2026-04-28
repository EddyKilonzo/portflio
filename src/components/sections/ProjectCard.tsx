"use client";

import type { Project } from "@/content/portfolio";
import { useRole } from "@/context/RoleContext";
import { getDeviceProfile } from "@/lib/device-profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCallback, useEffect, useRef, useState } from "react";

const roleBadge: Record<string, string> = {
  cyber: "bg-cyber/20 text-cyber border-cyber/40",
  engineering: "bg-eng/20 text-eng border-eng/40",
  web: "bg-highlight/15 text-highlight border-highlight/30",
};

type Props = {
  project: Project;
  onWatch: () => void;
  onLive: () => void;
  onCode: () => void;
  onCaseStudy?: () => void;
};

export function ProjectCard({
  project,
  onWatch,
  onLive,
  onCode,
  onCaseStudy,
}: Props) {
  const { mode } = useRole();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltOn, setTiltOn] = useState(false);

  useEffect(() => {
    const p = getDeviceProfile();
    setTiltOn(!p.prefersReducedMotion && !p.lowEnd);
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
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card mi-interactive glass-card group relative w-[min(100vw-3rem,380px)] shrink-0 rounded-2xl p-6 transition-shadow duration-300 will-change-transform"
      style={{
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(168,217,184,0.1)",
      }}
      onPointerMove={tiltOn ? onMove : undefined}
      onPointerLeave={tiltOn ? onLeave : undefined}
    >
      <div
        className={`mb-3 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] ${roleBadge[project.roleMode]}`}
      >
        {project.roleMode} · {mode}
      </div>
      <h3 className="font-display text-2xl text-highlight">{project.title}</h3>
      <p className="mt-2 font-sans text-sm text-highlight/75">
        {project.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-highlight/15 bg-surface/20 px-2 py-0.5 font-mono text-[10px] text-highlight/80"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {onCaseStudy ? (
          <MagneticButton className="btn-ghost flex-1 text-xs" onClick={onCaseStudy}>
            Case Study
          </MagneticButton>
        ) : null}
        <MagneticButton className="btn-ghost flex-1 text-xs" onClick={onWatch}>
          Watch Demo
        </MagneticButton>
        <MagneticButton className="btn-ghost flex-1 text-xs" onClick={onLive}>
          Live Demo
        </MagneticButton>
        <MagneticButton className="btn-ghost flex-1 text-xs" onClick={onCode}>
          View Code
        </MagneticButton>
      </div>
    </div>
  );
}
