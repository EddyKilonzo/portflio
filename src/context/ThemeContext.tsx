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
const THEME_MODE_STORAGE = "portfolio-theme-mode-v1";
const ACCENT_STORAGE = "portfolio-accent-preset-v1";
const MODE_STORAGE = "portfolio-visual-mode-v1";
const CONTRAST_STORAGE = "portfolio-high-contrast-v1";
const MOTION_STORAGE = "portfolio-reduced-motion-assist-v1";
const LARGE_TEXT_STORAGE = "portfolio-large-text-v1";
const THEME_PACK_STORAGE = "portfolio-theme-pack-v1";
const MOTION_LEVEL_STORAGE = "portfolio-motion-level-v1";
const CURSOR_ACCENT_STORAGE = "portfolio-cursor-accent-v1";
const AMBIENT_FX_STORAGE = "portfolio-ambient-fx-v1";

export const ACCENT_PRESETS = [
  { id: "forest",      label: "Forest",      value: "#A8D9B8", rgb: "168 217 184" },
  { id: "cyber",       label: "Cyber",       value: "#FF4C4C", rgb: "255 76 76"   },
  { id: "engineering", label: "Engineering", value: "#4C9EFF", rgb: "76 158 255"  },
  { id: "violet",      label: "Violet",      value: "#B794F6", rgb: "183 148 246" },
  { id: "amber",       label: "Amber",       value: "#F6E05E", rgb: "246 224 94"  },
] as const;

export type ThemeWipe = { id: number; toLight: boolean };

