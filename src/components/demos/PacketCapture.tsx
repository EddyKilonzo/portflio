"use client";

/**
 * Simulated packet list for the cyber demo. Rows are synthetic (not real capture);
 * updates run on an interval and cap list length so React state stays bounded.
 */
import { useEffect, useState } from "react";

type Row = {
  id: string;
  ts: string;
  src: string;
  dst: string;
  proto: string;
  len: string;
  info: string;
};

const PROTOS = ["TCP", "UDP", "ICMP", "TLS", "DNS"];

export function PacketCapture() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const sip = `10.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
        const dip = `203.0.113.${Math.floor(Math.random() * 254) + 1}`;
        const row: Row = {
          id: `${performance.now()}-${Math.random().toString(36).slice(2)}`,
          ts: new Date().toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          src: sip,
          dst: dip,
          proto: PROTOS[Math.floor(Math.random() * PROTOS.length)]!,
          len: String(64 + Math.floor(Math.random() * 1200)),
          info:
            Math.random() > 0.55
              ? Math.random() > 0.5
                ? "SYN → ACK"
                : "PSH / ACK"
              : "GET /api/health HTTP/1.1",
        };
        setRows((prev) => [...prev.slice(-22), row]);
      } catch (cause) {
        console.warn("[PacketCapture] tick failed:", cause);
      }
    }, 950);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-highlight/50">Packet capture (simulation)</p>
        <span className="rounded border border-cyber/40 px-2 py-0.5 font-mono text-[9px] text-cyber">
          LIVE · DEMO
        </span>
      </div>
      <div className="mt-3 max-h-48 overflow-hidden rounded-lg border border-highlight/10 bg-bg/60 font-mono text-[9px] leading-tight">
        <div className="sticky top-0 grid grid-cols-[44px_1fr_1fr_36px_52px_1fr] gap-1 border-b border-highlight/10 bg-surface/40 px-2 py-1 text-highlight/45">
          <span>Time</span>
          <span>Source</span>
          <span>Dest</span>
          <span>Pr</span>
          <span>Len</span>
          <span>Info</span>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[44px_1fr_1fr_36px_52px_1fr] gap-1 border-b border-highlight/5 px-2 py-0.5 text-highlight/75"
            >
              <span className="text-highlight/50">{r.ts}</span>
              <span className="truncate text-accent/90">{r.src}</span>
              <span className="truncate">{r.dst}</span>
              <span>{r.proto}</span>
              <span>{r.len}</span>
              <span className="truncate text-highlight/60">{r.info}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
