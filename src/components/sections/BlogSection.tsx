"use client";

import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingTime?: string;
  url?: string;
};

export const blogPosts: BlogPost[] = [
  // Add blog posts here
];

export function BlogSection() {
  const sectionRef = useSectionReveal(9);

  return (
    <section
      ref={sectionRef}
      id="blog"
      data-section="blog"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="10" sectionId="blog" />
      <DecorNetwork />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ParallaxDrift speed={0.1}>
          <h2
            className="glitch-hover font-display text-4xl text-highlight md:text-5xl"
            data-aos="fade-right"
          >
            Blog
          </h2>
          <p
            className="mt-2 max-w-2xl font-sans text-highlight/70"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Security research, lab writeups, and thoughts on building in the cyber space.
          </p>
        </ParallaxDrift>

        {blogPosts.length === 0 ? (
          <div
            className="mt-10 flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-highlight/40 bg-surface/10 py-20 text-center"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {/* Pen icon */}
            <svg viewBox="0 0 24 24" className="h-14 w-14 text-highlight/50" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <div className="space-y-2">
              <p className="font-display text-xl text-highlight/70">Posts coming soon</p>
              <p className="max-w-xs font-mono text-sm text-highlight/55 mx-auto">
                Lab writeups, CTF solutions, and security notes will live here.
              </p>
            </div>
            {/* Category hint icons */}
            <div className="flex items-center gap-6 mt-2">
              <div className="flex flex-col items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-highlight/55" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="font-mono text-[9px] text-highlight/55">Lab writeups</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-highlight/55" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 3l-1.664 1.664M3 21l1.664-1.664M21 21l-1.664-1.664M12 2.25v1.5m0 16.5v1.5M2.25 12h1.5m16.5 0h1.5m-7.5-5.25L12 12l5.25 1.5" />
                </svg>
                <span className="font-mono text-[9px] text-highlight/55">CTF solutions</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-highlight/55" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="font-mono text-[9px] text-highlight/55">Security notes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="150">
            {blogPosts.map((post, i) => (
              <article
                key={post.id}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                data-aos-once="true"
                className="glass-card flex flex-col gap-3 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-highlight/40">{post.date}</span>
                  {post.readingTime && (
                    <span className="font-mono text-[10px] text-highlight/30">{post.readingTime} read</span>
                  )}
                </div>
                <h3 className="font-display text-lg text-highlight leading-snug">{post.title}</h3>
                <p className="flex-1 font-sans text-sm text-highlight/60 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-highlight/15 px-2 py-0.5 font-mono text-[10px] text-highlight/45"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/8 py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/15 hover:border-accent/50"
                  >
                    Read post ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
