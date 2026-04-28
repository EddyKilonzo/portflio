"use client";

import { SectionSkeleton } from "@/components/ui/Skeleton";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Skeleton card count to show while loading. Default: 3 */
  skeletonCards?: number;
  /** How far before the viewport edge to trigger load. Default: "300px" */
  rootMargin?: string;
  /** Extra className on the wrapper div */
  className?: string;
};

/**
 * Defers rendering children until the section is near the viewport.
 * Shows a skeleton shimmer in the meantime.
 */
export function LazySection({
  children,
  skeletonCards = 3,
  rootMargin = "300px",
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

  return (
    <div ref={ref} className={className}>
      {visible ? children : <SectionSkeleton cards={skeletonCards} />}
    </div>
  );
}
