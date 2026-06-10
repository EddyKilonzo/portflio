"use client";

/**
 * Decorative background — segmented home-lab network topology.
 * Shows the redesigned architecture: Internet → Firewall → Router → 4 VLAN zones.
 * Very low opacity so it remains a texture, not a diagram.
 */
export function DecorNetwork({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 260"
      preserveAspectRatio="xMidYMid slice"
      opacity="0.10"
    >
      <defs>
        <linearGradient id="ng-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7A5A" />
          <stop offset="100%" stopColor="#A8D9B8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="ng-lab" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8D9B8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2E7A5A" stopOpacity="0.6" />
        </linearGradient>
        <marker id="ng-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#2E7A5A" opacity="0.6" />
        </marker>
      </defs>

      {/* ── Backbone connections ─────────────────────────────────────────── */}
      {/* Internet → Firewall */}
      <line x1="210" y1="38" x2="210" y2="68"
        stroke="url(#ng-edge)" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ng-arrow)" />

      {/* Firewall → Router */}
      <line x1="210" y1="90" x2="210" y2="120"
        stroke="url(#ng-edge)" strokeWidth="1.2" markerEnd="url(#ng-arrow)" />

      {/* Router → VLAN 10 */}
      <line x1="210" y1="138" x2="72" y2="188"
        stroke="url(#ng-edge)" strokeWidth="0.9" markerEnd="url(#ng-arrow)" />

      {/* Router → VLAN 20 */}
      <line x1="210" y1="138" x2="154" y2="188"
        stroke="url(#ng-edge)" strokeWidth="0.9" markerEnd="url(#ng-arrow)" />

      {/* Router → VLAN 30 */}
      <line x1="210" y1="138" x2="267" y2="188"
        stroke="url(#ng-edge)" strokeWidth="0.9" markerEnd="url(#ng-arrow)" />

      {/* Router → VLAN 40 (dashed — isolated pentest zone) */}
      <line x1="210" y1="138" x2="350" y2="188"
        stroke="url(#ng-lab)" strokeWidth="0.9" strokeDasharray="3 2" markerEnd="url(#ng-arrow)" />

      {/* Attack traffic within VLAN 40 (Kali ↔ Target) */}
      <line x1="332" y1="218" x2="368" y2="218"
        stroke="#A8D9B8" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />

      {/* SIEM monitors VLAN 40 via permitted log-only path */}
      <line x1="267" y1="204" x2="347" y2="204"
        stroke="#2E7A5A" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4" />

      {/* ── Nodes ────────────────────────────────────────────────────────── */}

      {/* Internet */}
      <ellipse cx="210" cy="26" rx="34" ry="11"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="210" y="29" textAnchor="middle" fontSize="7"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        Internet
      </text>

      {/* Firewall */}
      <rect x="186" y="70" width="48" height="18" rx="2"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="210" y="82" textAnchor="middle" fontSize="7"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        Firewall
      </text>

      {/* Core Router */}
      <circle cx="210" cy="130" r="12"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="210" y="127" textAnchor="middle" fontSize="6"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        Router
      </text>
      <text x="210" y="136" textAnchor="middle" fontSize="5.5"
        fontFamily="monospace" fill="#2E7A5A" opacity="0.6">
        .100.1
      </text>

      {/* VLAN 10 — Internal */}
      <rect x="36" y="190" width="72" height="28" rx="2"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="72" y="202" textAnchor="middle" fontSize="6.5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        VLAN 10
      </text>
      <text x="72" y="213" textAnchor="middle" fontSize="5.5"
        fontFamily="monospace" fill="#2E7A5A" opacity="0.55">
        Internal
      </text>

      {/* VLAN 20 — DMZ */}
      <rect x="120" y="190" width="68" height="28" rx="2"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="154" y="202" textAnchor="middle" fontSize="6.5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        VLAN 20
      </text>
      <text x="154" y="213" textAnchor="middle" fontSize="5.5"
        fontFamily="monospace" fill="#2E7A5A" opacity="0.55">
        DMZ
      </text>

      {/* VLAN 30 — SIEM / Mgmt */}
      <rect x="232" y="190" width="70" height="28" rx="2"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.5" />
      <text x="267" y="202" textAnchor="middle" fontSize="6.5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.7">
        VLAN 30
      </text>
      <text x="267" y="213" textAnchor="middle" fontSize="5.5"
        fontFamily="monospace" fill="#2E7A5A" opacity="0.55">
        SIEM / Mgmt
      </text>

      {/* VLAN 40 — Pentest Lab (dashed border = isolated) */}
      <rect x="314" y="190" width="72" height="28" rx="2"
        fill="none" stroke="#A8D9B8" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 2" />
      <text x="350" y="202" textAnchor="middle" fontSize="6.5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.6">
        VLAN 40
      </text>
      <text x="350" y="213" textAnchor="middle" fontSize="5.5"
        fontFamily="monospace" fill="#2E7A5A" opacity="0.5">
        Pentest Lab
      </text>

      {/* Kali + Target nodes inside VLAN 40 */}
      <circle cx="334" cy="224" r="3" fill="#A8D9B8" opacity="0.25" />
      <circle cx="368" cy="224" r="3" fill="#A8D9B8" opacity="0.25" />
      <text x="334" y="234" textAnchor="middle" fontSize="5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.35">
        Kali
      </text>
      <text x="368" y="234" textAnchor="middle" fontSize="5"
        fontFamily="monospace" fill="#A8D9B8" opacity="0.35">
        Target
      </text>

      {/* Scattered ambient nodes to fill wide section backgrounds */}
      <circle cx="40"  cy="60"  r="2.5" fill="#A8D9B8" opacity="0.18" />
      <circle cx="380" cy="80"  r="2.5" fill="#A8D9B8" opacity="0.18" />
      <circle cx="20"  cy="160" r="2"   fill="#A8D9B8" opacity="0.14" />
      <circle cx="400" cy="150" r="2"   fill="#A8D9B8" opacity="0.14" />
      <circle cx="80"  cy="250" r="2"   fill="#A8D9B8" opacity="0.12" />
      <line x1="20"  y1="160" x2="40"  y2="60"  stroke="#2E7A5A" strokeWidth="0.4" opacity="0.12" />
      <line x1="380" y1="80"  x2="400" y2="150" stroke="#2E7A5A" strokeWidth="0.4" opacity="0.12" />
    </svg>
  );
}
