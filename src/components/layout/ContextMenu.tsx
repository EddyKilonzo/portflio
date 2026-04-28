"use client";

import { profile } from "@/content/portfolio";
import { useEffect, useState } from "react";

export function ContextMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setOpen(true);
    };
    const onClick = () => setOpen(false);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("click", onClick);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="glass-card fixed z-[10005] min-w-[200px] rounded-xl py-2 font-mono text-xs text-highlight shadow-glass"
      style={{ left: pos.x, top: pos.y }}
      role="menu"
    >
      <button
        type="button"
        className="block w-full px-4 py-2 text-left hover:bg-surface/30"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        Copy link
      </button>
      <a
        href="#projects"
        className="block px-4 py-2 hover:bg-surface/30"
        onClick={() => setOpen(false)}
      >
        View projects
      </a>
      <a
        href="#contact"
        className="block px-4 py-2 hover:bg-surface/30"
        onClick={() => setOpen(false)}
      >
        Contact
      </a>
      <a
        href={`mailto:${profile.email}`}
        className="block px-4 py-2 hover:bg-surface/30"
      >
        Download CV
      </a>
    </div>
  );
}
