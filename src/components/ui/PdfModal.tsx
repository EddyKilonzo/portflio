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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
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
              className="rounded-lg border border-highlight/15 px-2.5 py-1 font-mono text-xs text-highlight/50 hover:text-highlight hover:border-highlight/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF object — better cross-browser support than iframe for PDFs */}
        <object
          data={pdfUrl}
          type="application/pdf"
          className="flex-1 w-full"
          title={title}
        >
          {/* Fallback when browser blocks inline PDF (e.g. Chrome on some OS configs) */}
          <div className="flex flex-1 h-full flex-col items-center justify-center gap-5 p-8 text-center">
            <span className="font-mono text-4xl text-highlight/20">◎</span>
            <p className="font-mono text-sm text-highlight/50">
              Your browser blocked the inline PDF preview.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent/15"
              >
                ↗ Open PDF in new tab
              </a>
              <a
                href={pdfUrl}
                download
                className="rounded-xl border border-highlight/20 px-5 py-2.5 font-mono text-sm text-highlight/70 transition-colors hover:border-highlight/40"
              >
                ↓ Download PDF
              </a>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
}