type ThemeCtx = {
  light: boolean;
  toggleLight: () => void;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (mode: "light" | "dark" | "system") => void;
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
  themePack: "classic" | "neon" | "minimal";
  setThemePack: (pack: "classic" | "neon" | "minimal") => void;
  motionLevel: "full" | "balanced" | "minimal";
  setMotionLevel: (level: "full" | "balanced" | "minimal") => void;
  cursorAccent: boolean;
  setCursorAccent: (enabled: boolean) => void;
  ambientFx: boolean;
  setAmbientFx: (enabled: boolean) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<"light" | "dark" | "system">("system");
  const [light, setLight] = useState(false);
  const [accentPreset, setAccentPresetState] = useState<string>("forest");
  const [hydrated, setHydrated] = useState(false);
  const [wipe, setWipe] = useState<ThemeWipe | null>(null);
  const [visualMode, setVisualModeState] = useState<"default" | "neon">("default");
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotionAssist, setReducedMotionAssistState] = useState(false);
  const [largeText, setLargeTextState] = useState(false);
  const [themePack, setThemePackState] = useState<"classic" | "neon" | "minimal">("classic");
  const [motionLevel, setMotionLevelState] = useState<"full" | "balanced" | "minimal">("balanced");
  const [cursorAccent, setCursorAccentState] = useState(true);
  const [ambientFx, setAmbientFxState] = useState(true);
  const wipeIdRef = useRef(0);
  const pendingModeRef = useRef<"light" | "dark" | "system">("dark");

  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(THEME_MODE_STORAGE);
      const t = localStorage.getItem(STORAGE);
      const a = localStorage.getItem(ACCENT_STORAGE);
      const m = localStorage.getItem(MODE_STORAGE);
      const hc = localStorage.getItem(CONTRAST_STORAGE);
      const rm = localStorage.getItem(MOTION_STORAGE);
      const lt = localStorage.getItem(LARGE_TEXT_STORAGE);
      const tp = localStorage.getItem(THEME_PACK_STORAGE);
      const ml = localStorage.getItem(MOTION_LEVEL_STORAGE);
      const ca = localStorage.getItem(CURSOR_ACCENT_STORAGE);
      const af = localStorage.getItem(AMBIENT_FX_STORAGE);
      if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
        setThemeModeState(storedMode);
      } else if (t === "light" || t === "dark") {
        setThemeModeState(t);
      }
      if (a) setAccentPresetState(a);
      if (m === "neon") setVisualModeState("neon");
      if (hc === "true") setHighContrastState(true);
      if (rm === "true") setReducedMotionAssistState(true);
      if (lt === "true") setLargeTextState(true);
      if (tp === "classic" || tp === "neon" || tp === "minimal") setThemePackState(tp);
      if (ml === "full" || ml === "balanced" || ml === "minimal") setMotionLevelState(ml);
      if (ca === "false") setCursorAccentState(false);
      if (af === "false") setAmbientFxState(false);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const nextLight = themeMode === "system" ? media.matches : themeMode === "light";
    setLight(nextLight);
    document.documentElement.classList.toggle("light", nextLight);
    document.documentElement.classList.toggle("theme-system", themeMode === "system");
    try {
      localStorage.setItem(THEME_MODE_STORAGE, themeMode);
      localStorage.setItem(STORAGE, nextLight ? "light" : "dark");
    } catch {
      /* ignore */
    }
  }, [themeMode, hydrated]);

  useEffect(() => {
    if (!hydrated || themeMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const nextLight = media.matches;
      setLight(nextLight);
      document.documentElement.classList.toggle("light", nextLight);
    };
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [themeMode, hydrated]);

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
    document.documentElement.classList.toggle("pack-classic", themePack === "classic");
    document.documentElement.classList.toggle("pack-neon", themePack === "neon");
    document.documentElement.classList.toggle("pack-minimal", themePack === "minimal");
    try {
      localStorage.setItem(THEME_PACK_STORAGE, themePack);
    } catch {
      /* ignore */
    }
  }, [themePack, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("motion-full", motionLevel === "full");
    document.documentElement.classList.toggle("motion-balanced", motionLevel === "balanced");
    document.documentElement.classList.toggle("motion-minimal", motionLevel === "minimal");
    try {
      localStorage.setItem(MOTION_LEVEL_STORAGE, motionLevel);
    } catch {
      /* ignore */
    }
  }, [motionLevel, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("cursor-accent-off", !cursorAccent);
    try {
      localStorage.setItem(CURSOR_ACCENT_STORAGE, String(cursorAccent));
    } catch {
      /* ignore */
    }
  }, [cursorAccent, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("ambient-fx-off", !ambientFx);
    try {
      localStorage.setItem(AMBIENT_FX_STORAGE, String(ambientFx));
    } catch {
      /* ignore */
    }
  }, [ambientFx, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const el = document.documentElement;
    // Neon visual mode overrides accent — apply neon colors inline so they win over CSS classes
    if (visualMode === "neon" || themePack === "neon") {
      el.style.setProperty("--highlight", "#9fd6ff");
      el.style.setProperty("--accent", "#3be7ff");
      el.style.setProperty("--rgb-highlight", "159 214 255");
      el.style.setProperty("--rgb-accent", "59 231 255");
    } else {
      const preset = ACCENT_PRESETS.find((p) => p.id === accentPreset);
      if (preset) {
        el.style.setProperty("--highlight", preset.value);
        el.style.setProperty("--accent", preset.value);
        el.style.setProperty("--rgb-highlight", preset.rgb);
        el.style.setProperty("--rgb-accent", preset.rgb);
      }
    }
    try {
      localStorage.setItem(ACCENT_STORAGE, accentPreset);
    } catch {
      /* ignore */
    }
  }, [accentPreset, hydrated, visualMode, themePack]);

  const toggleLight = useCallback(() => {
    const nextLight = !light;
    pendingModeRef.current = nextLight ? "light" : "dark";
    document.documentElement.classList.add("theme-wiping");
    wipeIdRef.current += 1;
    setWipe({ id: wipeIdRef.current, toLight: nextLight });
  }, [light]);

  const commitLight = useCallback((next: boolean) => {
    setLight(next);
    setThemeModeState(pendingModeRef.current !== "system" ? (next ? "light" : "dark") : "system");
  }, []);

  const clearWipe = useCallback(() => {
    setWipe(null);
    document.documentElement.classList.remove("theme-wiping");
  }, []);

  const setThemeMode = useCallback((mode: "light" | "dark" | "system") => {
    pendingModeRef.current = mode;
    if (mode === "system") {
      const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (systemLight !== light) {
        document.documentElement.classList.add("theme-wiping");
        wipeIdRef.current += 1;
        setWipe({ id: wipeIdRef.current, toLight: systemLight });
      } else {
        setThemeModeState(mode);
      }
      return;
    }
    document.documentElement.classList.add("theme-wiping");
    wipeIdRef.current += 1;
    setWipe({ id: wipeIdRef.current, toLight: mode === "light" });
  }, [light]);

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
  const setThemePack = useCallback((pack: "classic" | "neon" | "minimal") => {
    setThemePackState(pack);
  }, []);
  const setMotionLevel = useCallback((level: "full" | "balanced" | "minimal") => {
    setMotionLevelState(level);
  }, []);
  const setCursorAccent = useCallback((enabled: boolean) => {
    setCursorAccentState(enabled);
  }, []);
  const setAmbientFx = useCallback((enabled: boolean) => {
    setAmbientFxState(enabled);
  }, []);

  const value = useMemo(
    () => ({
      light,
      toggleLight,
      themeMode,
      setThemeMode,
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
      themePack,
      setThemePack,
      motionLevel,
      setMotionLevel,
      cursorAccent,
      setCursorAccent,
      ambientFx,
      setAmbientFx,
    }),
    [
      light,
      toggleLight,
      themeMode,
      setThemeMode,
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
      themePack,
      setThemePack,
      motionLevel,
      setMotionLevel,
      cursorAccent,
      setCursorAccent,
      ambientFx,
      setAmbientFx,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme inside ThemeProvider");
  return v;
}
