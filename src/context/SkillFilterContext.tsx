"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type Ctx = {
  activeSkill: string | null;
  setActiveSkill: (s: string | null) => void;
};

const SkillCtx = createContext<Ctx | null>(null);

export function SkillFilterProvider({ children }: { children: React.ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const value = useMemo(
    () => ({ activeSkill, setActiveSkill }),
    [activeSkill],
  );
  return <SkillCtx.Provider value={value}>{children}</SkillCtx.Provider>;
}

export function useSkillFilter() {
  const v = useContext(SkillCtx);
  if (!v) throw new Error("useSkillFilter inside SkillFilterProvider");
  return v;
}
