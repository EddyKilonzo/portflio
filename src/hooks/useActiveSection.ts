"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], defaultId = "hero") {
  const [activeSection, setActiveSection] = useState(defaultId);

  useEffect(() => {
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-15% 0px -55% 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds]);

  return activeSection;
}

