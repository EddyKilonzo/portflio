"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  filename: string;
  title: string;
  language?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ScriptViewerModal({ filename, title, language = "python", isOpen, onClose }: Props) {
  const [rawCode, setRawCode] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (rawCode !== null) return;
    setLoading(true);
    setError(false);
    fetch(`/projects_docs/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then(async (text) => {
        setRawCode(text);
        // Fetch syntax-highlighted HTML from the server API
        try {
          const res = await fetch("/api/highlight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: text, lang: language }),
          });
          if (res.ok) {
            const data = (await res.json()) as { html: string | null };
            if (data.html) setHighlightedHtml(data.html);
          }
        } catch {
          // fallback to plain text
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [isOpen, filename, rawCode, language]);

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
        {/* Header — IDE-style title bar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-highlight/10 shrink-0 bg-[#0d1117]/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-[11px] text-highlight/50">{filename}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline rounded-full border border-yellow-400/30 bg-yellow-400/8 px-2 py-0.5 font-mono text-[10px] text-yellow-400/80 capitalize">
              {language}
            </span>
            <a
              href={`/projects_docs/${filename}`}
              download={filename}
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↓ {filename.includes(".") ? `.${filename.split(".").pop()}` : "file"}
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
        <div className="overflow-y-auto flex-1 bg-[#0d1117]">
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
          {rawCode !== null && !error && highlightedHtml && (
            <div
              className="shiki-wrap overflow-x-auto p-4 text-[11px] leading-relaxed sm:p-5 sm:text-[13px]"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          )}
          {rawCode !== null && !error && !highlightedHtml && (
            <pre className="overflow-x-auto whitespace-pre p-4 font-mono text-[11px] leading-relaxed text-[#e6edf3] sm:p-5 sm:text-[13px]">
              <code>{rawCode}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
