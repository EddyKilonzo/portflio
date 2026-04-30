"use client";

import { SectionSkeleton } from "@/components/ui/Skeleton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  /** Skeleton card count to show while loading. Default: 3 */
  skeletonCards?: number;
  /** How far before the viewport edge to trigger load. Default: "900px" */
  rootMargin?: string;
  /** Extra className on the wrapper div */
  className?: string;
};

/**
 * Defers rendering children until the section is near the viewport.
 * Shows a skeleton shimmer in the meantime.
 * After content renders, refreshes ScrollTrigger so entrance animations
 * are positioned correctly against the updated document height.
 */
export function LazySection({
  children,
  skeletonCards = 3,
  rootMargin = "900px",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  // Refresh ScrollTrigger after content swaps in so all trigger positions
  // are recalculated against the updated document height.
  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("lazysection:swap"));
    }, 80);
    return () => window.clearTimeout(id);
  }, [visible]);

  return (
    <div ref={ref} className={className} style={!visible ? { minHeight: "32rem" } : undefined}>
      {visible ? children : <SectionSkeleton cards={skeletonCards} />}
    </div>
  );
}
