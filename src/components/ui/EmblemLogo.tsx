"use client";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const dims = { sm: 32, md: 44, lg: 64 };

export function EmblemLogo({ size = "md", className = "" }: Props) {
  const d = dims[size];
  const rx = Math.round(d * 0.2);

  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EMK logo"
    >
      <rect width="32" height="32" rx={7} fill="#0d1f18" />
      <rect
        x="1" y="1" width="30" height="30" rx={6}
        stroke="var(--accent)"
        strokeWidth="0.75"
        strokeOpacity="0.5"
      />
      <text
        x="16" y="14"
        fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace"
        fontSize="7.5"
        fontWeight="700"
        fill="var(--accent)"
        textAnchor="middle"
        letterSpacing="1"
      >
        EMK
      </text>
      <line x1="8" y1="17" x2="24" y2="17" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.6" />
      <text
        x="16" y="24"
        fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace"
        fontSize="5"
        fontWeight="400"
        fill="var(--accent)"
        fillOpacity="0.7"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        dev · sec
      </text>
    </svg>
  );
}
