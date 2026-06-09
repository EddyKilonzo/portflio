"use client";

import { useEffect, useRef, useState } from "react";

export function PageLoader() {
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current)   cancelAnimationFrame(rafRef.current);
    };

    const start = () => {
      clear();
      setWidth(0);
      setActive(true);
      // Animate to ~85% quickly then slow down
      let w = 0;
      const tick = () => {
        w = w < 30 ? w + 4 : w < 70 ? w + 1.5 : w < 85 ? w + 0.3 : w;
        setWidth(w);
        if (w < 85) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const finish = () => {
      clear();
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setActive(false);
        setWidth(0);
      }, 350);
    };

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Only trigger for same-origin page navigations, not hash-only or external
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target === "_blank") return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.hash) return;
      } catch { return; }
      start();
    };

    const onPageShow = () => finish();

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      clear();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  if (!active) return null;

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed left-0 top-0 z-[99999] h-[2px] bg-accent shadow-[0_0_8px_rgba(var(--rgb-accent),0.8)]"
        style={{ width: `${width}%`, transition: width === 100 ? "width 0.15s ease-out" : "none" }}
        aria-hidden
      />
      {/* Scan line pulse on the bar */}
      <div
        className="fixed left-0 top-0 z-[99999] h-[2px] w-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ left: `calc(${width}% - 3rem)`, transition: "left 0.1s linear" }}
        aria-hidden
      />
    </>
  );
}
