"use client";

type Props = {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
};

export function StateCard({ title, message, ctaLabel, ctaHref, compact = false }: Props) {
  return (
    <div className={`glass-card rounded-2xl border border-highlight/20 ${compact ? "p-4" : "p-6"}`} role="status" aria-live="polite">
      <p className="font-display text-2xl text-highlight">{title}</p>
      <p className="mt-2 max-w-2xl font-sans text-highlight/80">{message}</p>
      {ctaLabel && ctaHref ? (
        <a href={ctaHref} className="btn-ghost mt-4 inline-flex items-center px-4 py-2 text-xs">
          {ctaLabel}
        </a>
      ) : null}
    </div>
  );
}
