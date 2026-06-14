"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { RoleMode } from "@/content/portfolio";

type RoleCtx = {
  mode: RoleMode;
  setMode: (m: RoleMode) => void;
};

const Ctx = createContext<RoleCtx | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<RoleMode>("engineering");

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRole inside RoleProvider");
  return v;
}
