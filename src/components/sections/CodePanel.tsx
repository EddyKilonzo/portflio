"use client";

import { projectCodeSamples } from "@/content/portfolio";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Props = {
  projectId: string | null;
  open: boolean;
  onClose: () => void;
};

export function CodePanel({ projectId, open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [fileIdx, setFileIdx] = useState(0);
  const [html, setHtml] = useState("");

  useBodyScrollLock(open && Boolean(projectId));

  const files = useMemo(
    () => (projectId ? projectCodeSamples[projectId] ?? [] : []),
    [projectId],
  );

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(
        el,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.set(el, { xPercent: 100 });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const f = files[fileIdx];
      if (!f) {
        setHtml("<p class='p-4 font-mono text-sm text-highlight/50'>No sample files for this project.</p>");
        return;
      }
      const out = await codeToHtml(f.content, {
        lang: f.language as "tsx" | "go" | "yaml",
        theme: "github-dark",
      });
      if (!cancelled) setHtml(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [files, fileIdx]);

  if (!open || !projectId) return null;

  const gh = `https://github.com/search?q=${encodeURIComponent(projectId)}`;

  return (
    <div
      ref={panelRef}
      className="fixed inset-y-0 right-0 z-[10003] flex w-full max-w-3xl shadow-glass will-change-transform"
      role="dialog"
      aria-label="Code preview"
    >
      <div className="glass-card flex w-full flex-col rounded-none border-l border-highlight/15">
        <div className="flex items-center justify-between border-b border-highlight/10 px-4 py-3">
          <p className="font-mono text-sm text-highlight">Source preview</p>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-sm text-highlight/70"
          >
            ✕
          </button>
        </div>
        <div className="flex min-h-0 flex-1">
          <aside className="w-28 shrink-0 overflow-y-auto border-r border-highlight/10 p-2 font-mono text-xs sm:w-44">
            {files.map((f, i) => (
              <button
                key={f.path}
                type="button"
                onClick={() => setFileIdx(i)}
                className={`mb-1 w-full truncate rounded px-2 py-1 text-left ${
                  i === fileIdx ? "bg-surface/40 text-accent" : "text-highlight/70"
                }`}
              >
                {f.path}
              </button>
            ))}
          </aside>
          <div className="min-w-0 flex-1 overflow-auto">
            <div className="flex items-center justify-between border-b border-highlight/10 px-3 py-2">
              <span className="rounded border border-highlight/20 px-2 py-0.5 font-mono text-[10px] text-highlight/60">
                {files[fileIdx]?.language ?? "—"}
              </span>
              <button
                type="button"
                className="font-mono text-[10px] text-accent"
                onClick={() =>
                  navigator.clipboard.writeText(files[fileIdx]?.content ?? "")
                }
              >
                Copy
              </button>
            </div>
            <div
              className="p-4 text-sm [&_pre]:!bg-transparent"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
        <div className="border-t border-highlight/10 px-4 py-3">
          <a
            href={gh}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-accent underline"
          >
            Open in GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
