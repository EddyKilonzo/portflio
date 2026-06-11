"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface Props {
  pdfUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfModal({ pdfUrl, title, isOpen, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  // Portal to <body> so transformed/AOS ancestors can't trap or clip the overlay
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="glass-card flex h-[92vh] w-full flex-col overflow-hidden rounded-2xl border border-highlight/15 sm:max-w-5xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-highlight/10 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-sm text-accent">◎</span>
            <h3 className="truncate font-display text-base text-highlight">{title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↗ Open in Tab
            </a>
            <a
              href={pdfUrl}
              download
              className="glass-pill text-[11px] text-highlight/60 hover:text-highlight"
            >
              ↓ Download
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-highlight/15 px-2.5 py-1 font-mono text-xs text-highlight/50 transition-colors hover:border-highlight/30 hover:text-highlight"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF viewer — iframe works across Chrome, Firefox, Safari desktop + modern mobile */}
        <iframe
          src={pdfUrl}
          title={title}
          className="w-full flex-1 border-0"
        />

        {/* Fallback strip shown when iframe cannot render (e.g. blocked by browser policy) */}
        <noscript>
          <div className="flex shrink-0 items-center justify-center gap-4 border-t border-highlight/10 px-5 py-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent/15"
            >
              ↗ Open PDF in new tab
            </a>
          </div>
        </noscript>
      </div>
    </div>,
    document.body,
  );
}
