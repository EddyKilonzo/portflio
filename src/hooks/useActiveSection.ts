"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], defaultId = "hero") {
  const [activeSection, setActiveSection] = useState(defaultId);

  useEffect(() => {
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const trackByScroll = () => {
      const target = window.scrollY + window.innerHeight * 0.30;
      let best = targets[0]!;
      let bestDist = Infinity;
      for (const el of targets) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - target);
        if (dist < bestDist) { bestDist = dist; best = el; }
      }
      if (best.id) setActiveSection(best.id);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-5% 0px -15% 0px" },
    );

    targets.forEach((el) => io.observe(el));
    window.addEventListener("scroll", trackByScroll, { passive: true });
    trackByScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", trackByScroll);
    };
  }, [sectionIds]);

  return activeSection;
}

