"use client";

import { useEffect, useState } from "react";

const IDLE_MS = 5 * 60 * 1000;

export function Screensaver() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(t);
      setOn(false);
      t = setTimeout(() => setOn(true), IDLE_MS);
    };
    const ev = () => reset();
    reset();
    window.addEventListener("pointermove", ev);
    window.addEventListener("keydown", ev);
    window.addEventListener("scroll", ev);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", ev);
      window.removeEventListener("keydown", ev);
      window.removeEventListener("scroll", ev);
    };
  }, []);

  if (!on) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden font-mono text-[10px] text-surfaceMid/40">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 7) % 100}%`,
            animationDuration: `${4 + i}s`,
          }}
        >
          {Math.random().toString(2).slice(2, 18)}
        </span>
      ))}
    </div>
  );
}
