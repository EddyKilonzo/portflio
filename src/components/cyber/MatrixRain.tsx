"use client";

import { useEffect, useRef } from "react";
import { getDeviceProfile } from "@/lib/device-profile";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|^~";
const FONT_SIZE = 13;
const FPS_CAP = 20;

export function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const p = getDeviceProfile();
    if (p.prefersReducedMotion || p.lowEnd) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.max(1, Math.floor(width / FONT_SIZE));
    const drops = Array.from({ length: cols }, () => Math.random() * -50);

    let lastTime = 0;
    let rafId = 0;
    const interval = 1000 / FPS_CAP;

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      if (time - lastTime < interval) return;
      lastTime = time;

      ctx.fillStyle = "rgba(13, 31, 26, 0.055)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FONT_SIZE;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];

        ctx.fillStyle = "rgba(22, 163, 74, 0.85)";
        ctx.fillText(char, i * FONT_SIZE, y);

        if (drops[i] > 2) {
          ctx.fillStyle = "rgba(22, 163, 74, 0.28)";
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT_SIZE, y - FONT_SIZE);
        }

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      }
    };

    rafId = requestAnimationFrame(draw);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
