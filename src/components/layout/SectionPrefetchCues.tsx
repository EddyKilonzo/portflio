"use client";

import { useEffect } from "react";

export function SectionPrefetchCues() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.dataset.prefetchState) return;
          el.dataset.prefetchState = "ready";
          window.setTimeout(() => {
            el.dataset.prefetchState = "warmed";
          }, 1200);
          io.unobserve(el);
        });
      },
      { rootMargin: "320px 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

