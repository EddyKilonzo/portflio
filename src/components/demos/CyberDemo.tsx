"use client";

import { profile, cveLog } from "@/content/portfolio";
import { useEffect, useRef, useState } from "react";
import type { Terminal as XTerm } from "xterm";
import type { FitAddon as XTermFitAddon } from "xterm-addon-fit";

const commandExamples = [
  { cmd: "whoami",             desc: "identity"         },
  { cmd: "bug-hunt",           desc: "bounty stats"     },
  { cmd: "cve-log",            desc: "disclosures"      },
  { cmd: "nmap -sV portfolio.local", desc: "port scan"  },
  { cmd: "impact",             desc: "highlights"       },
  { cmd: "ctf",                desc: "CTF record"       },
];

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
  bounty: "#16A34A",
  ctf:    "#B794F6",
  scan:   "#F6E05E",
  report: "#16A34A",
  fw:     "#FF4C4C",
  audit:  "#FF9A4C",
};

type LogEntry = { id: number; tag: string; text: string; ts: string };

function typeLine(term: XTerm, text: string, speed = 14) {
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

async function runCmd(term: XTerm, line: string) {
  const parts = line.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();

  if (cmd === "help") {
    term.writeln("Commands: whoami | stack | impact | bug-hunt | cve-log | ctf");
    term.writeln("         nmap -sV portfolio.local | wireshark --read auth_spike.pcap");
    term.writeln("         ls projects | cat cv.txt | contact | clear");
  } else if (cmd === "whoami") {
    term.writeln(`\x1b[32m${profile.name}\x1b[0m`);
    term.writeln("Role  : Software Engineer · Web · Cybersecurity");
    term.writeln(`Status: ${profile.availability}`);
  } else if (cmd === "bug-hunt") {
    const { totalFindings, severities, platforms, hallOfFame } = profile.bugBounty;
    term.writeln(`\x1b[32mBug Bounty — ${totalFindings} findings\x1b[0m`);
    term.writeln(`Platforms : ${platforms.join(", ")}`);
    term.writeln(`  Critical: \x1b[31m${severities.critical}\x1b[0m`);
    term.writeln(`  High    : \x1b[33m${severities.high}\x1b[0m`);
    term.writeln(`  Medium  : \x1b[33m${severities.medium}\x1b[0m`);
    term.writeln(`  Low     : \x1b[34m${severities.low}\x1b[0m`);
    term.writeln(`Hall of Fame: ${hallOfFame.join(", ")}`);
  } else if (cmd === "cve-log") {
    term.writeln("\x1b[32mCVE / Disclosure Log:\x1b[0m");
    cveLog.slice(0, 5).forEach((c) => {
      const label = c.cve ?? "responsible-disclosure";
      const sev = c.severity === "critical" ? `\x1b[31m${c.severity}\x1b[0m`
        : c.severity === "high" ? `\x1b[33m${c.severity}\x1b[0m`
        : `\x1b[34m${c.severity}\x1b[0m`;
      term.writeln(`  [${sev}] ${label} — ${c.software} (${c.status})`);
    });
  } else if (cmd === "ctf") {
    const { htbRank, thmRank, solved, badges } = profile.ctf;
    term.writeln("\x1b[32mCTF Activity\x1b[0m");
    term.writeln(`  HackTheBox : rank ${htbRank}`);
    term.writeln(`  TryHackMe  : rank ${thmRank}`);
    term.writeln(`  Solved     : ${solved} challenges`);
    term.writeln(`  Badges     : ${badges}`);
  } else if (cmd === "stack") {
    term.writeln("Dev  : Angular, TypeScript, NestJS, Node.js, PostgreSQL, Next.js, React");
    term.writeln("Cyber: Burp Suite, Nmap, Metasploit, Wireshark, Kali Linux, SIEM");
  } else if (cmd === "impact") {
    term.writeln("\x1b[32mCareer highlights\x1b[0m");
    term.writeln(`  ${profile.bugBounty.totalFindings} security findings reported`);
    term.writeln(`  ${profile.ctf.solved} CTF challenges solved`);
    term.writeln("  60% latency reduction on core API flows");
    term.writeln("  8+ production services shipped end-to-end");
    term.writeln("  500+ CI/CD pipeline runs automated");
  } else if (cmd === "nmap" && parts.includes("-sV")) {
    term.writeln("\x1b[32mStarting Nmap 7.94 (simulated)\x1b[0m");
    term.writeln("Host: portfolio.local (10.10.30.21)");
    term.writeln("PORT     STATE SERVICE  VERSION");
    term.writeln("22/tcp   open  ssh      OpenSSH 9.2");
    term.writeln("80/tcp   open  http     nginx 1.24");
    term.writeln("443/tcp  open  https    TLS 1.3");
    term.writeln("3000/tcp open  node     portfolio app");
    term.writeln("\x1b[32mNo critical exposures in baseline scan.\x1b[0m");
  } else if (cmd === "wireshark") {
    term.writeln("Wireshark: auth_spike.pcap");
    term.writeln("Filter: tcp.port == 443 && ip.addr == 10.0.4.12");
    term.writeln("  1,284 TLS packets · 52 failed auth events in 4 min");
    term.writeln("  Pattern: \x1b[31mautomated credential stuffing\x1b[0m");
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
    term.writeln("\x1b[32mPortfolio shell\x1b[0m — type \x1b[32mhelp\x1b[0m to explore");
  } else if (line.trim()) {
    term.writeln(`\x1b[31mcommand not found:\x1b[0m ${line.trim()} — try '\x1b[32mhelp\x1b[0m'`);
  }
  term.write("\r\n\x1b[32m$\x1b[0m ");
}

export function CyberDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitRef = useRef<XTermFitAddon | null>(null);
  const counterRef = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const now = new Date();
    return LIVE_EVENTS.slice(0, 5).map((e, i) => ({
      id: i,
      tag: e.tag,
      text: e.text,
      ts: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds() + i * 3).padStart(2, "0")}`,
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

    const init = async () => {
      await import("xterm/css/xterm.css");
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("xterm"),
        import("xterm-addon-fit"),
      ]);
      if (cancelled || !el.isConnected) return;

      term = new Terminal({
        theme: {
          background: "#0a1a14",
          foreground: "#16A34A",
          cursor: "#16A34A",
          selectionBackground: "#16A34A44",
          black: "#0a1a14",
          green: "#16A34A",
          brightGreen: "#4ADE80",
        },
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 12,
        lineHeight: 1.5,
        cursorBlink: true,
        cursorStyle: "block",
      });
      const fit = new FitAddon();
      fitRef.current = fit;
      term.loadAddon(fit);
      term.open(el);
      termRef.current = term;

      requestAnimationFrame(() => { safeFit(); setTermReady(true); });

      term.writeln("\x1b[32m┌─────────────────────────────────────────┐\x1b[0m");
      term.writeln("\x1b[32m│  EMK Portfolio Shell  v1.0               │\x1b[0m");
      term.writeln("\x1b[32m│  type \x1b[0mhelp\x1b[32m to see available commands      │\x1b[0m");
      term.writeln("\x1b[32m└─────────────────────────────────────────┘\x1b[0m");
      term.write("\r\n\x1b[32m$\x1b[0m ");

      // Auto-demo: type `whoami` after a short pause
      window.setTimeout(async () => {
        if (cancelled || !termRef.current) return;
        await typeLine(termRef.current, "whoami", 60);
        await runCmd(termRef.current, "whoami");
      }, 1200);

      let buf = "";
      term.onData((d: string) => {
        if (!termRef.current) return;
        if (d === "\r") {
          termRef.current.write("\r\n");
          void runCmd(termRef.current, buf);
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

    const logTimer = window.setInterval(() => {
      counterRef.current += 1;
      const idx = counterRef.current % LIVE_EVENTS.length;
      const ev = LIVE_EVENTS[idx]!;
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLogs((prev) => [...prev.slice(-12), { id: counterRef.current, tag: ev.tag, text: ev.text, ts }]);
    }, 2800);

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

  const injectCmd = (cmd: string) => {
    const term = termRef.current;
    if (!term) return;
    term.write("\r\n");
    void (async () => {
      await typeLine(term, cmd, 40);
      await runCmd(term, cmd);
    })();
  };

  return (
    <div ref={rootRef} className="grid gap-0 lg:grid-cols-[1fr_320px]">
      {/* ── Terminal ── */}
      <div className="flex flex-col border-r border-highlight/10">
        {/* Titlebar */}
        <div className="flex items-center gap-2 border-b border-highlight/10 bg-bg/60 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="ml-3 font-mono text-[11px] text-highlight/50">portfolio-shell — bash</span>
          {termReady && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/70" />
              connected
            </span>
          )}
        </div>

        {/* xterm mount */}
        <div
          ref={wrapRef}
          className="h-72 w-full flex-1 overflow-hidden lg:h-80"
        />

        {/* Command palette strip */}
        <div className="border-t border-highlight/10 bg-bg/40 px-4 py-3">
          <p className="mb-2 font-mono text-[10px] text-highlight/40 uppercase tracking-widest">Click to run</p>
          <div className="flex flex-wrap gap-1.5">
            {commandExamples.map((c) => (
              <button
                key={c.cmd}
                type="button"
                onClick={() => injectCmd(c.cmd)}
                className="group flex items-center gap-1.5 rounded border border-highlight/15 bg-surface/20 px-2.5 py-1 font-mono text-[11px] text-highlight/70 transition-colors hover:border-accent/40 hover:bg-surface/40 hover:text-accent"
              >
                <span className="text-accent/50 group-hover:text-accent">$</span>
                {c.cmd}
                <span className="text-[9px] text-highlight/35 group-hover:text-accent/50">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Feed ── */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 border-b border-highlight/10 bg-bg/60 px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/70" />
          <span className="font-mono text-[11px] text-highlight/50">Live security feed</span>
        </div>
        <div className="flex-1 space-y-0 overflow-y-auto px-4 py-3">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex items-start gap-2 border-b border-highlight/5 py-1.5 font-mono text-[10px] leading-snug"
            >
              <span className="shrink-0 text-highlight/30">{l.ts}</span>
              <span
                className="shrink-0 rounded px-1 text-[9px] uppercase"
                style={{ color: TAG_COLORS[l.tag] ?? "#16A34A", background: `${TAG_COLORS[l.tag] ?? "#16A34A"}18` }}
              >
                {l.tag}
              </span>
              <span className="text-highlight/65">{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
