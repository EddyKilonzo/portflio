"use client";

import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { AppModal } from "@/components/ui/AppModal";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { trackEvent } from "@/lib/analytics";
import { emitToast } from "@/lib/toast";

const availStyle: Record<string, string> = {
  open: "text-emerald-300 border-emerald-400/40",
  freelance: "text-amber-300 border-amber-400/40",
  unavailable: "text-red-300 border-red-400/40",
};

type SocialLabel = "GitHub" | "LinkedIn" | "X" | "HTB" | "THM" | "Email" | "WhatsApp";

function SocialIcon({ label }: { label: SocialLabel }) {
  if (label === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.2-3.3 4.4 4.4 0 0 1 .1-3.2s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2a4.4 4.4 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.5 6 .4.4.9 1.1.9 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M6.8 8.8H3.6V20h3.2V8.8Zm.2-3.5A1.9 1.9 0 1 0 3.2 5.3a1.9 1.9 0 0 0 3.8 0ZM20.8 13.5c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9V8.8H10V20h3.2v-5.5c0-1.5.3-2.9 2.2-2.9 1.8 0 1.8 1.7 1.8 3V20h3.2v-6.5Z" />
      </svg>
    );
  }
  if (label === "X") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M18.2 3h2.9l-6.4 7.3L22 21h-5.6l-4.3-5.7L7 21H4.1l6.8-7.8L2 3h5.7l3.9 5.2L18.2 3Zm-1 16.2h1.6L6.9 4.7H5.2l12 14.5Z" />
      </svg>
    );
  }
  if (label === "Email") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
        <path d="M4 6h16v12H4z" strokeWidth="1.8" />
        <path d="m4 7 8 6 8-6" strokeWidth="1.8" />
      </svg>
    );
  }
  if (label === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (label === "HTB") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
        <path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" strokeWidth="1.8" />
        <path d="M9 9v6M15 9v6M9 12h6" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path d="M4 6h16v12H4z" strokeWidth="1.8" />
      <path d="M8 10h8M8 14h5" strokeWidth="1.8" />
    </svg>
  );
}

