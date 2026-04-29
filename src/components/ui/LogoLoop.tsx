"use client";

import Image from "next/image";

export type LogoLoopItem = {
  label: string;
  icon: string;
};

type LogoLoopProps = {
  items: LogoLoopItem[];
  speedSeconds?: number;
  className?: string;
};

export function LogoLoop({ items, speedSeconds = 26, className }: LogoLoopProps) {
  const loopItems = [...items, ...items];

  return (
    <div className={["logo-loop", className].filter(Boolean).join(" ")}>
      <div
        className="logo-loop-track"
        style={{ animationDuration: `${Math.max(8, speedSeconds)}s` }}
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="logo-loop-item"
            aria-hidden={index >= items.length}
          >
            <Image
              src={`https://skillicons.dev/icons?i=${item.icon}`}
              alt={`${item.label} logo`}
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-sm"
              unoptimized
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
