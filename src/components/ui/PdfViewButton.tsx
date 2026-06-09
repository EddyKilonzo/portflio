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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`glass-pill border-accent/30 text-accent hover:border-accent/60 cursor-pointer ${className}`}
      >
        ◎ View PDF Report
      </button>
      {open && (
        <PdfModal pdfUrl={pdfUrl} title={title} isOpen={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
