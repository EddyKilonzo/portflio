"use client";

import { useEffect, useState } from "react";
import { useMotionProfile } from "@/hooks/useMotionProfile";

export function IdleAmbientLayer() {
  const [idle, setIdle] = useState(false);
  const { shouldReduce } = useMotionProfile();

  useEffect(() => {
    if (shouldReduce) {
      setIdle(false);
      return;
    }
    let timer: number | null = null;
    const onScroll = () => {
      setIdle(false);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 1200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shouldReduce]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-[11] transition-opacity duration-500 ${idle ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      <div className="idle-ambient-glow absolute left-[12%] top-[18%] h-44 w-44 rounded-full bg-accent/8 blur-3xl" />
      <div className="idle-ambient-glow absolute right-[16%] top-[58%] h-40 w-40 rounded-full bg-eng/10 blur-3xl [animation-delay:500ms]" />
    </div>
  );
}

