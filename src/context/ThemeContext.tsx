"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE = "portfolio-theme-v1";
const ACCENT_STORAGE = "portfolio-accent-preset-v1";
const MODE_STORAGE = "portfolio-visual-mode-v1";
const CONTRAST_STORAGE = "portfolio-high-contrast-v1";
const MOTION_STORAGE = "portfolio-reduced-motion-assist-v1";
const LARGE_TEXT_STORAGE = "portfolio-large-text-v1";

export const ACCENT_PRESETS = [
  { id: "forest", label: "Forest", value: "#A8D9B8" },
  { id: "cyber", label: "Cyber", value: "#FF4C4C" },
  { id: "engineering", label: "Engineering", value: "#4C9EFF" },
  { id: "violet", label: "Violet", value: "#B794F6" },
  { id: "amber", label: "Amber", value: "#F6E05E" },
] as const;

export type ThemeWipe = { id: number; toLight: boolean };

type ThemeCtx = {
  light: boolean;
  toggleLight: () => void;
  accentPreset: string;
  setAccentPreset: (id: string) => void;
  /** Active theme wipe (consumed by ThemeWipeOverlay). */
  wipe: ThemeWipe | null;
  commitLight: (next: boolean) => void;
  clearWipe: () => void;
  visualMode: "default" | "neon";
  setVisualMode: (mode: "default" | "neon") => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotionAssist: boolean;
  setReducedMotionAssist: (enabled: boolean) => void;
  largeText: boolean;
  setLargeText: (enabled: boolean) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(true);
  const [accentPreset, setAccentPresetState] = useState<string>("forest");
  const [hydrated, setHydrated] = useState(false);
  const [wipe, setWipe] = useState<ThemeWipe | null>(null);
  const [visualMode, setVisualModeState] = useState<"default" | "neon">("default");
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotionAssist, setReducedMotionAssistState] = useState(false);
  const [largeText, setLargeTextState] = useState(false);
  const wipeIdRef = useRef(0);

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE);
      const a = localStorage.getItem(ACCENT_STORAGE);
      const m = localStorage.getItem(MODE_STORAGE);
      const hc = localStorage.getItem(CONTRAST_STORAGE);
      const rm = localStorage.getItem(MOTION_STORAGE);
      const lt = localStorage.getItem(LARGE_TEXT_STORAGE);
      if (t === "light") setLight(true);
      if (a) setAccentPresetState(a);
      if (m === "neon") setVisualModeState("neon");
      if (hc === "true") setHighContrastState(true);
      if (rm === "true") setReducedMotionAssistState(true);
      if (lt === "true") setLargeTextState(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("light", light);
    try {
      localStorage.setItem(STORAGE, light ? "light" : "dark");
    } catch {
      /* ignore */
    }
  }, [light, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("mode-neon", visualMode === "neon");
    try {
      localStorage.setItem(MODE_STORAGE, visualMode);
    } catch {
      /* ignore */
    }
  }, [visualMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("mode-high-contrast", highContrast);
    try {
      localStorage.setItem(CONTRAST_STORAGE, String(highContrast));
    } catch {
      /* ignore */
    }
  }, [highContrast, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("mode-reduced-motion", reducedMotionAssist);
    try {
      localStorage.setItem(MOTION_STORAGE, String(reducedMotionAssist));
    } catch {
      /* ignore */
    }
  }, [reducedMotionAssist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("mode-large-text", largeText);
    try {
      localStorage.setItem(LARGE_TEXT_STORAGE, String(largeText));
    } catch {
      /* ignore */
    }
  }, [largeText, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const preset = ACCENT_PRESETS.find((p) => p.id === accentPreset);
    if (preset) {
      document.documentElement.style.setProperty("--highlight", preset.value);
      document.documentElement.style.setProperty("--accent", preset.value);
    }
    try {
      localStorage.setItem(ACCENT_STORAGE, accentPreset);
    } catch {
      /* ignore */
    }
  }, [accentPreset, hydrated]);

  const toggleLight = useCallback(() => {
    wipeIdRef.current += 1;
    setWipe({ id: wipeIdRef.current, toLight: !light });
  }, [light]);

  const commitLight = useCallback((next: boolean) => {
    setLight(next);
  }, []);

  const clearWipe = useCallback(() => setWipe(null), []);

  const setAccentPreset = useCallback((id: string) => {
    setAccentPresetState(id);
  }, []);
  const setVisualMode = useCallback((mode: "default" | "neon") => {
    setVisualModeState(mode);
  }, []);
  const setHighContrast = useCallback((enabled: boolean) => {
    setHighContrastState(enabled);
  }, []);
  const setReducedMotionAssist = useCallback((enabled: boolean) => {
    setReducedMotionAssistState(enabled);
  }, []);
  const setLargeText = useCallback((enabled: boolean) => {
    setLargeTextState(enabled);
  }, []);

  const value = useMemo(
    () => ({
      light,
      toggleLight,
      accentPreset,
      setAccentPreset,
      wipe,
      commitLight,
      clearWipe,
      visualMode,
      setVisualMode,
      highContrast,
      setHighContrast,
      reducedMotionAssist,
      setReducedMotionAssist,
      largeText,
      setLargeText,
    }),
    [
      light,
      toggleLight,
      accentPreset,
      setAccentPreset,
      wipe,
      commitLight,
      clearWipe,
      visualMode,
      setVisualMode,
      highContrast,
      setHighContrast,
      reducedMotionAssist,
      setReducedMotionAssist,
      largeText,
      setLargeText,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme inside ThemeProvider");
  return v;
}
