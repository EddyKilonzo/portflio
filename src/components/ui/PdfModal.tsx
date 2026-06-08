"use client";

import { useEffect, useRef } from "react";

interface Props {
  pdfUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfModal({ pdfUrl, title, isOpen, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

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
      <div className="glass-card w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-highlight/15">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-highlight/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-accent text-sm">◎</span>
            <h3 className="font-display text-base text-highlight truncate">{title}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↗ Open
            </a>
            <a
              href={pdfUrl}
              download
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↓ PDF
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

        {/* PDF iframe */}
        <iframe
          src={pdfUrl}
          className="flex-1 w-full"
          title={title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
