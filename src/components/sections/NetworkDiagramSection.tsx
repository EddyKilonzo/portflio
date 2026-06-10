"use client";

import { useState } from "react";
import { DiagramModal } from "@/components/ui/DiagramModal";

type Props = {
  imageUrl: string;
  title: string;
};

export function NetworkDiagramSection({ imageUrl, title }: Props) {
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  return (
    <>
      <section className="glass-card rounded-2xl p-6 md:p-8" data-aos="fade-up" data-aos-delay="100">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-highlight">
          <span className="text-accent">⊞</span>
          Network Diagram
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <p className="text-sm text-highlight/60">
            Topology of the target environment as scoped for this engagement.
          </p>
          <button
            onClick={() => setIsDiagramOpen(true)}
            className="glass-pill text-[11px] hover:text-accent transition-colors"
          >
            ⛶ View Full Screen
          </button>
        </div>
        <button
          onClick={() => setIsDiagramOpen(true)}
          className="group relative w-full rounded-xl overflow-hidden border border-highlight/10 bg-black/20 text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Network diagram — ${title}`}
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="glass-pill px-4 py-2 text-sm">Click to expand</span>
          </div>
        </button>
      </section>

      <DiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
        imageUrl={imageUrl}
        title={title}
      />
    </>
  );
}
