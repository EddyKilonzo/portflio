"use client";

import { useState } from "react";
import { PdfModal } from "./PdfModal";

interface Props {
  pdfUrl: string;
  title: string;
  className?: string;
}

export function PdfViewButton({ pdfUrl, title, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="glass-pill border-accent/30 text-accent hover:border-accent/60 cursor-pointer"
        >
          ◎ View Report
        </button>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill border-highlight/20 text-highlight/60 hover:text-highlight"
        >
          ↗ Open in Tab
        </a>
      </div>
      {open && (
        <PdfModal pdfUrl={pdfUrl} title={title} isOpen={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
