"use client";

import { useEffect, useRef } from "react";
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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="glass-card flex h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-highlight/15 sm:max-w-5xl">
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

        {/* Mobile fallback — inline PDF unsupported on iOS/Android */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center sm:hidden">
          <span className="font-mono text-5xl text-highlight/15">◎</span>
          <div className="space-y-1">
            <p className="font-display text-base text-highlight">{title}</p>
            <p className="font-mono text-sm text-highlight/50">
              PDF preview is not supported on mobile browsers.
            </p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 font-mono text-sm text-accent transition-colors hover:bg-accent/15"
            >
              ↗ Open PDF in new tab
            </a>
            <a
              href={pdfUrl}
              download
              className="flex items-center justify-center gap-2 rounded-xl border border-highlight/20 px-5 py-3 font-mono text-sm text-highlight/70 transition-colors hover:border-highlight/40"
            >
              ↓ Download PDF
            </a>
          </div>
        </div>

        {/* Desktop PDF viewer */}
        <object
          data={pdfUrl}
          type="application/pdf"
          className="hidden w-full flex-1 sm:block"
          title={title}
        >
          {/* Fallback if desktop browser also blocks inline PDFs */}
          <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
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
