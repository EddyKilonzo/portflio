"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Proto = "TCP" | "UDP" | "ICMP";

type PacketRow = {
  id: string;
  num: number;
  size: number;
  ttl: number;
  proto: Proto;
  srcIp: string;
  dstIp: string;
  srcPort?: number;
  dstPort?: number;
  win?: number;
  flags?: string;
  service?: string;
  layer7?: string;
};

// ── Data generators ────────────────────────────────────────────────────────
const LOCAL_IPS  = ["192.168.1.5", "192.168.1.12", "10.0.1.3", "172.16.0.8"];
const EXT_IPS    = ["8.8.8.8", "1.1.1.1", "142.250.80.14", "151.101.1.140", "104.21.44.109", "52.84.202.45"];
const DNS_NAMES  = ["api.github.com", "fonts.googleapis.com", "cloudflare.com", "vercel.app", "npmjs.com", "registry.npmjs.org"];
const HTTP_LINES = ["GET /api/v1/users HTTP/1.1", "POST /auth/login HTTP/1.1", "GET /health HTTP/1.1", "PUT /api/settings HTTP/1.1"];
const TCP_FLAGS  = ["SYN", "SYN|ACK", "ACK", "PSH|ACK", "PSH|ACK", "FIN|ACK", "RST"];
const TCP_SVCS: [number, string][] = [[443,"HTTPS"],[80,"HTTP"],[22,"SSH"],[3306,"MySQL"],[5432,"PgSQL"],[25,"SMTP"]];
const UDP_SVCS: [number, string][] = [[53,"DNS"],[123,"NTP"],[5353,"mDNS"],[67,"DHCP"]];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]!; }
function rnd(a: number, b: number) { return a + Math.floor(Math.random() * (b - a + 1)); }
function ephemeral() { return rnd(49152, 65535); }

let _counter = 0;

function makePacket(): PacketRow {
  _counter += 1;
  const num   = _counter;
  const local = pick(LOCAL_IPS);
  const ext   = pick(EXT_IPS);
  const roll  = Math.random();

  if (roll < 0.52) {
    const [port, svc] = pick(TCP_SVCS);
    const out   = Math.random() > 0.4;
    const flags = pick(TCP_FLAGS);
    let layer7: string | undefined;
    if (svc === "HTTP" && flags.includes("PSH")) layer7 = pick(HTTP_LINES);
    return {
      id: `p${num}-${Math.random().toString(36).slice(2, 5)}`,
      num, size: rnd(64, 1514), ttl: rnd(48, 64),
      proto: "TCP",
      srcIp: out ? local : ext, dstIp: out ? ext : local,
      srcPort: out ? ephemeral() : port,
      dstPort: out ? port : ephemeral(),
      win: rnd(8192, 65535),
      flags, service: svc, layer7,
    };
  } else if (roll < 0.82) {
    const [port, svc] = pick(UDP_SVCS);
    let dstIp   = ext;
    let layer7: string | undefined;
    if (svc === "DNS")  { dstIp = "8.8.8.8"; layer7 = `QUERY  ${pick(DNS_NAMES)}  A`; }
    if (svc === "DHCP") dstIp = "255.255.255.255";
    return {
      id: `p${num}-${Math.random().toString(36).slice(2, 5)}`,
      num, size: rnd(64, 256), ttl: 64,
      proto: "UDP",
      srcIp: local, dstIp,
      srcPort: ephemeral(), dstPort: port,
      service: svc, layer7,
    };
  } else {
    const seq = rnd(1, 99);
    const chk = rnd(0x1000, 0xffff).toString(16);
    return {
      id: `p${num}-${Math.random().toString(36).slice(2, 5)}`,
      num, size: 84, ttl: 64,
      proto: "ICMP",
      srcIp: local, dstIp: ext,
      layer7: `Echo Request  id=1  seq=${seq}  chk=0x${chk}`,
    };
  }
}

// ── Filters ────────────────────────────────────────────────────────────────
const FILTERS = [
  { label: "all",  expr: "",                 fn: (_: PacketRow) => true },
  { label: "tcp",  expr: "tcp",              fn: (p: PacketRow) => p.proto === "TCP" },
  { label: "udp",  expr: "udp",             fn: (p: PacketRow) => p.proto === "UDP" },
  { label: "dns",  expr: "udp and port 53",  fn: (p: PacketRow) => p.proto === "UDP" && p.dstPort === 53 },
  { label: "http", expr: "tcp and port 80",  fn: (p: PacketRow) => p.proto === "TCP" && (p.srcPort === 80 || p.dstPort === 80) },
  { label: "icmp", expr: "icmp",             fn: (p: PacketRow) => p.proto === "ICMP" },
] as const;

// ── Colors ─────────────────────────────────────────────────────────────────
const PROTO_COLOR: Record<Proto, string> = {
  TCP:  "text-green-400",
  UDP:  "text-blue-400",
  ICMP: "text-red-400",
};

