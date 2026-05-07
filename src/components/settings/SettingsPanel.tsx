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
      if (e.altKey && e.key === "1") { e.preventDefault(); setHighContrast(!highContrast); }
      if (e.altKey && e.key === "2") { e.preventDefault(); setReducedMotionAssist(!reducedMotionAssist); }
      if (e.altKey && e.key === "3") { e.preventDefault(); setLargeText(!largeText); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, highContrast, reducedMotionAssist, largeText, setHighContrast, setReducedMotionAssist, setLargeText]);

  if (!open) return null;

  const save = (msg = "Preference saved") => emitToast(msg, "success");

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
          className="glass-card w-full max-w-md rounded-2xl p-6 shadow-glass max-h-[88vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-highlight">Settings</h2>
              <p className="font-mono text-[10px] text-highlight/45 mt-0.5">Preferences are saved automatically</p>
            </div>
            <button
              type="button"
              className="rounded border border-highlight/15 px-2.5 py-1 font-mono text-xs text-highlight/60 hover:border-highlight/30 hover:text-highlight transition-colors"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-0">

            {/* ── Appearance ─────────────────────────── */}
            <section className="pb-5">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-highlight/50">Appearance</p>
              <p className="mb-3 font-mono text-[10px] text-highlight/40">Color scheme follows system or your preference</p>
              <div className="mb-3 grid grid-cols-3 gap-2">
                {[
                  { id: "system", label: "⊙ System" },
                  { id: "dark",   label: "☾ Dark"   },
                  { id: "light",  label: "☀ Light"  },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => { setThemeMode(mode.id as "light" | "dark" | "system"); save("Theme saved"); }}
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
              <p className="mb-2 font-mono text-[10px] text-highlight/50">Accent color</p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setAccentPreset(p.id); save(); }}
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
            </section>

            <div className="border-t border-highlight/10" />

            {/* ── Style ──────────────────────────────── */}
            <section className="py-5">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-highlight/50">Style</p>
              <p className="mb-3 font-mono text-[10px] text-highlight/40">Overall visual personality of the site</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: "classic", label: "Classic Terminal", desc: "Dark green terminal" },
                  { id: "neon",    label: "Cyber Neon",       desc: "Blue neon accents"  },
                  { id: "minimal", label: "Minimal",           desc: "Reduced chrome"     },
                ].map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => { setThemePack(pack.id as "classic" | "neon" | "minimal"); save(); }}
                    title={pack.desc}
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
            </section>

            <div className="border-t border-highlight/10" />

            {/* ── Performance ────────────────────────── */}
            <section className="py-5">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-highlight/50">Performance</p>
              <p className="mb-3 font-mono text-[10px] text-highlight/40">Controls animations and transition weight</p>
              <div className="flex gap-2">
                {[
                  { id: "full",     label: "Full"     },
                  { id: "balanced", label: "Balanced" },
                  { id: "minimal",  label: "Minimal"  },
                ].map((motion) => (
                  <button
                    key={motion.id}
                    type="button"
                    onClick={() => { setMotionLevel(motion.id as "full" | "balanced" | "minimal"); save(); }}
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
            </section>

            <div className="border-t border-highlight/10" />

            {/* ── Accessibility ──────────────────────── */}
            <section className="py-5">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-highlight/50">Accessibility</p>
              <p className="mb-3 font-mono text-[10px] text-highlight/40">Readability and comfort settings — also available via Alt+1/2/3</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => { setHighContrast(!highContrast); save(); }}
                  title="Toggle high contrast (Alt+1)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] text-left ${
                    highContrast ? "border-accent bg-surface/30 text-accent" : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="block text-[10px] text-highlight/50 mb-0.5">Alt+1</span>
                  Contrast {highContrast ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  onClick={() => { setReducedMotionAssist(!reducedMotionAssist); save(); }}
                  title="Toggle reduced motion (Alt+2)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] text-left ${
                    reducedMotionAssist ? "border-accent bg-surface/30 text-accent" : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="block text-[10px] text-highlight/50 mb-0.5">Alt+2</span>
                  Motion {reducedMotionAssist ? "LOW" : "FULL"}
                </button>
                <button
                  type="button"
                  onClick={() => { setLargeText(!largeText); save(); }}
                  title="Toggle large text (Alt+3)"
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] text-left ${
                    largeText ? "border-accent bg-surface/30 text-accent" : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  <span className="block text-[10px] text-highlight/50 mb-0.5">Alt+3</span>
                  Text {largeText ? "LARGE" : "DEFAULT"}
                </button>
              </div>
            </section>

            <div className="border-t border-highlight/10" />

            {/* ── Interface ──────────────────────────── */}
            <section className="py-5">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-highlight/50">Interface</p>
              <p className="mb-3 font-mono text-[10px] text-highlight/40">Decorative effects — reduced-motion still takes priority</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setAmbientFx(!ambientFx); save(); }}
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    ambientFx ? "border-accent bg-surface/30 text-accent" : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  Background FX {ambientFx ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  onClick={() => { setCursorAccent(!cursorAccent); save(); }}
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    cursorAccent ? "border-accent bg-surface/30 text-accent" : "border-highlight/20 text-highlight/75"
                  }`}
                >
                  Cursor accent {cursorAccent ? "ON" : "OFF"}
                </button>
              </div>
            </section>

            <div className="border-t border-highlight/10" />

            {/* ── Reset ──────────────────────────────── */}
            <div className="pt-5">
              <button
                type="button"
                onClick={() => {
                  setThemeMode("system");
                  setAccentPreset("forest");
                  setThemePack("classic");
                  setMotionLevel("balanced");
                  setHighContrast(false);
                  setReducedMotionAssist(false);
                  setLargeText(false);
                  setCursorAccent(true);
                  setAmbientFx(true);
                  save("Settings reset to defaults");
                }}
                className="w-full rounded-lg border border-highlight/20 px-3 py-2 font-mono text-xs text-highlight/60 transition-colors hover:border-highlight/40 hover:text-highlight"
              >
                Reset all to defaults
              </button>
            </div>

          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
