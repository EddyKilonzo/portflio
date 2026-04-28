"use client";

import { useEffect } from "react";

export function DevStats() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let cancelled = false;
    let raf = 0;
    let statsDom: HTMLElement | null = null;

    void import("stats.js").then((mod) => {
      if (cancelled) return;
      const Stats = mod.default;
      const stats = new Stats();
      stats.showPanel(0);
      stats.dom.style.position = "fixed";
      stats.dom.style.bottom = "0";
      stats.dom.style.top = "auto";
      stats.dom.style.zIndex = "10010";
      document.body.appendChild(stats.dom);
      statsDom = stats.dom;
      const loop = () => {
        stats.update();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      statsDom?.remove();
    };
  }, []);

  return null;
}
