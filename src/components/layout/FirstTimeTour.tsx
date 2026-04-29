"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-tour-seen-v1";

const steps = [
  "Use the DIAL tray for fast section jumps.",
  "Use project filters and presets to narrow results quickly.",
  "Use Ctrl/Cmd+K jump search across sections, projects, certs, and social.",
];

export function FirstTimeTour() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10030] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="glass-card w-full max-w-md rounded-2xl border border-highlight/25 p-4">
        <p className="font-mono text-[11px] text-highlight/55">
          Quick Tour {idx + 1}/3
        </p>
        <p className="mt-2 font-sans text-sm text-highlight/90">{steps[idx]}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "true");
              } catch {
                // ignore
              }
              setOpen(false);
            }}
          >
            Skip
          </button>
          <button
            type="button"
            className="btn-ghost border-accent/60 text-xs text-accent"
            onClick={() => {
              if (idx < steps.length - 1) {
                setIdx((v) => v + 1);
                return;
              }
              try {
                localStorage.setItem(STORAGE_KEY, "true");
              } catch {
                // ignore
              }
              setOpen(false);
            }}
          >
            {idx < steps.length - 1 ? "Next" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
