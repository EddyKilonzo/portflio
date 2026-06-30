"use client";

import type { Project } from "@/content/portfolio";
import { FocusTrap } from "focus-trap-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const WebDemo = dynamic(() => import("./WebDemo").then((m) => m.WebDemo), {
  ssr: false,
  loading: () => <DemoSkeleton />,
});
const CyberDemo = dynamic(
  () => import("./CyberDemo").then((m) => m.CyberDemo),
  { ssr: false, loading: () => <DemoSkeleton /> },
);
const PacketCaptureDemo = dynamic(
  () => import("./PacketCapture").then((m) => m.PacketCapture),
  { ssr: false, loading: () => <DemoSkeleton /> },
);
const EngineeringDemo = dynamic(
  () => import("./EngineeringDemo").then((m) => m.EngineeringDemo),
  { ssr: false, loading: () => <DemoSkeleton /> },
);

function DemoSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      <div className="h-40 rounded-lg bg-surface/30" />
      <div className="h-4 w-2/3 rounded bg-surface/20" />
    </div>
  );
}

type Props = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

export function DemoHost({ project, open, onClose }: Props) {
  const [ready, setReady] = useState(false);

  useBodyScrollLock(open && Boolean(project));

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setReady(true), 400);
      return () => clearTimeout(t);
    }
    setReady(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !project) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-bg/90 px-4 backdrop-blur-md"
      role="presentation"
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          allowOutsideClick: true,
          escapeDeactivates: false,
          fallbackFocus: "#demo-dialog",
        }}
      >
        <div
          id="demo-dialog"
          role="dialog"
          aria-label={`Live demo: ${project.title}`}
          className="glass-card max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-highlight/10 px-4 py-3">
            <div>
              <h2 className="font-display text-lg text-highlight">
                {project.title}
              </h2>
              <span className="mt-1 inline-block rounded border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                Simulation
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="font-mono text-xs text-accent"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                  } catch (cause) {
                    console.warn("[DemoHost] Clipboard unavailable:", cause);
                  }
                }}
              >
                Share demo link
              </button>
              <button
                type="button"
                className="font-mono text-xs text-highlight/70"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
          <div className="max-h-[calc(92vh-4rem)] overflow-auto">
            {!ready ? (
              <DemoSkeleton />
            ) : project.demoType === "web" ? (
              <WebDemo
                url={project.liveUrl ?? "https://example.com"}
                fallbackImage={project.screenshotFallback}
              />
            ) : project.demoType === "cyber" ? (
              project.id === "network-sniffer"
                ? <PacketCaptureDemo />
                : <CyberDemo />
            ) : (
              <EngineeringDemo variant={project.engineeringDemo ?? "api"} />
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
