"use client";

/** Decorative SVG node map background */
export function DecorNetwork({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="netg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7A5A" />
          <stop offset="100%" stopColor="#A8D9B8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {[
        ["10%", "20%", "35%", "18%"],
        ["70%", "25%", "88%", "40%"],
        ["25%", "65%", "55%", "75%"],
        ["60%", "55%", "80%", "80%"],
      ].map((line, i) => (
        <line
          key={i}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          stroke="url(#netg)"
          strokeWidth="0.15%"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {[
        ["10%", "20%"],
        ["35%", "18%"],
        ["70%", "25%"],
        ["88%", "40%"],
        ["25%", "65%"],
        ["55%", "75%"],
        ["60%", "55%"],
        ["80%", "80%"],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.35%" fill="#A8D9B8" opacity="0.5" />
      ))}
    </svg>
  );
}
