"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { motionTokens } from "@/lib/motion-tokens";

type ToastKind = "info" | "success" | "warning";
type ToastItem = { id: number; message: string; kind: ToastKind };

const kindClass: Record<ToastKind, string> = {
  info: "border-highlight/20 text-highlight",
  success: "border-emerald-400/40 text-emerald-200",
  warning: "border-amber-400/40 text-amber-200",
};

export function ToastViewport() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string; kind?: ToastKind }>).detail;
      if (!detail?.message) return;
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const item: ToastItem = {
        id,
        message: detail.message,
        kind: detail.kind ?? "info",
      };
      setToasts((prev) => [...prev, item].slice(-4));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    };
    window.addEventListener("portfolio:toast", onToast as EventListener);
    return () => window.removeEventListener("portfolio:toast", onToast as EventListener);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const els = document.querySelectorAll<HTMLElement>("[data-toast-item]");
    els.forEach((el) => {
      el.style.willChange = "transform, opacity";
    });
    gsap.fromTo(
      els,
      { y: 12, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: motionTokens.duration.fast,
        ease: motionTokens.ease.standard,
        stagger: 0.04,
        onComplete: () => {
          els.forEach((el) => {
            el.style.willChange = "auto";
          });
        },
      },
    );
  }, [toasts]);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[10020] flex w-[min(88vw,24rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-toast-item
          className={`glass-card rounded-xl border px-3 py-2 font-mono text-xs shadow-glass ${kindClass[toast.kind]}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
