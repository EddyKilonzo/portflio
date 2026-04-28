"use client";

import { scrambleText } from "@/lib/scramble";
import { useEffect, useRef, useState } from "react";

type Tag = "h2" | "h3" | "span" | "p";

export function ScrambleTitle({
  text,
  className = "",
  as = "span",
}: {
  text: string;
  className?: string;
  as?: Tag;
}) {
  const [display, setDisplay] = useState("");
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    triggered.current = false;
    setDisplay("");
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !triggered.current) {
          triggered.current = true;
          scrambleText(text, 1200, setDisplay);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className}>
      {display}
    </Tag>
  );
}
