"use client";

import { profile } from "@/content/portfolio";
import { PacketCapture } from "@/components/demos/PacketCapture";
import { useEffect, useRef, useState } from "react";
import type { Terminal as XTerm } from "xterm";
import type { FitAddon as XTermFitAddon } from "xterm-addon-fit";

const cvSummary = `${profile.name} — detection engineering, full-stack shipping, WebGL storytelling.`;
const quickFacts = [
  "Security-first software engineer",
  "Full-stack delivery: web + backend + cloud",
  "Hands-on cybersecurity labs and reporting",
];
const commandExamples = [
  "nmap -sV portfolio.local",
  "wireshark --read auth_spike.pcap",
  "impact",
];

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
  const [logs, setLogs] = useState<string[]>([
    "[siem] correlation rule fired: auth_spike",
    "[fw] deny tcp/445 src=10.0.4.12",
  ]);
  const [termReady, setTermReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
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
      try {
        fitRef.current?.fit();
      } catch {
        // xterm-fit can throw while renderer is still syncing; ignore and retry later.
      }
    };

    const runCmd = async (line: string) => {
      const parts = line.trim().split(/\s+/);
      const cmd = parts[0]?.toLowerCase();
      if (!term) return;
      if (cmd === "help") {
        term.writeln(
          "Commands: whoami | stack | impact | nmap -sV portfolio.local | wireshark --read auth_spike.pcap | ls projects | cat cv.txt | contact | clear",
        );
      } else if (cmd === "whoami") {
        term.writeln(`${profile.name} — software engineer · web · cybersecurity`);
      } else if (cmd === "stack") {
        term.writeln("Angular, TypeScript, NestJS, Node.js, Express, PostgreSQL, Prisma");
        term.writeln("WordPress, WooCommerce, Docker, Git/GitHub, Figma, VS Code");
      } else if (cmd === "impact") {
        term.writeln("Highlights:");
        term.writeln("- 8+ services shipped");
        term.writeln("- 60% latency reduction on key flows");
        term.writeln("- 500+ CI/CD pipeline runs");
      } else if (cmd === "nmap" && parts.includes("-sV")) {
        term.writeln("Starting Nmap 7.94 ( simulated assessment )");
        term.writeln("Host: portfolio.local (10.10.30.21)");
        term.writeln("PORT    STATE SERVICE  VERSION");
        term.writeln("22/tcp  open  ssh      OpenSSH 9.2");
        term.writeln("80/tcp  open  http     nginx 1.24");
        term.writeln("443/tcp open  https    TLS 1.3 enabled");
        term.writeln("3000/tcp open  nodejs  portfolio app");
        term.writeln("Risk note: no critical exposures detected in baseline profile.");
      } else if (cmd === "wireshark") {
        term.writeln("Wireshark analysis: auth_spike.pcap");
        term.writeln("Display filter: tcp.port == 443 && ip.addr == 10.0.4.12");
        term.writeln("Findings:");
        term.writeln("- 1,284 TLS packets inspected");
        term.writeln("- Repeated failed auth pattern (52 events / 4 min)");
        term.writeln("- Source grouped to automated credential stuffing behavior");
        term.writeln("Action: alert raised, source blocked at edge firewall.");
      } else if (cmd === "ls" && parts[1] === "projects") {
        term.writeln("sentinel-siem  mesh-api  aurora-portfolio  design-system");
      } else if (cmd === "cat" && parts[1] === "cv.txt") {
        await typeLine(term, cvSummary);
      } else if (cmd === "contact") {
        term.writeln("Email: hello@eddymax.dev");
        term.writeln("LinkedIn: linkedin.com/in/eddy-kilonzo-");
        term.writeln("GitHub: github.com/EddyKilonzo");
      } else if (cmd === "clear") {
        term.clear();
        term.writeln("Portfolio shell — type help");
      } else {
        term.writeln(`command not found: ${line}`);
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
        theme: {
          background: "#0D1F1A",
          foreground: "#A8D9B8",
          cursor: "#A8D9B8",
        },
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 12,
      });
      const fit = new FitAddon();
      fitRef.current = fit;
      term.loadAddon(fit);
      term.open(el);
      termRef.current = term;

      // Delay first fit to next paint so xterm has measured viewport.
      requestAnimationFrame(() => {
        safeFit();
        setTermReady(true);
      });
      term.writeln("Portfolio shell — recruiter quick view");
      term.writeln("Type: help");
      term.write("\r\n$ ");

      let buf = "";
      term.onData((d: string) => {
        if (d === "\r") {
          term.write("\r\n");
          void runCmd(buf);
          buf = "";
        } else if (d === "\u007f") {
          if (buf.length) {
            buf = buf.slice(0, -1);
            term.write("\b \b");
          }
        } else {
          buf += d;
          term.write(d);
        }
      });

      const onResize = () => safeFit();
      window.addEventListener("resize", onResize);
      ro = new ResizeObserver(() => safeFit());
      ro.observe(el);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    };

    const logTimer = window.setInterval(() => {
      setLogs((prev) => {
        const events = [
          "[signal] production release validated",
          "[metric] p95 latency improved by 18%",
          "[security] auth policy rule verified",
          "[quality] CI checks passed on main",
        ];
        const next = [...prev, events[Math.floor(Math.random() * events.length)]];
        return next.slice(-12);
      });
    }, 2800);

    let removeResize: (() => void) | undefined;
    void init().then((cleanup) => {
      removeResize = cleanup;
    });

    return () => {
      cancelled = true;
      removeResize?.();
      ro?.disconnect();
      clearInterval(logTimer);
      fitRef.current = null;
      setTermReady(false);
      if (termRef.current) {
        termRef.current.dispose();
      }
      termRef.current = null;
    };
  }, [isVisible]);

  return (
    <div ref={rootRef} className="grid gap-4 p-6 lg:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-xs text-highlight/50">Terminal</p>
        <div
          ref={wrapRef}
          className="h-64 w-full overflow-hidden rounded-xl border border-highlight/15"
        />
        {!isVisible ? (
          <p className="mt-2 font-mono text-[10px] text-highlight/45">
            Lazy loading terminal module...
          </p>
        ) : !termReady ? (
          <p className="mt-2 font-mono text-[10px] text-highlight/45">
            Initializing terminal...
          </p>
        ) : null}
      </div>
      <div className="space-y-4 lg:col-span-1">
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Recruiter quick summary</p>
          <ul className="mt-2 space-y-1.5 font-sans text-xs text-highlight/85">
            {quickFacts.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Try these commands</p>
          <div className="mt-2 space-y-1 font-mono text-[11px] text-highlight/75">
            {commandExamples.map((c) => (
              <div key={c} className="rounded border border-highlight/15 bg-surface/20 px-2 py-1">
                $ {c}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Execution log</p>
          <div className="mt-2 max-h-24 overflow-y-auto font-mono text-[10px] text-highlight/70">
            {logs.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">SIEM metrics (fake)</p>
          <div className="mt-3 flex gap-4">
            {[72, 45, 88].map((n, i) => (
              <div key={i} className="flex-1">
                <div className="h-2 rounded-full bg-surface/40">
                  <div
                    className="h-2 rounded-full bg-surfaceMid transition-all duration-700"
                    style={{ width: `${n}%` }}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-highlight/50">
                  sig_{i}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="font-mono text-xs text-highlight/50">Attack map</p>
          <svg viewBox="0 0 200 80" className="mt-2 w-full">
            <path
              d="M20,40 Q60,10 100,40 T180,40"
              fill="none"
              stroke="#2E7A5A"
              strokeWidth="0.5"
              className="animate-pulse"
            />
            <circle cx="20" cy="40" r="2" fill="#FF4C4C" />
            <circle cx="180" cy="40" r="2" fill="#4C9EFF" />
          </svg>
        </div>
      </div>
      <div className="lg:col-span-2">
        <PacketCapture />
      </div>
    </div>
  );
}
