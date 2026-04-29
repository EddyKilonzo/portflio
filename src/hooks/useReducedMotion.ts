"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => {
      const cls = document.documentElement.classList;
      const forcedMinimal = cls.contains("motion-minimal") || cls.contains("mode-reduced-motion");
      setReduced(forcedMinimal || mq.matches);
    };
    compute();
    const fn = () => compute();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return reduced;
}
