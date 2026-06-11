"use client";

import { FocusTrap } from "focus-trap-react";
import { useEffect, useRef } from "react";
import { playSurfaceEnter } from "@/lib/surface-choreography";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

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
    playSurfaceEnter(panel, backdrop);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll while the modal is open so the page can't scroll
  // behind the (mobile) bottom-sheet and wheel/touch stays inside the panel.
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[10005] flex items-end justify-center bg-black/70 px-3 pt-3 backdrop-blur-sm sm:items-center sm:p-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
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
          className={`glass-card flex w-full flex-col overflow-hidden rounded-t-2xl border border-highlight/20 bg-bg/90 sm:rounded-2xl ${
            size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"
          }`}
          style={{ maxHeight: "calc(88vh - env(safe-area-inset-bottom, 0px))" }}
        >
          {/* Header — fixed */}
          <div data-surface-item className="shrink-0 border-b border-highlight/10 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl text-highlight sm:text-2xl">{title}</h3>
                {subtitle ? (
                  <p className="mt-1 font-mono text-xs text-highlight/60">{subtitle}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-highlight/50 transition-colors hover:text-highlight"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Body — scrollable; data-lenis-prevent stops Lenis hijacking wheel inside */}
          <div data-surface-item data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            {children}
          </div>
          {/* Footer — fixed */}
          {footer && (
            <div data-surface-item className="shrink-0 flex flex-wrap items-center justify-end gap-2 border-t border-highlight/10 px-5 py-4">
              {footer}
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
}
