"use client";

import { animate } from "animejs";
import { FocusTrap } from "focus-trap-react";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
};

export function AppModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (backdrop) {
      animate(backdrop, { opacity: [0, 1], duration: 220, ease: "linear" });
    }
    if (panel) {
      animate(panel, {
        opacity: [0, 1],
        y: [16, 0],
        scale: [0.96, 1],
        duration: 320,
        ease: "out(4)",
      });
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

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          fallbackFocus: "#app-modal-panel",
          escapeDeactivates: false,
        }}
      >
        <div
          id="app-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          className={`glass-card w-full overflow-hidden rounded-2xl border border-highlight/20 bg-surface/20 ${
            size === "lg" ? "max-w-2xl" : "max-w-lg"
          }`}
        >
          <div className="border-b border-highlight/10 px-5 py-4">
            <h3 className="font-display text-2xl text-highlight">{title}</h3>
            {subtitle ? (
              <p className="mt-1 font-sans text-sm text-highlight/70">{subtitle}</p>
            ) : null}
          </div>
          <div className="px-5 py-5">{children}</div>
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-highlight/10 px-5 py-4">
            {footer}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
