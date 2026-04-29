"use client";

/**
 * Responsive iframe preview with timeout-based fallback when embeds are blocked
 * or never fire onLoad (common with X-Frame-Options / CSP).
 */
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { StateCard } from "@/components/ui/StateCard";

const frames = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

type Props = {
  url: string;
  fallbackImage?: string;
  /** If iframe does not fire load (blocked embed), show fallback after this. */
  loadTimeoutMs?: number;
};

export function WebDemo({
  url,
  fallbackImage,
  loadTimeoutMs = 4500,
}: Props) {
  const [size, setSize] = useState<keyof typeof frames>("desktop");
  const [err, setErr] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setErr(false);
    setIframeLoaded(false);
    setTimedOut(false);
  }, [url]);

  useEffect(() => {
    if (iframeLoaded || err) return;
    const t = window.setTimeout(() => setTimedOut(true), loadTimeoutMs);
    return () => clearTimeout(t);
  }, [url, iframeLoaded, err, loadTimeoutMs]);

  const showFallback = Boolean(fallbackImage) && (timedOut || err);
  const showBlocked = !fallbackImage && (timedOut || err);

  const onIframeError = useCallback(() => setErr(true), []);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(frames) as (keyof typeof frames)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSize(k)}
            className={`rounded-lg border px-3 py-1 font-mono text-xs capitalize ${
              size === k ? "border-accent text-accent" : "border-highlight/20"
            }`}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto font-mono text-xs text-accent"
          onClick={() => window.open(url, "_blank")}
        >
          Open fullscreen
        </button>
      </div>

      <div className="mx-auto rounded-2xl border-4 border-surfaceMid/40 bg-surface/20 p-3 shadow-lift">
        <div
          className="mx-auto overflow-hidden rounded-lg bg-bg"
          style={{ width: frames[size], maxWidth: "100%" }}
        >
          {showBlocked ? (
            <div className="p-4">
              <StateCard
                compact
                title="Embed unavailable"
                message="This preview could not be embedded due to provider restrictions or a timeout."
                ctaLabel="Open site directly"
                ctaHref={url}
              />
            </div>
          ) : showFallback && fallbackImage ? (
            <div className="relative h-[380px] sm:h-[480px] w-full">
              <Image
                src={fallbackImage}
                alt="Project preview"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 896px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/95 to-transparent p-4">
                <p className="font-mono text-xs text-highlight/70">
                  Live embed unavailable — showing capture.{" "}
                  <a href={url} className="text-accent underline" target="_blank" rel="noreferrer">
                    Open site
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <iframe
              title="demo"
              src={url}
              className="h-[380px] sm:h-[480px] w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setIframeLoaded(true)}
              onError={onIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
