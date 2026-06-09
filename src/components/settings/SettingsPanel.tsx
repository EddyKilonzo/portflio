"use client";

import { ACCENT_PRESETS, useTheme } from "@/context/ThemeContext";
import { FocusTrap } from "focus-trap-react";
import { useEffect } from "react";
import { emitToast } from "@/lib/toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
        value
          ? "border-accent/40 bg-accent/8 text-highlight"
          : "border-highlight/15 text-highlight/70 hover:border-highlight/25"
      }`}
    >
      <div>
        <p className="font-mono text-xs">{label}</p>
        {description && <p className="mt-0.5 font-mono text-[10px] text-highlight/40">{description}</p>}
      </div>
      <span
        className={`ml-4 flex h-5 w-9 shrink-0 items-center rounded-full border transition-all duration-200 ${
          value ? "border-accent bg-accent/30" : "border-highlight/20 bg-surface/20"
        }`}
      >
        <span
          className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
            value ? "translate-x-4 bg-accent" : "translate-x-0.5 bg-highlight/30"
          }`}
        />
      </span>
    </button>
  );
}

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
    ambientFx,
    setAmbientFx,
  } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const save = () => emitToast("Preference saved", "success");

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
          className="glass-card w-full max-w-sm rounded-2xl p-6 shadow-glass"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-highlight">Preferences</h2>
            <button
              type="button"
              className="rounded-lg border border-highlight/15 px-3 py-1.5 font-mono text-[11px] text-highlight/60 hover:border-highlight/30 hover:text-highlight transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="space-y-6">

            {/* ── Theme ── */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent/70">Theme</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dark",  label: "Dark"  },
                  { id: "light", label: "Light" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setThemeMode(m.id as "light" | "dark"); save(); }}
                    className={`rounded-xl border py-2.5 font-mono text-xs transition-colors ${
                      themeMode === m.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-highlight/15 text-highlight/60 hover:border-highlight/30 hover:text-highlight"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Accent ── */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent/70">Accent colour</p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setAccentPreset(p.id); save(); }}
                    title={p.label}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-xs transition-all ${
                      accentPreset === p.id
                        ? "border-current bg-surface/30 text-highlight"
                        : "border-highlight/15 text-highlight/55 hover:border-highlight/30 hover:text-highlight"
                    }`}
                    style={{ borderColor: accentPreset === p.id ? p.value : undefined }}
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: p.value }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Accessibility ── */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent/70">Accessibility</p>
              <div className="space-y-2">
                <Toggle
                  label="Reduce motion"
                  description="Disables animations and transitions"
                  value={reducedMotionAssist}
                  onChange={(v) => { setReducedMotionAssist(v); save(); }}
                />
                <Toggle
                  label="High contrast"
                  description="Increases text and border contrast"
                  value={highContrast}
                  onChange={(v) => { setHighContrast(v); save(); }}
                />
                <Toggle
                  label="Large text"
                  description="Scales up base font size"
                  value={largeText}
                  onChange={(v) => { setLargeText(v); save(); }}
                />
              </div>
            </div>

            {/* ── Effects ── */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent/70">Effects</p>
              <Toggle
                label="Background effects"
                description="Animated wave and ambient layer"
                value={ambientFx}
                onChange={(v) => { setAmbientFx(v); save(); }}
              />
            </div>

            {/* ── Reset ── */}
            <button
              type="button"
              onClick={() => {
                setThemeMode("light");
                setAccentPreset("forest");
                setHighContrast(false);
                setReducedMotionAssist(false);
                setLargeText(false);
                setAmbientFx(true);
                emitToast("Reset to defaults", "success");
              }}
              className="w-full rounded-xl border border-highlight/15 py-2.5 font-mono text-xs text-highlight/50 transition-colors hover:border-highlight/30 hover:text-highlight/80"
            >
              Reset to defaults
            </button>

          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
