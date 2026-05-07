"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CountUp({ target, duration = 1600, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          el.textContent = String(Math.round(easeOutCubic(progress) * target)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
