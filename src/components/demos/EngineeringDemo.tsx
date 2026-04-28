"use client";

import { useEffect, useState } from "react";

type Props = { variant: "api" | "algo" | "schema" };

export function EngineeringDemo({ variant }: Props) {
  const [path, setPath] = useState("/api/v1/health");
  const [body, setBody] = useState("");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const mockResponse = {
    status: "ok",
    latency_ms: 42,
    path,
    echo: body || null,
  };

  useEffect(() => {
    if (!playing || variant !== "algo") return;
    const id = window.setInterval(() => setStep((s) => s + 1), 900);
    return () => clearInterval(id);
  }, [playing, variant]);

  if (variant === "algo") {
    const steps = [
      "partition around pivot",
      "recurse left",
      "recurse right",
      "merge sorted runs",
    ];
    return (
      <div className="p-6">
        <p className="font-mono text-xs text-highlight/50">Algorithm visualizer</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <ul className="mt-6 space-y-2 font-mono text-sm">
          {steps.map((s, i) => (
            <li
              key={s}
              className={
                playing && i === step % steps.length
                  ? "text-accent"
                  : "text-highlight/60"
              }
            >
              {i + 1}. {s}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "schema") {
    return (
      <div className="p-6 font-mono text-xs text-highlight/80">
        <p className="text-highlight/50">Database schema (viewer)</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-surface/30 p-4">
{`users ||--o{ sessions : has
users {
  uuid id PK
  string email
  timestamptz created_at
}
sessions {
  uuid id PK
  uuid user_id FK
}`}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="font-mono text-xs text-highlight/50">API tester (mock)</p>
      <div className="mt-4 flex gap-2">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-1 rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight"
        />
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            setBody(JSON.stringify(mockResponse, null, 2))
          }
        >
          Send
        </button>
      </div>
      <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-surface/30 p-4 font-mono text-xs text-highlight/90">
        {body || "// response appears here"}
      </pre>
    </div>
  );
}
