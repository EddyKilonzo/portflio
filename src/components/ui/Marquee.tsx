"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  items: string[];
  speedSec?: number;
  className?: string;
};

export function Marquee({ items, speedSec = 20, className = "" }: Props) {
  const reducedMotion = useReducedMotion();
  if (!items.length) return null;

  if (reducedMotion) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-highlight/20 px-3 py-1 font-mono text-[11px] text-highlight/75"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  const repeated = [...items, ...items];

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max items-center gap-2"
        style={
          {
            "--marquee-duration": `${speedSec}s`,
          } as React.CSSProperties
        }
      >
        {repeated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="rounded-full border border-highlight/20 bg-surface/10 px-3 py-1 font-mono text-[11px] text-highlight/75"
          >
            {item}
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-x var(--marquee-duration) linear infinite;
          will-change: transform;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
