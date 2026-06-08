"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  filename: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ScriptViewerModal({ filename, title, isOpen, onClose }: Props) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (code !== null) return;
    setLoading(true);
    setError(false);
    fetch(`/projects_docs/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then((text) => { setCode(text); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [isOpen, filename, code]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="glass-card w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden border border-highlight/15">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-highlight/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-cyber text-sm">⌨</span>
            <h3 className="font-display text-base text-highlight truncate">{title}</h3>
            <span className="hidden sm:inline font-mono text-[10px] text-highlight/40 shrink-0">{filename}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/projects_docs/${filename}`}
              download={filename}
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↓ .py
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-highlight/15 px-2.5 py-1 font-mono text-xs text-highlight/50 hover:text-highlight hover:border-highlight/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center py-16 text-highlight/40 font-mono text-sm">
              Loading {filename}…
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-16 text-red-400/70 font-mono text-sm">
              Could not load file. Try the download link above.
            </div>
          )}
          {code !== null && !error && (
            <pre className="p-5 font-mono text-[12px] leading-relaxed text-highlight/80 overflow-x-auto whitespace-pre">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
