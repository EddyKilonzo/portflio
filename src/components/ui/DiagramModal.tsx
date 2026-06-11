"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppModal } from "./AppModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export function DiagramModal({ isOpen, onClose, imageUrl, title }: Props) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; baseTx: number; baseTy: number } | null>(null);

  // Reset zoom whenever the modal opens
  useEffect(() => {
    if (isOpen) { setScale(1); setTx(0); setTy(0); }
  }, [isOpen]);

  const clampPan = useCallback((nx: number, ny: number, s: number) => {
    const vp = viewportRef.current;
    if (!vp) return { x: nx, y: ny };
    // Keep the image from being dragged fully out of view
    const limX = (vp.clientWidth * (s - 1)) / 2;
    const limY = (vp.clientHeight * (s - 1)) / 2;
    return {
      x: Math.min(limX, Math.max(-limX, nx)),
      y: Math.min(limY, Math.max(-limY, ny)),
    };
  }, []);

  const zoomTo = useCallback((next: number, originX?: number, originY?: number) => {
    setScale((prev) => {
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      if (s === MIN_SCALE) { setTx(0); setTy(0); return s; }
      const vp = viewportRef.current;
      if (vp && originX !== undefined && originY !== undefined) {
        // Zoom toward the pointer: keep the point under the cursor stationary
        const rect = vp.getBoundingClientRect();
        const cx = originX - rect.left - rect.width / 2;
        const cy = originY - rect.top - rect.height / 2;
        const ratio = s / prev;
        setTx((p) => clampPan(cx - ratio * (cx - p), 0, s).x);
        setTy((p) => clampPan(0, cy - ratio * (cy - p), s).y);
      } else {
        setTx((p) => clampPan(p, 0, s).x);
        setTy((p) => clampPan(0, p, s).y);
      }
      return s;
    });
  }, [clampPan]);

  // Wheel zoom (non-passive so we can preventDefault inside the modal body)
  useEffect(() => {
    if (!isOpen) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      zoomTo(scale * dir, e.clientX, e.clientY);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [isOpen, scale, zoomTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseTx: tx, baseTy: ty };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const next = clampPan(d.baseTx + (e.clientX - d.startX), d.baseTy + (e.clientY - d.startY), scale);
    setTx(next.x);
    setTy(next.y);
  };
  const endDrag = () => { dragRef.current = null; };

  return (
    <AppModal
      open={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Network Architecture Topology"
      size="lg"
    >
      <div className="flex flex-col items-center">
        {/* Zoom controls */}
        <div className="mb-3 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => zoomTo(scale / 1.4)}
              className="rounded-lg border border-highlight/20 px-2.5 py-1 font-mono text-sm text-highlight/70 transition-colors hover:border-highlight/40 hover:text-highlight disabled:opacity-30"
              disabled={scale <= MIN_SCALE}
            >
              −
            </button>
            <span className="min-w-[3.5rem] text-center font-mono text-[11px] text-highlight/60">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => zoomTo(scale * 1.4)}
              className="rounded-lg border border-highlight/20 px-2.5 py-1 font-mono text-sm text-highlight/70 transition-colors hover:border-highlight/40 hover:text-highlight disabled:opacity-30"
              disabled={scale >= MAX_SCALE}
            >
              +
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={() => zoomTo(1)}
                className="ml-1 rounded-lg border border-highlight/15 px-2.5 py-1 font-mono text-[11px] text-highlight/55 transition-colors hover:text-highlight"
              >
                Reset
              </button>
            )}
          </div>
          <span className="hidden font-mono text-[10px] text-highlight/40 sm:inline">
            scroll to zoom · double-click toggles · drag to pan
          </span>
        </div>

        <div
          ref={viewportRef}
          className="relative w-full select-none overflow-hidden rounded-xl border border-highlight/10 bg-black/20"
          style={{ cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onDoubleClick={(e) => zoomTo(scale > 1 ? 1 : 2.5, e.clientX, e.clientY)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Network diagram — ${title}`}
            className="h-auto w-full object-contain"
            draggable={false}
            loading="lazy"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: dragRef.current ? "none" : "transform 180ms ease-out",
            }}
          />
        </div>

        <div className="mt-4 flex w-full items-center justify-between font-mono text-[11px] text-highlight/50">
          <span>{title}</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-accent"
          >
            Open Original
          </a>
        </div>
      </div>
    </AppModal>
  );
}
