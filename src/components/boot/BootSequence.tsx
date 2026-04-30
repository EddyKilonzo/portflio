"use client";

import { profile } from "@/content/portfolio";
import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";

const LINES = [
  "Initializing secure connection...",
  "Loading modules: [cybersec] [engineering] [webdev]",
  "Mounting encrypted filesystem...",
  "Verifying identity...",
  "Establishing session...",
  "Access granted. Welcome.",
];
const TYPE_DELAY_MS = 6;
const LINE_PAUSE_MS = 40;
const POST_COMPLETE_PAUSE_MS = 150;
const EXIT_DURATION_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type Props = {
  reducedMotion: boolean;
  onDone: () => void;
};

export function BootSequence({ reducedMotion, onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const [linesShown, setLinesShown] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Booting");
  const wrapRef = useRef<HTMLDivElement>(null);
  const doneCalledRef = useRef(false);
  // Stable ref so changing onDone never re-runs the animation effect
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const completeRef = useRef(() => {
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    setVisible(false);
    onDoneRef.current();
  });

  useEffect(() => {
    const complete = completeRef.current;

    if (reducedMotion) {
      complete();
      return;
    }

    let cancelled = false;
    // Absolute safety net — boot never takes longer than 5 s
    const safetyTimer = window.setTimeout(() => {
      cancelled = true;
      complete();
    }, 5000);

    (async () => {
      const totalSteps = LINES.length;
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return;
        const line = LINES[i]!;
        setStatusText(line.replace(/\.\.\.$/, ""));

        for (let c = 0; c <= line.length; c++) {
          if (cancelled) return;
          const partial = line.slice(0, c);
          setLinesShown((prev) => {
            const next = [...prev];
            next[i] = partial;
            return next;
          });
          await sleep(TYPE_DELAY_MS);
        }

        await sleep(LINE_PAUSE_MS);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));
      }

      if (cancelled) return;
      setStatusText("System Ready");
      setProgress(100);
      await sleep(POST_COMPLETE_PAUSE_MS);

      if (cancelled) return;

      const el = wrapRef.current;
      if (el) {
        // animejs v4 animations are Promises — await instead of using 'complete' key
        await animate(el, {
          opacity: [1, 0],
          scale: [1, 1.02],
          translateY: [0, -20],
          duration: EXIT_DURATION_MS,
          easing: "easeOutQuart",
        });
      }

      if (!cancelled) complete();
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
    };
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#dae1dd] px-4 font-mono text-sm text-[#1f443d] transition-colors duration-500"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="glass-card w-full max-w-5xl rounded-xl border border-highlight/25 bg-bg/95 p-4 text-highlight shadow-[0_20px_80px_rgba(18,48,42,0.25)] sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-highlight/20 pb-3 text-[11px] text-highlight/75">
          <p>{profile.initials.toLowerCase()}@secure-shell: ~</p>
          <div className="flex items-center gap-3">
            <p>session: v0.4.2</p>
            <button
              type="button"
              onClick={() => completeRef.current()}
              className="mi-interactive rounded border border-highlight/25 bg-highlight/5 px-2 py-0.5 text-[10px] hover:bg-highlight/10"
            >
              Skip
            </button>
          </div>
        </div>

        <pre className="mb-6 max-w-full overflow-x-auto text-[28px] font-bold leading-[0.9] tracking-tight text-accent sm:text-[54px]">
          {profile.initials}
        </pre>

        <div className="max-h-[42vh] space-y-2 overflow-y-auto font-mono text-xs sm:text-sm">
          {LINES.map((line, i) => (
            <div key={line} className="min-h-[1.25rem] text-highlight/90">
              <span className="mr-2 text-highlight/55">&gt;</span>
              {linesShown[i] ?? ""}
              {linesShown[i] !== line && linesShown[i] !== undefined ? (
                <span className="inline-block h-4 w-1 animate-pulse bg-accent align-middle" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-9">
          <div className="h-1.5 w-full rounded-full bg-surface/30">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-highlight/70">
            <span>{statusText}</span>
            <span className="text-accent">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
