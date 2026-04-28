"use client";

import { animate } from "animejs";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CyberDemo = dynamic(
  () => import("@/components/demos/CyberDemo").then((m) => m.CyberDemo),
  { ssr: false },
);

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterTerminal() {
  const [open, setOpen] = useState(false);
  const idx = useRef(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const need = KONAMI[idx.current];
      if (e.key === need || e.code === need) {
        idx.current++;
        if (idx.current >= KONAMI.length) {
          idx.current = 0;
          setOpen(true);
          requestAnimationFrame(() => {
            if (panel.current) {
              animate(panel.current, {
                translateY: [120, 0],
                opacity: [0, 1],
                duration: 450,
                ease: "out(3)",
              });
            }
          });
        }
      } else {
        idx.current = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10004] p-4">
      <div
        ref={panel}
        className="glass-card mx-auto max-h-[45vh] max-w-4xl overflow-hidden rounded-t-2xl p-4 opacity-0"
        style={{ transform: "translateY(120px)" }}
      >
        <div className="mb-2 flex justify-between font-mono text-xs">
          <span className="text-highlight/70">hidden shell</span>
          <button
            type="button"
            className="text-accent"
            onClick={() => setOpen(false)}
          >
            close
          </button>
        </div>
        <div className="max-h-[38vh] overflow-auto">
          <CyberDemo />
        </div>
      </div>
    </div>
  );
}
