"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef } from "react";

/** Aligned with React Bits Background Studio defaults: slow drift, subtle amplitude */
const WAVE_SPEED_X = 0.005;
const WAVE_SPEED_Y = 0.005;
const WAVE_AMP_X = 15;
const WAVE_AMP_Y = 25;

const COLORS = {
  lineA: "rgba(46, 122, 90, 0.07)",
  lineB: "rgba(30, 74, 58, 0.09)",
  lineC: "rgba(168, 217, 184, 0.03)",
};

type Props = {
  /** When true, fewer samples and one wave band */
  lowEnd?: boolean;
};

export function WaveBackground({ lowEnd = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // dpr capped at 1: the lines are near-invisible ambience — retina raster
    // quadruples the per-frame paint cost for no perceptible gain.
    const dpr = 1;

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const stepX = lowEnd ? 6 : 4;
    const bands = lowEnd ? 5 : 6;
    const speedScale = reducedMotion ? 0 : 1;

    // Throttle to ~30fps: the drift is slow, and a full-viewport canvas
    // repaint every 16ms competes with scrolling on the main thread.
    const FRAME_MS = 33;
    let lastDraw = 0;

    const draw = (now: number) => {
      if (!reducedMotion && now - lastDraw < FRAME_MS) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const elapsed = (now - start) * 0.001;

      ctx.clearRect(0, 0, w, h);

      const light = document.documentElement.classList.contains("light");
      const stroke1 = light ? "rgba(30, 74, 58, 0.06)" : COLORS.lineA;
      const stroke2 = light ? "rgba(46, 122, 90, 0.08)" : COLORS.lineB;
      const stroke3 = light ? "rgba(13, 31, 26, 0.03)" : COLORS.lineC;

      const tX = elapsed * WAVE_SPEED_X * 420 * speedScale;
      const tY = elapsed * WAVE_SPEED_Y * 380 * speedScale;

      for (let b = 0; b < bands; b++) {
        const bandT = b / Math.max(1, bands - 1);
        const baseY = h * (0.08 + bandT * 0.92);
        const ampScale = 0.65 + bandT * 0.35;
        const freqX = 0.0022 + b * 0.00025;
        const freqY = 0.0014 + b * 0.00015;

        ctx.beginPath();
        for (let x = 0; x <= w + stepX; x += stepX) {
          const nx = x * freqX + tX;
          const ny = baseY * freqY + tY;
          const dy =
            Math.sin(nx) * WAVE_AMP_X * ampScale +
            Math.cos(nx * 0.7 + ny) * WAVE_AMP_Y * ampScale * 0.45 +
            Math.sin(nx * 1.3 - tY * 0.8) * (WAVE_AMP_X * 0.25);

          const y = baseY + dy;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          b % 3 === 0 ? stroke1 : b % 3 === 1 ? stroke2 : stroke3;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (!reducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (reducedMotion) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [lowEnd, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-wave-canvas pointer-events-none fixed inset-0 -z-[15] h-full w-full"
      aria-hidden
    />
  );
}
