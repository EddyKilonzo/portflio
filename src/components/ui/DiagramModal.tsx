"use client";

import { AppModal } from "./AppModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
};

export function DiagramModal({ isOpen, onClose, imageUrl, title }: Props) {
  return (
    <AppModal
      open={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Network Architecture Topology"
      size="lg"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-xl border border-highlight/10 bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Network diagram — ${title}`}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="mt-4 flex w-full justify-between items-center text-[11px] font-mono text-highlight/50">
          <span>{title}</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors underline"
          >
            Open Original
          </a>
        </div>
      </div>
    </AppModal>
  );
}
