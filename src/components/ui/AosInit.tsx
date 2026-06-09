"use client";

import AOS from "aos";
import { useEffect } from "react";

export function AosInit() {
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-out-quart", once: true, offset: 80 });
  }, []);
  return null;
}
