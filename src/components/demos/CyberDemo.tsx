"use client";

import { profile, cveLog } from "@/content/portfolio";
import { PacketCapture } from "@/components/demos/PacketCapture";
import { useEffect, useRef, useState } from "react";
import type { Terminal as XTerm } from "xterm";
import type { FitAddon as XTermFitAddon } from "xterm-addon-fit";

const quickFacts = [
  `${profile.bugBounty.totalFindings} bug bounty findings across ${profile.bugBounty.platforms.join(", ")}`,
  `HTB rank: ${profile.ctf.htbRank} · THM rank: ${profile.ctf.thmRank}`,
  `${profile.ctf.solved} CTF challenges solved`,
  "Full-stack delivery with a security-first mindset",
];

const commandExamples = [
  "whoami",
  "bug-hunt",
  "cve-log",
  "nmap -sV portfolio.local",
  "impact",
];

// Varied, realistic threat intel events
const LIVE_EVENTS = [
  { tag: "detect",  text: "sigma rule matched: lateral_movement_lsass"        },
  { tag: "bounty",  text: "HackerOne: P2 finding submitted for triage"         },
  { tag: "ctf",     text: "HTB machine rooted: Absolute"                       },
  { tag: "detect",  text: "EDR alert: PowerShell obfuscation pattern"          },
  { tag: "scan",    text: "Nmap sweep: 3 open ports on test target"            },
  { tag: "bounty",  text: "Bugcrowd: report escalated to P3"                   },
  { tag: "ctf",     text: "THM room completed: Carnage"                        },
  { tag: "report",  text: "CVE draft submitted for vendor review"               },
  { tag: "detect",  text: "YARA rule authored: ransomware_indicator_v2"        },
  { tag: "fw",      text: "deny tcp/445 src=10.0.4.12 — SMB blocked"          },
  { tag: "audit",   text: "authentication log anomaly: 52 events / 4 min"     },
  { tag: "scan",    text: "Burp Suite: IDOR finding in API endpoint"           },
  { tag: "ctf",     text: "HTB pro lab milestone: 8 flags"                     },
  { tag: "detect",  text: "SIEM correlation rule fired: auth_spike"            },
  { tag: "bounty",  text: "HackerOne: disclosure approved — hall of fame"      },
  { tag: "report",  text: "pen test report delivered: executive summary ready" },
];

const TAG_COLORS: Record<string, string> = {
  detect: "#4C9EFF",
  bounty: "#A8D9B8",
  ctf:    "#B794F6",
  scan:   "#F6E05E",
  report: "#A8D9B8",
  fw:     "#FF4C4C",
  audit:  "#FF9A4C",
};

type LogEntry = { id: number; tag: string; text: string; ts: string };

const severityColor: Record<string, string> = {
  critical: "text-red-400",
  high:     "text-orange-400",
  medium:   "text-yellow-300",
  low:      "text-blue-300",
};

const statusDot: Record<string, string> = {
  patched:    "bg-emerald-400",
  disclosed:  "bg-yellow-400",
  pending:    "bg-orange-400",
};

function typeLine(term: XTerm, text: string, speed = 12) {
  return new Promise<void>((resolve) => {
    let i = 0;
    const id = window.setInterval(() => {
      term.write(text[i] ?? "");
      i++;
      if (i >= text.length) {
        clearInterval(id);
        term.write("\r\n");
        resolve();
      }
    }, speed);
  });
}

