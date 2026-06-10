"use client";

import { useEffect, useMemo, useState } from "react";
import { certifications, profile, projects } from "@/content/portfolio";
import { sectionLinks } from "@/content/sections";
import { emitToast } from "@/lib/toast";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Cmd = { id: string; label: string; type: "section" | "project" | "cert" | "social"; target: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useBodyScrollLock(open);
  const commands: Cmd[] = useMemo(
    () => [
      ...sectionLinks.map((s) => ({
        id: `section-${s.id}`,
        label: `Section: ${s.label}`,
        type: "section" as const,
        target: s.id,
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        label: `Project: ${p.title}`,
        type: "project" as const,
        target: p.title,
      })),
      ...certifications.map((c) => ({
        id: `cert-${c.id}`,
        label: `Certification: ${c.name}`,
        type: "cert" as const,
        target: "certs",
      })),
      ...[
        ["GitHub", profile.social.github],
        ["LinkedIn", profile.social.linkedin],
        ["X", profile.social.twitter],
        ["HTB", profile.social.htb],
        ["THM", profile.social.thm],
      ].map(([label, href]) => ({
        id: `social-${label.toLowerCase()}`,
        label: `Social: ${label}`,
        type: "social" as const,
        target: href,
      })),
    ],
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (!next) setQuery("");
          return next;
        });
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen as EventListener);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, query]);

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
          aria-label="Command search"
          onKeyDown={(e) => {
            if (!filtered.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % filtered.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const cmd = filtered[activeIndex];
              if (!cmd) return;
              if (cmd.type === "section" || cmd.type === "cert") {
                document.getElementById(cmd.target)?.scrollIntoView({ behavior: "smooth" });
                emitToast(
                  cmd.target === "projects"
                    ? "Navigating to Projects"
                    : `Navigating to ${cmd.label.replace(/^(Section|Certification):\s*/, "")}`,
                  "info",
                );
              } else if (cmd.type === "project") {
                const params = new URLSearchParams(window.location.search);
                params.set("q", cmd.target);
                window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}#projects`);
                window.dispatchEvent(new Event("popstate"));
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                emitToast("Applied project search filter", "success");
              } else {
                window.open(cmd.target, "_blank", "noopener,noreferrer");
                emitToast("Opened social link in new tab", "info");
              }
              setOpen(false);
              setQuery("");
            }
          }}
          className="w-full rounded-xl border border-highlight/20 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight outline-none"
        />
        <div className="mt-2 max-h-[48vh] space-y-1 overflow-y-auto" role="listbox" aria-label="Command results">
          {filtered.map((cmd, idx) => (
            <button
              key={cmd.id}
              type="button"
              className={`w-full rounded-lg border px-3 py-2 text-left font-mono text-xs text-highlight/85 transition-colors ${
                idx === activeIndex
                  ? "border-highlight/30 bg-surface/25"
                  : "border-transparent hover:border-highlight/20 hover:bg-surface/20"
              }`}
              onClick={() => {
                if (cmd.type === "section" || cmd.type === "cert") {
                  document.getElementById(cmd.target)?.scrollIntoView({ behavior: "smooth" });
                  emitToast(
                    cmd.target === "projects"
                      ? "Navigating to Projects"
                      : `Navigating to ${cmd.label.replace(/^(Section|Certification):\s*/, "")}`,
                    "info",
                  );
                } else if (cmd.type === "project") {
                  const params = new URLSearchParams(window.location.search);
                  params.set("q", cmd.target);
                  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}#projects`);
                  window.dispatchEvent(new Event("popstate"));
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  emitToast("Applied project search filter", "success");
                } else {
                  window.open(cmd.target, "_blank", "noopener,noreferrer");
                  emitToast("Opened social link in new tab", "info");
                }
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