// ── Component ──────────────────────────────────────────────────────────────
export function PacketCapture() {
  const [packets,   setPackets]   = useState<PacketRow[]>([]);
  const [filterIdx, setFilterIdx] = useState(0);
  const [running,   setRunning]   = useState(true);
  const [total,     setTotal]     = useState(0);
  const listRef   = useRef<HTMLDivElement>(null);

  const filter  = FILTERS[filterIdx]!;
  const visible = useMemo(
    () => packets.filter(filter.fn).slice(-20),
    [packets, filter.fn],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTotal(t => t + 1);
      setPackets(prev => [...prev.slice(-100), makePacket()]);
    }, 750);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible.length]);

  const counts = useMemo(() => {
    const c = { TCP: 0, UDP: 0, ICMP: 0 };
    packets.forEach(p => { if (p.proto in c) c[p.proto as Proto]++; });
    return c;
  }, [packets]);

  return (
    <div
      className="flex flex-col font-mono text-[11px] rounded-xl overflow-hidden"
      style={{ background: "#050d09", minHeight: 460 }}
    >
      {/* ── Titlebar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-3 border-b border-green-900/50 px-4 py-2.5"
        style={{ background: "#07120d" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-green-700/80 text-[10px]">network_sniffer.py — filtering &amp; payload analysis</span>
        </div>
        <div className="flex items-center gap-2">
          {running ? (
            <span className="flex items-center gap-1 text-[10px] text-green-400/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              capturing
            </span>
          ) : (
            <span className="text-[10px] text-yellow-400/70">paused</span>
          )}
          <button
            type="button"
            onClick={() => setRunning(r => !r)}
            className="rounded border border-green-900/60 px-2 py-0.5 text-[10px] text-green-500/60 hover:border-green-500/50 hover:text-green-400 transition-colors"
          >
            {running ? "⏸ pause" : "▶ resume"}
          </button>
        </div>
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-3 border-b border-green-900/30 px-4 py-2"
        style={{ background: "#060f0a" }}
      >
        <span className="text-green-700/70 text-[10px] shrink-0">
          $ python network_sniffer.py
          {filter.expr ? (
            <> <span className="text-green-300/90">-f &quot;{filter.expr}&quot;</span></>
          ) : (
            <span className="text-green-600/50"> &lt;no filter — capturing all&gt;</span>
          )}
        </span>
        <div className="ml-auto flex gap-1 flex-wrap">
          {FILTERS.map((f, i) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilterIdx(i)}
              className={`rounded px-2 py-0.5 text-[9px] uppercase tracking-wide border transition-colors ${
                filterIdx === i
                  ? "bg-green-400/15 border-green-400/50 text-green-300"
                  : "border-green-900/50 text-green-700/60 hover:border-green-700/60 hover:text-green-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Startup lines ─────────────────────────────────────────────── */}
      {packets.length === 0 && (
        <div className="px-4 pt-3 pb-1 text-green-500/70 text-[10px] space-y-0.5">
          <div><span className="text-cyan-500/80">[*]</span> Network sniffer — filtering &amp; payload analysis</div>
          {filter.expr && <div><span className="text-cyan-500/80">[*]</span> Filter : {filter.expr}</div>}
          <div><span className="text-green-400/90">[+]</span> Listening (win32)  —  Ctrl-C to stop</div>
          <div className="text-green-800/60 animate-pulse">capturing packets…</div>
        </div>
      )}

      {/* ── Packet stream ─────────────────────────────────────────────── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-0"
        style={{ maxHeight: 340 }}
      >
        {visible.length === 0 && packets.length > 0 && (
          <div className="text-green-800/70 text-[10px] mt-8 text-center">
            No packets match filter &quot;{filter.expr}&quot;…
          </div>
        )}

        {visible.map(p => (
          <div key={p.id} className="border-b border-green-950/80 py-1.5">
            {/* Separator */}
            <div className="text-[10px] mb-0.5">
              <span className="text-yellow-500/70">─── </span>
              <span className="text-yellow-400/90">#{String(p.num).padEnd(5)}</span>
              <span className="text-white/25">  {String(p.size).padStart(5)} B  </span>
              <span className="text-white/25">TTL=</span>
              <span className="text-cyan-500/70">{p.ttl}</span>
              <span className="text-yellow-500/40">  ────────────────────</span>
            </div>

            {/* Protocol + addresses */}
            <div className={`text-[11px] leading-snug ${PROTO_COLOR[p.proto]}`}>
              <span>{"  "}{p.proto.padEnd(4)}{" "}</span>
              <span className="text-cyan-400">{p.srcIp}</span>
              {p.srcPort != null && <span className="text-white/40">:{p.srcPort}</span>}
              <span className="text-white/30"> → </span>
              <span className="text-cyan-300">{p.dstIp}</span>
              {p.dstPort != null && <span className="text-white/40">:{p.dstPort}</span>}
              {p.service && (
                <span className="text-purple-300/80">{"  "}[{p.service}]</span>
              )}
            </div>

            {/* TCP flags + window */}
            {p.flags && (
              <div className="text-[10px] text-white/40 leading-snug pl-6">
                Flags=<span className="text-yellow-300/80">{p.flags}</span>
                {"  "}Win=<span className="text-white/35">{p.win}</span>
              </div>
            )}

            {/* Layer 7 */}
            {p.layer7 && p.proto === "UDP" && (
              <div className="text-[10px] text-blue-300/80 leading-snug pl-6">
                {"    "}DNS  {p.layer7}
              </div>
            )}
            {p.layer7 && p.proto === "TCP" && (
              <div className="text-[10px] text-yellow-200/70 leading-snug pl-6">
                HTTP  {p.layer7}
              </div>
            )}
            {p.layer7 && p.proto === "ICMP" && (
              <div className="text-[10px] text-red-300/70 leading-snug pl-6">
                {p.layer7}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Stats footer ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-green-900/40 px-4 py-2 text-[10px]"
        style={{ background: "#060f0a" }}
      >
        <span className="text-green-700/60">Seen</span>
        <span className="text-green-300">{total}</span>
        <span className="text-green-900">│</span>
        <span className="text-green-500">TCP</span>
        <span className="text-green-300">{counts.TCP}</span>
        <span className="text-blue-500">UDP</span>
        <span className="text-blue-300">{counts.UDP}</span>
        <span className="text-red-500">ICMP</span>
        <span className="text-red-300">{counts.ICMP}</span>
        <span className="ml-auto text-green-900/70">[simulation]</span>
      </div>
    </div>
  );
}
