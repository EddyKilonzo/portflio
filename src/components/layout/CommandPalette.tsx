"use client";

import { useEffect, useMemo, useState } from "react";

type Cmd = { id: string; label: string; target: string };

const commands: Cmd[] = [
  { id: "home", label: "Go to Home", target: "hero" },
  { id: "about", label: "Go to About", target: "about" },
  { id: "skills", label: "Go to Skills", target: "skills" },
  { id: "projects", label: "Go to Projects", target: "projects" },
  { id: "experience", label: "Go to Experience", target: "experience" },
  { id: "cv", label: "Go to CV", target: "cv" },
  { id: "contact", label: "Go to Contact", target: "contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-start justify-center bg-bg/60 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="glass-card w-full max-w-xl rounded-2xl p-3"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command... (e.g. projects)"
          className="w-full rounded-xl border border-highlight/20 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight outline-none"
        />
        <div className="mt-2 max-h-[48vh] space-y-1 overflow-y-auto">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              className="w-full rounded-lg border border-transparent px-3 py-2 text-left font-mono text-xs text-highlight/85 transition-colors hover:border-highlight/20 hover:bg-surface/20"
              onClick={() => {
                document.getElementById(cmd.target)?.scrollIntoView({ behavior: "smooth" });
                setOpen(false);
                setQuery("");
              }}
            >
              {cmd.label}
            </button>
          ))}
          {!filtered.length ? (
            <p className="px-3 py-2 font-mono text-xs text-highlight/50">No matching command.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
