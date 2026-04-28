"use client";

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

/** Single shimmer block */
export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-surface/30 ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-highlight/6 to-transparent" />
    </div>
  );
}

/** Card-shaped skeleton with a header bar + body lines */
export function CardSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 space-y-4 ${className}`}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2 space-y-2">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-5/6" />
        <Skeleton className="h-2.5 w-4/6" />
      </div>
    </div>
  );
}

/** Row of tag-shaped skeletons */
export function TagsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-6 rounded-full" style={{ width: `${50 + (i % 3) * 20}px` }} />
      ))}
    </div>
  );
}

/** Section-level skeleton: heading + grid of cards */
export function SectionSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className={`grid gap-6 ${cards === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
