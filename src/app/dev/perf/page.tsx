"use client";

import { useEffect, useMemo, useState } from "react";

type Metric = { name: string; value: number };

export default function PerfDashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [resourceKb, setResourceKb] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const add = (name: string, value: number) => {
      setMetrics((prev) => [...prev.filter((m) => m.name !== name), { name, value }]);
    };

    const observers: PerformanceObserver[] = [];
    const lcp = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) add("LCP", last.startTime);
    });
    lcp.observe({ type: "largest-contentful-paint", buffered: true });
    observers.push(lcp);

    const cls = new PerformanceObserver((list) => {
      let total = 0;
      for (const entry of list.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
        if (!entry.hadRecentInput) total += entry.value ?? 0;
      }
      add("CLS", total);
    });
    cls.observe({ type: "layout-shift", buffered: true });
    observers.push(cls);

    const inp = new PerformanceObserver((list) => {
      const max = Math.max(...list.getEntries().map((e) => e.duration), 0);
      add("INP", max);
    });
    inp.observe({
      type: "event",
      buffered: true,
      ...( { durationThreshold: 16 } as Record<string, number> ),
    });
    observers.push(inp);

    const resources = performance.getEntriesByType("resource");
    const totalKb = resources.reduce((sum, e) => {
      const t = e as PerformanceResourceTiming;
      return sum + (t.transferSize || 0);
    }, 0);
    setResourceKb(Math.round(totalKb / 1024));

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const sorted = useMemo(
    () => metrics.sort((a, b) => a.name.localeCompare(b.name)),
    [metrics],
  );

  if (process.env.NODE_ENV !== "development") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-highlight">
        Dev-only route.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-10 text-highlight">
      <h1 className="font-display text-4xl">Performance dashboard</h1>
      <p className="mt-2 font-sans text-highlight/70">
        Core vitals snapshots and lightweight bundle/resource stats.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {sorted.map((m) => (
          <article key={m.name} className="glass-card rounded-xl p-4">
            <p className="font-mono text-xs text-highlight/60">{m.name}</p>
            <p className="mt-1 font-display text-3xl">{m.value.toFixed(2)}</p>
          </article>
        ))}
      </div>
      <article className="glass-card mt-6 max-w-sm rounded-xl p-4">
        <p className="font-mono text-xs text-highlight/60">Transferred resources</p>
        <p className="mt-1 font-display text-3xl">{resourceKb} KB</p>
      </article>
    </main>
  );
}
