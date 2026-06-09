"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { RoleMode } from "@/content/portfolio";

const ACCENTS: Record<RoleMode, string> = {
  cyber: "#FF4C4C",
  engineering: "#4C9EFF",
  web: "#4C9EFF",  // web maps to developer — same accent
};

type RoleCtx = {
  mode: RoleMode;
  setMode: (m: RoleMode) => void;
  accent: string;
};

const Ctx = createContext<RoleCtx | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<RoleMode>("engineering");

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ACCENTS[mode]);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, setMode, accent: ACCENTS[mode] }),
    [mode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRole inside RoleProvider");
  return v;
}
