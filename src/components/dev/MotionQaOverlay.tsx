"use client";

import { useEffect, useState } from "react";

export function MotionQaOverlay() {
  const [fps, setFps] = useState(0);
  const [longTasks, setLongTasks] = useState(0);
  const [worstLongTask, setWorstLongTask] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();

    const tick = (t: number) => {
      frames += 1;
      if (t - last >= 1000) {
        setFps(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let observer: PerformanceObserver | null = null;
    if ("PerformanceObserver" in window) {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        setLongTasks((v) => v + entries.length);
        const localWorst = Math.max(...entries.map((e) => e.duration), 0);
        setWorstLongTask((v) => Math.max(v, localWorst));
      });
      try {
        observer.observe({ entryTypes: ["longtask"] as unknown as string[] });
      } catch {
        // ignore unsupported longtask observer
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <aside className="fixed bottom-4 left-4 z-[10040] rounded-lg border border-highlight/20 bg-bg/85 px-3 py-2 font-mono text-[10px] text-highlight/85 backdrop-blur">
      <p>FPS: {fps}</p>
      <p>Long tasks: {longTasks}</p>
      <p>Worst LT: {worstLongTask.toFixed(1)}ms</p>
    </aside>
  );
}

