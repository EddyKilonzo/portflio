const CHARSET = "!@#$%^&*<>/\\|{}[]01";

export function scrambleText(
  finalText: string,
  durationMs: number,
  onUpdate: (display: string) => void,
  onComplete?: () => void,
): () => void {
  const start = performance.now();
  let frame = 0;
  const len = finalText.length;

  function tick(now: number) {
    const t = Math.min(1, (now - start) / durationMs);
    const resolvedCount = Math.floor(t * len);
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = finalText[i]!;
      if (ch === " " || ch === "\n") {
        out += ch;
        continue;
      }
      if (i < resolvedCount) {
        out += ch;
      } else {
        out += CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
      }
    }
    onUpdate(out);
    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      onUpdate(finalText);
      onComplete?.();
    }
  }

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
