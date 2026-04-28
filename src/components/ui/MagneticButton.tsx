"use client";

import gsap from "gsap";
import React, { useCallback, useRef } from "react";

const RADIUS = 80;
const PULL = 0.3;

function useMagneticPointer<E extends HTMLElement>(
  onPointerMoveExtra?: (e: React.PointerEvent<E>) => void,
  onPointerLeaveExtra?: (e: React.PointerEvent<E>) => void,
) {
  const ref = useRef<E | null>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  const initQuick = useCallback(() => {
    const el = ref.current;
    if (!el || xTo.current) return;
    xTo.current = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
  }, []);

  const handleMove = useCallback(
    (e: React.PointerEvent<E>) => {
      initQuick();
      const el = ref.current;
      if (!el || !xTo.current || !yTo.current) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS && dist > 0) {
        xTo.current(dx * PULL);
        yTo.current(dy * PULL);
      }
      onPointerMoveExtra?.(e);
    },
    [initQuick, onPointerMoveExtra],
  );

  const handleLeave = useCallback(
    (e: React.PointerEvent<E>) => {
      initQuick();
      if (xTo.current && yTo.current) {
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
      }
      onPointerLeaveExtra?.(e);
    },
    [initQuick, onPointerLeaveExtra],
  );

  return { ref, handleMove, handleLeave };
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export function MagneticButton({
  children,
  className = "",
  onPointerMove,
  onPointerLeave,
  ...rest
}: ButtonProps) {
  const { ref, handleMove, handleLeave } = useMagneticPointer<HTMLButtonElement>(
    onPointerMove,
    onPointerLeave,
  );

  return (
    <button
      ref={ref}
      type="button"
      className={`will-change-transform ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </button>
  );
}

type AnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onPointerMove" | "onPointerLeave"
> & {
  children: React.ReactNode;
  className?: string;
  onPointerMove?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLAnchorElement>;
};

/** Same magnetic pull as `MagneticButton`, for `<a href>` CTAs (external profiles, etc.). */
export function MagneticAnchor({
  children,
  className = "",
  onPointerMove,
  onPointerLeave,
  ...rest
}: AnchorProps) {
  const { ref, handleMove, handleLeave } = useMagneticPointer<HTMLAnchorElement>(
    onPointerMove,
    onPointerLeave,
  );

  return (
    <a
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </a>
  );
}
