"use client";

import type { Project } from "@/content/portfolio";
import { animate } from "animejs";
import { FocusTrap } from "focus-trap-react";
import { useEffect, useRef } from "react";

function detectVideoKind(
  url: string,
): { kind: "youtube" | "vimeo" | "mp4"; id?: string } {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id: string | null = null;
      if (u.hostname.includes("youtu.be")) id = u.pathname.replace("/", "");
      else id = u.searchParams.get("v");
      return { kind: "youtube", id: id ?? undefined };
    }
    if (u.hostname.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      return { kind: "vimeo", id };
    }
  } catch {
    /* ignore */
  }
  return { kind: "mp4" };
}

type PlyrInstance = import("plyr").default;

type Props = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

export function VideoModal({ project, open, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const plyrRef = useRef<PlyrInstance | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !project || !mountRef.current) return;

    let cancelled = false;
    const el = mountRef.current;
    el.innerHTML = "";

    const run = async () => {
      await import(
        /* webpackChunkName: "plyr-css" */ "plyr/dist/plyr.css"
      );
      const { default: Plyr } = await import("plyr");
      if (cancelled || !mountRef.current) return;

      const url = project.videoUrl;
      const det = detectVideoKind(url);
      let player: PlyrInstance | null = null;

      if (det.kind === "youtube" && det.id) {
        const div = document.createElement("div");
        div.setAttribute("data-plyr-provider", "youtube");
        div.setAttribute("data-plyr-embed-id", det.id);
        el.appendChild(div);
        player = new Plyr(div as unknown as HTMLVideoElement, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          settings: ["speed"],
          speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
        });
      } else if (det.kind === "vimeo" && det.id) {
        const div = document.createElement("div");
        div.setAttribute("data-plyr-provider", "vimeo");
        div.setAttribute("data-plyr-embed-id", det.id);
        el.appendChild(div);
        player = new Plyr(div as unknown as HTMLVideoElement, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          settings: ["speed"],
          speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
        });
      } else {
        const video = document.createElement("video");
        video.setAttribute("playsinline", "");
        video.setAttribute("controls", "");
        video.src = url;
        el.appendChild(video);
        player = new Plyr(video, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          settings: ["speed"],
          speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
        });
      }

      plyrRef.current = player;
      try {
        void player.play();
      } catch {
        /* autoplay blocked */
      }
    };

    void run();

    return () => {
      cancelled = true;
      plyrRef.current?.destroy();
      plyrRef.current = null;
      el.innerHTML = "";
    };
  }, [open, project]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (panel) {
      animate(panel, {
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 350,
        ease: "out(4)",
      });
    }
    if (backdrop) {
      animate(backdrop, { opacity: [0, 1], duration: 250, ease: "linear" });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const p = plyrRef.current;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === " " && p) {
        e.preventDefault();
        p.togglePlay();
      }
      if (e.key.toLowerCase() === "f" && p) {
        e.preventDefault();
        p.fullscreen.toggle();
      }
      if (e.key.toLowerCase() === "m" && p) {
        e.preventDefault();
        p.muted = !p.muted;
      }
      if (e.key === "ArrowLeft" && p) {
        e.preventDefault();
        p.currentTime = Math.max(0, p.currentTime - 10);
      }
      if (e.key === "ArrowRight" && p) {
        e.preventDefault();
        p.currentTime = Math.min(p.duration, p.currentTime + 10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    const p = plyrRef.current;
    if (p) {
      p.pause();
      p.currentTime = 0;
    }
  }, [open]);

  if (!open || !project) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[10002] flex items-center justify-center px-4"
      style={{ background: "rgba(13,31,26,0.95)" }}
      role="presentation"
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          escapeDeactivates: false,
          fallbackFocus: "#video-dialog",
        }}
      >
        <div
          id="video-dialog"
          role="dialog"
          aria-label={`Video demo: ${project.title}`}
          ref={panelRef}
          className="glass-card flex max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl will-change-transform"
          style={{
            background: "rgba(30,74,58,0.2)",
            backdropFilter: "blur(24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — fixed */}
          <div className="flex shrink-0 items-center justify-between border-b border-highlight/10 px-4 py-3">
            <h2 className="truncate font-display text-base text-highlight sm:text-lg">
              {project.title}
            </h2>
            <button
              type="button"
              className="ml-3 shrink-0 font-mono text-sm text-highlight/70 hover:text-highlight"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* Scrollable body — video + info */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-3 sm:p-4">
              <div ref={mountRef} className="plyr-wrap aspect-video w-full" />
            </div>
            <div className="space-y-3 border-t border-highlight/10 px-4 py-4">
              <p className="font-sans text-sm text-highlight/80">
                {project.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-highlight/25 bg-surface/15 px-2 py-0.5 font-mono text-[10px] text-highlight/75"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pb-2 font-mono text-xs">
                {project.codeUrl ? (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline"
                  >
                    GitHub
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline"
                  >
                    Live demo
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
