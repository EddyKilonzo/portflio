import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">

      {/* Scan line decoration */}
      <div
        aria-hidden
        className="scan-line-404 pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />

      {/* Grid decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hex-grid opacity-20"
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">

        {/* 404 number */}
        <div className="relative">
          <span
            className="glitch-404 font-display text-[clamp(6rem,22vw,14rem)] font-black leading-none tracking-tight text-highlight/10 select-none"
            data-text="404"
            aria-hidden
          >
            404
          </span>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[clamp(6rem,22vw,14rem)] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-accent via-accent/70 to-accent/30">
              404
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span className="rounded-full border border-cyber/40 bg-cyber/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-cyber">
          Signal Lost
        </span>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl text-highlight md:text-4xl">
            Page not found
          </h1>
          <p className="max-w-md font-sans text-base text-highlight/60 leading-relaxed">
            The route you requested doesn&apos;t exist, was moved, or was never deployed.
            Head back to the portfolio to keep exploring.
          </p>
        </div>

        {/* Terminal-style path hint */}
        <div className="glass-card rounded-xl px-5 py-3 font-mono text-sm">
          <span className="text-accent/60">$ </span>
          <span className="text-highlight/50">curl </span>
          <span className="text-cyber/80">404 </span>
          <span className="text-highlight/30">— route not matched</span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-6 py-3 font-mono text-sm text-accent transition-all hover:bg-accent/20 hover:border-accent/60"
          >
            ← Back to Home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-xl border border-highlight/20 px-6 py-3 font-mono text-sm text-highlight/70 transition-all hover:border-highlight/40 hover:text-highlight"
          >
            View Projects ↗
          </Link>
        </div>

        {/* Footer hint */}
        <p className="font-mono text-[11px] uppercase tracking-widest text-highlight/25">
          eddy kilonzo · portfolio
        </p>
      </div>
    </main>
  );
}
