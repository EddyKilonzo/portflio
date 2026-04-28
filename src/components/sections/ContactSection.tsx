"use client";

import { profile } from "@/content/portfolio";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { animate } from "animejs";
import { useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { AppModal } from "@/components/ui/AppModal";

const steps = ["name", "email", "message", "done"] as const;

const availStyle: Record<string, string> = {
  open: "text-emerald-300 border-emerald-400/40",
  freelance: "text-amber-300 border-amber-400/40",
  unavailable: "text-red-300 border-red-400/40",
};

type SocialLabel = "GitHub" | "LinkedIn" | "X" | "HTB" | "THM" | "Email";

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
  const [stepIdx, setStepIdx] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sentModalOpen, setSentModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<{ label: string; href: string } | null>(
    null,
  );
  const planeRef = useRef<SVGSVGElement>(null);

  const step = steps[stepIdx]!;

  const submit = () => {
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
    setSent(true);
    setSentModalOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="12" sectionId="contact" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-xl px-6">
        <h2 className="glitch-hover mb-6 font-display text-4xl text-highlight md:text-5xl">
          Contact
        </h2>

        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs ${availStyle[profile.availability]}`}
        >
          {profile.availability}
        </div>

        <div className="glass-card space-y-4 rounded-2xl p-6">
          <div className="max-h-80 space-y-3 overflow-y-auto font-mono text-sm">
            <div className="ml-auto max-w-[85%] rounded-2xl bg-surface/40 px-3 py-2 text-highlight/90">
              Hey — what&apos;s your name?
            </div>
            {name ? (
              <div className="mr-auto max-w-[85%] rounded-2xl border border-highlight/15 px-3 py-2">
                {name}
              </div>
            ) : null}
            {stepIdx >= 1 ? (
              <div className="ml-auto max-w-[85%] rounded-2xl bg-surface/40 px-3 py-2 text-highlight/90">
                Email for reply?
              </div>
            ) : null}
            {email ? (
              <div className="mr-auto max-w-[85%] rounded-2xl border border-highlight/15 px-3 py-2">
                {email}
              </div>
            ) : null}
            {stepIdx >= 2 ? (
              <div className="ml-auto max-w-[85%] rounded-2xl bg-surface/40 px-3 py-2 text-highlight/90">
                What are we building?
              </div>
            ) : null}
            {message ? (
              <div className="mr-auto max-w-[85%] rounded-2xl border border-highlight/15 px-3 py-2">
                {message}
              </div>
            ) : null}
            {sent ? (
              <div className="ml-auto max-w-[85%] rounded-2xl bg-surface/40 px-3 py-2 text-emerald-300">
                Message received. I&apos;ll reply shortly.
              </div>
            ) : null}
          </div>

          {step === "name" ? (
            <div className="flex gap-2">
              <input
                autoFocus
                className="flex-1 rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name) setStepIdx(1);
                }}
              />
              <button
                type="button"
                className="btn-ghost shrink-0"
                disabled={!name}
                onClick={() => setStepIdx(1)}
              >
                Next
              </button>
            </div>
          ) : null}
          {step === "email" ? (
            <div className="flex gap-2">
              <input
                autoFocus
                type="email"
                className="flex-1 rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email) setStepIdx(2);
                }}
              />
              <button
                type="button"
                className="btn-ghost shrink-0"
                disabled={!email}
                onClick={() => setStepIdx(2)}
              >
                Next
              </button>
            </div>
          ) : null}
          {step === "message" ? (
            <>
              <textarea
                autoFocus
                className="h-28 w-full rounded-lg border border-highlight/15 bg-surface/20 px-3 py-2 font-mono text-sm text-highlight"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <MagneticButton
                className="btn-ghost w-full"
                disabled={!message}
                onClick={() => {
                  setStepIdx(3);
                  submit();
                }}
              >
                Send
              </MagneticButton>
            </>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center gap-4 print:hidden">
          {(
            [
              ["GitHub", profile.social.github],
              ["LinkedIn", profile.social.linkedin],
              ["X", profile.social.twitter],
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
        open={sentModalOpen}
        onClose={() => setSentModalOpen(false)}
        title="Message queued"
        subtitle="Thanks for reaching out. I usually reply within 24 hours."
        footer={
          <>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setSentModalOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-ghost border-accent/60 text-accent"
              onClick={() => {
                setSentModalOpen(false);
                window.open(`mailto:${profile.email}`, "_blank", "noopener,noreferrer");
              }}
            >
              Email Directly
            </button>
          </>
        }
      >
        <div className="space-y-3 font-mono text-sm text-highlight/85">
          <p>
            Name: <span className="text-highlight">{name || "N/A"}</span>
          </p>
          <p>
            Email: <span className="text-highlight">{email || "N/A"}</span>
          </p>
          <p className="rounded-lg border border-highlight/15 bg-surface/20 p-3 text-highlight/80">
            {message || "No message body provided."}
          </p>
        </div>
      </AppModal>

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
                  window.open(pendingLink.href, "_blank", "noopener,noreferrer");
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