export function CyberDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitRef = useRef<XTermFitAddon | null>(null);
  const counterRef = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const now = new Date();
    return LIVE_EVENTS.slice(0, 4).map((e, i) => ({
      id: i,
      tag: e.tag,
      text: e.text,
      ts: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes() + i).padStart(2, "0")}`,
    }));
  });
  const [termReady, setTermReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: "220px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = wrapRef.current;
    if (!el) return;

    let cancelled = false;
    let term: XTerm | null = null;
    let ro: ResizeObserver | null = null;

    const safeFit = () => {
      if (!el.isConnected || el.clientWidth < 8 || el.clientHeight < 8) return;
      try { fitRef.current?.fit(); } catch { /* xterm fit race */ }
    };

    const runCmd = async (line: string) => {
      const parts = line.trim().split(/\s+/);
      const cmd = parts[0]?.toLowerCase();
      if (!term) return;

      if (cmd === "help") {
        term.writeln("Commands: whoami | stack | impact | bug-hunt | cve-log | ctf");
        term.writeln("         nmap -sV portfolio.local | wireshark --read auth_spike.pcap");
        term.writeln("         ls projects | cat cv.txt | contact | clear");
      } else if (cmd === "whoami") {
        term.writeln(`${profile.name}`);
        term.writeln("Role: Software Engineer · Web · Cybersecurity");
        term.writeln(`Availability: ${profile.availability}`);
      } else if (cmd === "bug-hunt") {
        const { totalFindings, severities, platforms, hallOfFame } = profile.bugBounty;
        term.writeln(`Bug Bounty Summary — ${totalFindings} total findings`);
        term.writeln(`Platforms: ${platforms.join(", ")}`);
        term.writeln(`  Critical : ${severities.critical}`);
        term.writeln(`  High     : ${severities.high}`);
        term.writeln(`  Medium   : ${severities.medium}`);
        term.writeln(`  Low      : ${severities.low}`);
        term.writeln(`Hall of Fame: ${hallOfFame.join(", ")}`);
      } else if (cmd === "cve-log") {
        term.writeln("CVE / Disclosure Log:");
        cveLog.slice(0, 5).forEach((c) => {
          const label = c.cve ?? "responsible-disclosure";
          term.writeln(`  [${c.severity.padEnd(8)}] ${label} — ${c.software} (${c.status})`);
        });
      } else if (cmd === "ctf") {
        const { htbRank, thmRank, solved, badges } = profile.ctf;
        term.writeln(`CTF Activity`);
        term.writeln(`  HackTheBox : rank ${htbRank}`);
        term.writeln(`  TryHackMe  : rank ${thmRank}`);
        term.writeln(`  Solved     : ${solved} challenges`);
        term.writeln(`  Badges     : ${badges}`);
      } else if (cmd === "stack") {
        term.writeln("Dev stack:");
        term.writeln("  Angular, TypeScript, NestJS, Node.js, PostgreSQL, Prisma");
        term.writeln("  Next.js, React, Docker, Git/GitHub, Figma");
        term.writeln("Security tools:");
        term.writeln("  Burp Suite, Nmap, Metasploit, Wireshark, Kali Linux");
      } else if (cmd === "impact") {
        term.writeln("Career highlights:");
        term.writeln(`  ${profile.bugBounty.totalFindings} security findings reported`);
        term.writeln(`  ${profile.ctf.solved} CTF challenges solved`);
        term.writeln("  60% latency reduction on core API flows");
        term.writeln("  8+ production services shipped end-to-end");
        term.writeln("  500+ CI/CD pipeline runs");
      } else if (cmd === "nmap" && parts.includes("-sV")) {
        term.writeln("Starting Nmap 7.94 (simulated)");
        term.writeln("Host: portfolio.local (10.10.30.21)");
        term.writeln("PORT     STATE SERVICE  VERSION");
        term.writeln("22/tcp   open  ssh      OpenSSH 9.2");
        term.writeln("80/tcp   open  http     nginx 1.24");
        term.writeln("443/tcp  open  https    TLS 1.3");
        term.writeln("3000/tcp open  node     portfolio app");
        term.writeln("No critical exposures in baseline scan.");
      } else if (cmd === "wireshark") {
        term.writeln("Wireshark: auth_spike.pcap");
        term.writeln("Filter: tcp.port == 443 && ip.addr == 10.0.4.12");
        term.writeln("Findings:");
        term.writeln("  1,284 TLS packets · 52 failed auth events in 4 min");
        term.writeln("  Pattern: automated credential stuffing");
        term.writeln("Action: source blocked at edge firewall.");
      } else if (cmd === "ls" && parts[1] === "projects") {
        term.writeln("sentinel-siem  mesh-api  aurora-portfolio  design-system");
      } else if (cmd === "cat" && parts[1] === "cv.txt") {
        await typeLine(term, `${profile.name} — ${profile.subtitle}`);
      } else if (cmd === "contact") {
        term.writeln(`Email    : ${profile.email}`);
        term.writeln(`LinkedIn : ${profile.social.linkedin}`);
        term.writeln(`GitHub   : ${profile.social.github}`);
      } else if (cmd === "clear") {
        term.clear();
        term.writeln("Portfolio shell — type help");
      } else if (line.trim()) {
        term.writeln(`command not found: ${line.trim()} — try 'help'`);
      }
      term.write("\r\n$ ");
    };

    const init = async () => {
      await import("xterm/css/xterm.css");
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("xterm"),
        import("xterm-addon-fit"),
      ]);
      if (cancelled || !el.isConnected) return;

      term = new Terminal({
        theme: { background: "#0D1F1A", foreground: "#A8D9B8", cursor: "#A8D9B8" },
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 12,
        cursorBlink: true,
      });
      const fit = new FitAddon();
      fitRef.current = fit;
      term.loadAddon(fit);
      term.open(el);
      termRef.current = term;

      requestAnimationFrame(() => { safeFit(); setTermReady(true); });
      term.writeln("Portfolio shell — type \x1b[32mhelp\x1b[0m to explore");
      term.write("\r\n$ ");

      let buf = "";
      term.onData((d: string) => {
        if (!termRef.current) return;
        if (d === "\r") {
          termRef.current.write("\r\n");
          void runCmd(buf);
          buf = "";
        } else if (d === "") {
          if (buf.length) { buf = buf.slice(0, -1); termRef.current.write("\b \b"); }
        } else {
          buf += d;
          termRef.current.write(d);
        }
      });

      ro = new ResizeObserver(() => safeFit());
      ro.observe(el);
      window.addEventListener("resize", safeFit);
      return () => window.removeEventListener("resize", safeFit);
    };

    // Staggered event feed — uses incrementing IDs to avoid duplicate key warnings
    const logTimer = window.setInterval(() => {
      counterRef.current += 1;
      const idx = counterRef.current % LIVE_EVENTS.length;
      const ev = LIVE_EVENTS[idx]!;
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLogs((prev) => [...prev.slice(-9), { id: counterRef.current, tag: ev.tag, text: ev.text, ts }]);
    }, 2400);

    let removeResize: (() => void) | undefined;
    void init().then((cleanup) => { removeResize = cleanup; });

    return () => {
      cancelled = true;
      removeResize?.();
      ro?.disconnect();
      clearInterval(logTimer);
      fitRef.current = null;
      setTermReady(false);
      termRef.current?.dispose();
      termRef.current = null;
    };
  }, [isVisible]);

  const { totalFindings, severities } = profile.bugBounty;
  const metrics = [
    { label: "Findings",  value: totalFindings,          pct: Math.round((totalFindings / 30) * 100), color: "bg-accent/70"      },
    { label: "Critical",  value: severities.critical,    pct: Math.round((severities.critical / totalFindings) * 100), color: "bg-red-500/75"   },
    { label: "CTF solved",value: profile.ctf.solved,     pct: Math.round(profile.ctf.progressToNext * 100), color: "bg-violet-400/70" },
    { label: "CVEs filed",value: cveLog.length,          pct: Math.round((cveLog.length / 10) * 100), color: "bg-eng/70"         },
  ];

  return (
    <div ref={rootRef} className="grid gap-4 p-6 lg:grid-cols-2">
      {/* ── Terminal ── */}
      <div>
        <p className="mb-2 font-mono text-xs text-highlight/50">Terminal</p>
        <div
          ref={wrapRef}
          className="h-64 w-full overflow-hidden rounded-xl border border-highlight/15"
        />
        {!isVisible ? (
          <p className="mt-2 font-mono text-[10px] text-highlight/45">Loading terminal…</p>
        ) : !termReady ? (
          <p className="mt-2 font-mono text-[10px] text-highlight/45">Initialising…</p>
        ) : null}

        <div className="mt-3 glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Try these commands</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[11px] text-highlight/75">
            {commandExamples.map((c) => (
              <div
                key={c}
                className="rounded border border-highlight/15 bg-surface/20 px-2 py-1 truncate"
              >
                $ {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panels ── */}
      <div className="space-y-3">
        {/* Quick facts */}
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Security profile</p>
          <ul className="mt-2 space-y-1.5 font-sans text-xs text-highlight/80">
            {quickFacts.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-accent shrink-0">▸</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bug bounty metrics — real data */}
        <div className="glass-card rounded-xl p-4">
          <p className="mb-3 font-mono text-xs text-highlight/50">Bug bounty &amp; CTF metrics</p>
          <div className="space-y-2.5">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 font-mono text-[10px] text-highlight/60">{m.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface/40">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min(m.pct, 100)}%` }} />
                </div>
                <span className="w-6 text-right font-mono text-[10px] text-highlight/70">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CVE status board — real cveLog */}
        <div className="glass-card rounded-xl p-4">
          <p className="mb-3 font-mono text-xs text-highlight/50">CVE &amp; disclosure status</p>
          <ul className="space-y-2">
            {cveLog.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center gap-2 font-mono text-[10px]">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[c.status] ?? "bg-surface-mid"}`} />
                <span className={`shrink-0 ${severityColor[c.severity]}`}>{c.severity}</span>
                <span className="flex-1 truncate text-highlight/65">{c.cve ?? "responsible-disclosure"} — {c.software}</span>
                <span className="shrink-0 text-highlight/40">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live threat intel feed — deduped via numeric ID */}
        <div className="glass-card rounded-xl p-4">
          <p className="mb-2 font-mono text-xs text-highlight/50">Live security feed</p>
          <div className="max-h-28 overflow-y-auto space-y-1">
            {logs.map((l) => (
              <div key={l.id} className="flex gap-2 font-mono text-[10px] leading-relaxed">
                <span className="shrink-0 text-highlight/35">{l.ts}</span>
                <span className="shrink-0" style={{ color: TAG_COLORS[l.tag] ?? "#A8D9B8" }}>[{l.tag}]</span>
                <span className="text-highlight/70">{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Packet Capture ── */}
      <div className="lg:col-span-2">
        <PacketCapture />
      </div>
    </div>
  );
}
