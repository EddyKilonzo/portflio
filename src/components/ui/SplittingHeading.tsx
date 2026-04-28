"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import "splitting/dist/splitting.css";
import { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

/**
 * Wraps headings with Splitting.js character cells for CSS-driven stagger effects.
 * Cleanup restores plain text so React reconciliation and Strict Mode do not fight DOM wrappers.
 */
export function SplittingHeading({ text, className, as: Tag = "h2" }: Props) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    void import("splitting")
      .then((mod) => {
        if (cancelled) return;
        const split = mod.default;
        split({ target: el, by: "chars" });
      })
      .catch((cause) => {
        console.warn("[SplittingHeading] split failed, showing plain text:", cause);
      });

    return () => {
      cancelled = true;
      el.textContent = text;
      delete el.dataset.splitting;
    };
  }, [text, reducedMotion]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref} className={className} data-splitting>
      {text}
    </Tag>
  );
}