export function ContactSection() {
  const sectionRef = useSectionReveal(10);
  const [name, setName]                   = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [message, setMessage]             = useState("");
  const [sent, setSent]                   = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink]     = useState<{ label: string; href: string } | null>(null);
  const planeRef     = useRef<SVGSVGElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const waText = `Hi Eddy! I found your portfolio.\n\nFrom: ${name.trim()}\n\n${message.trim()}`;
  const waUrl  = `https://wa.me/${profile.social.whatsapp}?text=${encodeURIComponent(waText)}`;
  const canSend = nameConfirmed && message.trim().length >= 3;

  // Focus the textarea after the CSS slide-in animation starts (avoids focus-on-invisible bug)
  useEffect(() => {
    if (!nameConfirmed) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [nameConfirmed]);

  const confirmName = () => {
    if (name.trim().length >= 2) setNameConfirmed(true);
  };

  const firePlane = () => {
    const el = planeRef.current;
    if (el) {
      el.style.opacity = "1";
      animate(el, {
        translateX: typeof window !== "undefined" ? window.innerWidth - 80 : 500,
        translateY: -200,
        rotate: 45,
        opacity: [1, 0],
        duration: 1200,
        ease: "in(4)",
      });
    }
    trackEvent("contact_submit_whatsapp", { messageLength: message.length });
    setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="13" sectionId="contact" />
      <DecorNetwork />
<div className="relative z-10 mx-auto max-w-xl px-6">
  <ParallaxDrift speed={0.1}>
    <h2
      className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl"
      data-aos="fade-up"
      data-aos-offset="0"
    >
      Contact
    </h2>
  </ParallaxDrift>

  <div
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-offset="0"
    className={`glass-pill mb-6 inline-flex items-center gap-2 ${availStyle[profile.availability]}`}
  >
    {profile.availability}
  </div>

  <div
    className="glass-card space-y-4 rounded-2xl p-6"
    data-aos="fade-up"
    data-aos-delay="200"
    data-aos-offset="0"
  >
          {!sent ? (
            <div className="space-y-4">

              {/* ── Name field ── */}
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-highlight/50">
                  Your name
                </label>
                <div className="flex gap-2">
                  {/* No autoFocus: focusing on lazy-mount scroll-jumped the
                      whole page to the contact section a few seconds after load */}
                  <input
                    ref={nameInputRef}
                    className={`glass-field flex-1 text-highlight placeholder:text-highlight/35 transition-all duration-300 ${nameConfirmed ? "opacity-60 pointer-events-none" : ""}`}
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    disabled={nameConfirmed}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") confirmName(); }}
                  />
                  {!nameConfirmed && (
                    <button
                      type="button"
                      onClick={confirmName}
                      disabled={name.trim().length < 2}
                      className="shrink-0 rounded-xl border border-highlight/20 bg-surface/20 px-4 font-mono text-xs text-highlight/70 transition-all hover:border-highlight/40 hover:text-highlight disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Next →
                    </button>
                  )}
                  {nameConfirmed && (
                    <span className="flex shrink-0 items-center rounded-xl border border-accent/30 bg-accent/8 px-3 font-mono text-xs text-accent">
                      ✓
                    </span>
                  )}
                </div>
                {!nameConfirmed && name.trim().length >= 2 && (
                  <p className="mt-1 font-mono text-[10px] text-highlight/35 animate-pulse">
                    Press Enter or Next →
                  </p>
                )}
              </div>

              {/* ── Message field — animates in after name confirmed ── */}
              {nameConfirmed && (
                <div style={{ animation: "contact-msg-in 480ms cubic-bezier(0.22,1,0.36,1) both" }} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-highlight/50">
                      Your message
                    </label>
                    <textarea
                      ref={textareaRef}
                      className="glass-field h-32 w-full resize-none text-highlight placeholder:text-highlight/35"
                      placeholder="What would you like to discuss?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={3000}
                    />
                    <div className="mt-1 flex justify-end">
                      <span className={`font-mono text-[10px] ${message.length > 2800 ? "text-amber-400" : "text-highlight/30"}`}>
                        {message.length}/3000
                      </span>
                    </div>
                  </div>

                  {/* Send button — fades between states via CSS */}
                  <a
                    href={canSend ? waUrl : "#"}
                    target={canSend ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={canSend ? firePlane : (e) => e.preventDefault()}
                    aria-disabled={!canSend}
                    className={`flex w-full items-center justify-center gap-2.5 rounded-xl border py-3 font-mono text-sm font-semibold transition-all duration-300 ${
                      canSend
                        ? "border-emerald-500/50 bg-emerald-500/12 text-emerald-300 hover:border-emerald-400/70 hover:bg-emerald-500/20 hover:text-emerald-200 active:scale-[0.98] cursor-pointer"
                        : "border-highlight/10 bg-surface/10 text-highlight/25 cursor-not-allowed"
                    }`}
                  >
                    <SocialIcon label="WhatsApp" />
                    {canSend ? "Send via WhatsApp" : "Type a message first"}
                  </a>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3">
                <p className="font-mono text-sm text-emerald-300">WhatsApp opened ✓</p>
                <p className="mt-1 font-mono text-[11px] text-emerald-400/70">Tap Send in the app to deliver your message.</p>
              </div>
              <button
                type="button"
                className="font-mono text-[11px] text-highlight/40 transition-colors hover:text-highlight/70"
                onClick={() => { setName(""); setNameConfirmed(false); setMessage(""); setSent(false); }}
              >
                Send another →
              </button>
            </div>
          )}
        </div>

        {/* Direct contact profiles */}
        <div className="mt-8 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-highlight/60">Contact me through</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href={`https://wa.me/254703526520?text=${encodeURIComponent("Hi Eddy! I found your portfolio and would love to connect.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/12"
            >
              <SocialIcon label="WhatsApp" />
              <div>
                <p className="font-mono text-xs text-emerald-300">WhatsApp</p>
                <p className="font-mono text-[11px] text-highlight/50">+254 703 526 520</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/eddy-kilonzo-/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-400/8 px-4 py-3 transition-all hover:border-blue-400/50 hover:bg-blue-400/12"
            >
              <SocialIcon label="LinkedIn" />
              <div>
                <p className="font-mono text-xs text-blue-300">LinkedIn</p>
                <p className="font-mono text-[11px] text-highlight/50">eddy-kilonzo</p>
              </div>
            </a>
            <a
              href="mailto:eddymax3715@gmail.com"
              className="flex items-center gap-3 rounded-xl border border-highlight/20 bg-surface/10 px-4 py-3 transition-all hover:border-highlight/35 hover:bg-surface/20"
            >
              <SocialIcon label="Email" />
              <div>
                <p className="font-mono text-xs text-highlight/70">Email</p>
                <p className="font-mono text-[11px] text-highlight/50">eddymax3715@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-row flex-wrap justify-center gap-3 print:hidden">
          {(
            [
              ["GitHub", profile.social.github],
              ["LinkedIn", profile.social.linkedin],
              ["X", profile.social.twitter],
              ["WhatsApp", `https://wa.me/${profile.social.whatsapp}?text=${encodeURIComponent("Hi Eddy! I found your portfolio and would love to connect.")}`],
              ["HTB", profile.social.htb],
              ["THM", profile.social.thm],
              ["Email", `mailto:${profile.email}`],
            ] as const
          ).map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              onClick={(e) => {
                e.preventDefault();
                setPendingLink({ label, href });
                setLinkModalOpen(true);
                emitToast(`Preparing ${label} link`, "info");
              }}
              className="glass-card flex h-12 w-12 items-center justify-center rounded-xl font-mono text-[10px] text-highlight/80 transition-transform hover:-translate-y-1 hover:shadow-lift"
            >
              <SocialIcon label={label} />
            </a>
          ))}
        </div>
      </div>

      <svg
        ref={planeRef}
        className="pointer-events-none fixed bottom-24 left-1/4 h-10 w-10 text-accent opacity-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
      </svg>

      <AppModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title={pendingLink ? `Open ${pendingLink.label}` : "Open Link"}
        subtitle="This event opens in a new tab."
        footer={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setLinkModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-ghost border-accent/60 text-accent"
              onClick={() => {
                if (pendingLink) {
                  trackEvent("contact_social_open", { label: pendingLink.label });
                  window.open(pendingLink.href, "_blank", "noopener,noreferrer");
                  emitToast(`Opened ${pendingLink.label}`, "success");
                }
                setLinkModalOpen(false);
              }}
            >
              Continue
            </button>
          </>
        }
      >
        <p className="font-sans text-sm text-highlight/85">
          {pendingLink?.href ?? "No link selected."}
        </p>
      </AppModal>
    </section>
  );
}
