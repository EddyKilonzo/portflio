"use client";

import { ACCENT_PRESETS, useTheme } from "@/context/ThemeContext";
import { FocusTrap } from "focus-trap-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsPanel({ open, onClose }: Props) {
  const {
    light,
    toggleLight,
    accentPreset,
    setAccentPreset,
    visualMode,
    setVisualMode,
    highContrast,
    setHighContrast,
    reducedMotionAssist,
    setReducedMotionAssist,
    largeText,
    setLargeText,
  } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.altKey && e.key === "1") {
        e.preventDefault();
        setHighContrast(!highContrast);
      }
      if (e.altKey && e.key === "2") {
        e.preventDefault();
        setReducedMotionAssist(!reducedMotionAssist);
      }
      if (e.altKey && e.key === "3") {
        e.preventDefault();
        setLargeText(!largeText);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    open,
    onClose,
    highContrast,
    reducedMotionAssist,
    largeText,
    setHighContrast,
    setReducedMotionAssist,
    setLargeText,
  ]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-bg/80 px-4 backdrop-blur-md"
      role="presentation"
      onClick={onClose}
    >
      <FocusTrap
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          fallbackFocus: "#settings-dialog",
        }}
      >
        <div
          id="settings-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Site settings"
          className="glass-card w-full max-w-md rounded-2xl p-6 shadow-glass"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-highlight">Settings</h2>
            <button
              type="button"
              className="font-mono text-sm text-highlight/70 hover:text-highlight"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Theme</p>
              <button
                type="button"
                onClick={toggleLight}
                className="btn-ghost w-full"
              >
                {light ? "Switch to dark" : "Switch to light"}
              </button>
              <p className="mt-1 font-mono text-[10px] text-highlight/40">
                Uses a clip-path wipe on the root shell when toggling.
              </p>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">
                Accent preset
              </p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAccentPreset(p.id)}
                    className={`rounded-lg border px-3 py-1 font-mono text-xs ${
                      accentPreset === p.id
                        ? "border-accent text-accent"
                        : "border-highlight/20 text-highlight/70"
                    }`}
                    style={{ borderColor: accentPreset === p.id ? p.value : undefined }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Visual mode</p>
              <div className="flex gap-2">
                {[
                  { id: "default", label: "Default" },
                  { id: "neon", label: "Cyber Neon" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setVisualMode(mode.id as "default" | "neon")}
                    className={`rounded-lg border px-3 py-1 font-mono text-xs ${
                      visualMode === mode.id
                        ? "border-accent text-accent"
                        : "border-highlight/20 text-highlight/70"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Readability</p>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className="btn-ghost w-full"
              >
                {highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
              </button>
              <p className="mt-1 font-mono text-[10px] text-highlight/45">
                Boosts text visibility and reduces visual washout.
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">A11y quick toggles</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  title="Toggle contrast (Alt+1)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    highContrast
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="mr-1" aria-hidden>◉</span>
                  Contrast {highContrast ? "ON" : "OFF"}
                  <span className="ml-2 text-[10px] opacity-70">Alt+1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReducedMotionAssist(!reducedMotionAssist)}
                  title="Toggle motion mode (Alt+2)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    reducedMotionAssist
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="mr-1" aria-hidden>◌</span>
                  Motion {reducedMotionAssist ? "LOW" : "FULL"}
                  <span className="ml-2 text-[10px] opacity-70">Alt+2</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLargeText(!largeText)}
                  title="Toggle text size (Alt+3)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    largeText
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="mr-1" aria-hidden>Aa</span>
                  Text {largeText ? "LARGE" : "DEFAULT"}
                  <span className="ml-2 text-[10px] opacity-70">Alt+3</span>
                </button>
              </div>
              <p className="mt-1 font-mono text-[10px] text-highlight/45">
                Quick accessibility controls for readability and comfort.
              </p>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
