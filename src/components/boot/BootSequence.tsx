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
const TYPE_DELAY_MS = 8;
const LINE_PAUSE_MS = 48;
const POST_COMPLETE_PAUSE_MS = 120;
const EXIT_DURATION_MS = 380;

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

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      setVisible(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const totalSteps = LINES.length + 1;
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
      setStatusText("Boot complete");
      setProgress(100);
      await sleep(POST_COMPLETE_PAUSE_MS);

      const el = wrapRef.current;
      if (el && !cancelled) {
        animate(el, {
          clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
          opacity: [1, 0],
          scale: [1, 0.985],
          duration: EXIT_DURATION_MS,
          ease: "inOut(3)",
          onComplete: () => {
            if (!cancelled) {
              setVisible(false);
              onDone();
            }
          },
        });
      } else if (!cancelled) {
        setVisible(false);
        onDone();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reducedMotion, onDone]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#dae1dd] px-4 font-mono text-sm text-[#1f443d] will-change-[clip-path,opacity,transform]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="glass-card w-full max-w-5xl rounded-xl border border-highlight/25 bg-bg/90 p-4 text-highlight shadow-[0_20px_60px_rgba(18,48,42,0.22)] sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-highlight/20 pb-3 text-[11px] text-highlight/75">
          <p>{profile.initials.toLowerCase()}@secure-shell: ~</p>
          <div className="flex items-center gap-3">
            <p>session: bootloader</p>
            <button type="button" onClick={onDone} className="mi-interactive rounded border border-highlight/25 px-2 py-0.5 text-[10px]">
              Skip
            </button>
          </div>
        </div>

        <pre className="mb-6 max-w-full overflow-x-auto text-[28px] font-bold leading-[0.9] tracking-tight text-accent sm:text-[54px]">
          {profile.initials}
        </pre>

        <div className="max-h-[42vh] space-y-2 overflow-y-auto text-xs sm:text-sm">
          {LINES.map((line, i) => (
            <div key={line} className="min-h-[1.25rem] text-highlight/90">
              <span className="mr-2 text-highlight/55">&gt;</span>
              {linesShown[i] ?? ""}
              {linesShown[i] !== line && linesShown[i] !== undefined ? (
                <span className="animate-pulse">_</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-9">
          <div className="h-2.5 w-full rounded-full bg-surface/45">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-highlight/70">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
