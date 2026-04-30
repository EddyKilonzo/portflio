"use client";

import { ACCENT_PRESETS, useTheme } from "@/context/ThemeContext";
import { FocusTrap } from "focus-trap-react";
import { useEffect } from "react";
import { emitToast } from "@/lib/toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsPanel({ open, onClose }: Props) {
  const {
    themeMode,
    setThemeMode,
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
    themePack,
    setThemePack,
    motionLevel,
    setMotionLevel,
    cursorAccent,
    setCursorAccent,
    ambientFx,
    setAmbientFx,
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
          className="glass-card w-full max-w-md rounded-2xl p-6 shadow-glass max-h-[85vh] overflow-y-auto"
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
              <div className="mb-2 grid grid-cols-3 gap-2">
                {[
                  { id: "system", label: "System" },
                  { id: "dark", label: "Dark" },
                  { id: "light", label: "Light" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setThemeMode(mode.id as "light" | "dark" | "system");
                      emitToast("Theme preference saved", "success");
                    }}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      themeMode === mode.id
                        ? "border-accent bg-surface/30 text-accent"
                        : "border-highlight/20 text-highlight/70 hover:border-highlight/40 hover:text-highlight"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 font-mono text-[10px] text-highlight/40">
                Supports system defaults with remembered preference and smooth transition.
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
                    onClick={() => {
                      setAccentPreset(p.id);
                      emitToast("Preference saved", "success");
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                      accentPreset === p.id
                        ? "bg-surface/30 text-highlight"
                        : "border-highlight/20 text-highlight/70 hover:text-highlight"
                    }`}
                    style={{ borderColor: p.value, opacity: accentPreset === p.id ? 1 : 0.6 }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.value }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Theme pack</p>
              <div className="flex gap-2">
                {[
                  { id: "classic", label: "Classic Terminal" },
                  { id: "neon", label: "Neon" },
                  { id: "minimal", label: "Minimalist" },
                ].map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => {
                      setThemePack(pack.id as "classic" | "neon" | "minimal");
                      emitToast("Preference saved", "success");
                    }}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      themePack === pack.id
                        ? "border-accent bg-surface/30 text-accent"
                        : "border-highlight/20 text-highlight/70 hover:border-highlight/40 hover:text-highlight"
                    }`}
                  >
                    {pack.label}
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
                    onClick={() => {
                      setVisualMode(mode.id as "default" | "neon");
                      emitToast("Preference saved", "success");
                    }}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      visualMode === mode.id
                        ? "border-accent bg-surface/30 text-accent"
                        : "border-highlight/20 text-highlight/70 hover:border-highlight/40 hover:text-highlight"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Motion profile</p>
              <div className="flex gap-2">
                {[
                  { id: "full", label: "Full" },
                  { id: "balanced", label: "Balanced" },
                  { id: "minimal", label: "Minimal" },
                ].map((motion) => (
                  <button
                    key={motion.id}
                    type="button"
                    onClick={() => {
                      setMotionLevel(motion.id as "full" | "balanced" | "minimal");
                      emitToast("Preference saved", "success");
                    }}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      motionLevel === motion.id
                        ? "border-accent bg-surface/30 text-accent"
                        : "border-highlight/20 text-highlight/70 hover:border-highlight/40 hover:text-highlight"
                    }`}
                  >
                    {motion.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">A11y quick toggles</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    setHighContrast(!highContrast);
                    emitToast("Preference saved", "success");
                  }}
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
                  onClick={() => {
                    setReducedMotionAssist(!reducedMotionAssist);
                    emitToast("Preference saved", "success");
                  }}
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
                  onClick={() => {
                    setLargeText(!largeText);
                    emitToast("Preference saved", "success");
                  }}
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
            <div>
              <p className="mb-2 font-mono text-xs text-highlight/60">Interface accents</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setAmbientFx(!ambientFx);
                    emitToast("Preference saved", "success");
                  }}
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    ambientFx
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  Background FX {ambientFx ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCursorAccent(!cursorAccent);
                    emitToast("Preference saved", "success");
                  }}
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    cursorAccent
                      ? "border-accent bg-surface/30 text-accent"
                      : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  Cursor accent {cursorAccent ? "ON" : "OFF"}
                </button>
              </div>
              <p className="mt-1 font-mono text-[10px] text-highlight/45">
                Subtle visuals can be disabled anytime; reduced-motion still takes priority.
              </p>
            </div>

            <div className="border-t border-highlight/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  setThemeMode("system");
                  setAccentPreset("forest");
                  setThemePack("classic");
                  setVisualMode("default");
                  setMotionLevel("balanced");
                  setHighContrast(false);
                  setReducedMotionAssist(false);
                  setLargeText(false);
                  setCursorAccent(true);
                  setAmbientFx(true);
                  emitToast("Settings reset to defaults", "success");
                }}
                className="w-full rounded-lg border border-highlight/20 px-3 py-2 font-mono text-xs text-highlight/60 transition-colors hover:border-highlight/40 hover:text-highlight"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
