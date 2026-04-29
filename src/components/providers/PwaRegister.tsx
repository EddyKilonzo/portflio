"use client";

import { useEffect, useState } from "react";
import { emitToast } from "@/lib/toast";

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js");
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      emitToast("App install available", "info");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!deferredPrompt) return null;

  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 z-[10021] rounded-full border border-accent/60 bg-bg/90 px-3 py-1 font-mono text-xs text-accent"
      onClick={async () => {
        const promptEvent = deferredPrompt as Event & { prompt?: () => Promise<void> };
        await promptEvent.prompt?.();
        setDeferredPrompt(null);
      }}
    >
      Install App
    </button>
  );
}
