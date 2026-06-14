"use client";

import { useSectionReveal } from "@/hooks/useSectionReveal";
import { DecorNetwork } from "@/components/layout/DecorNetwork";
import { SectionNumber } from "@/components/layout/SectionNumber";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { useSanityFetch } from "@/hooks/useSanityFetch";
import { getBlogPosts } from "@/lib/sanityQueries";
import { publications as staticPublications } from "@/content/portfolio";

export function BlogSection() {
  const sectionRef = useSectionReveal(9);
  const blogPosts = useSanityFetch(getBlogPosts, staticPublications);

  return (
    <section
      ref={sectionRef}
      id="blog"
      data-section="blog"
      className="relative overflow-hidden py-24 section-bg"
    >
      <SectionNumber n="09" sectionId="blog" />
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
          <p
            className="mt-10 font-mono text-highlight/50"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Coming soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="150">
            {blogPosts.map((post, i) => (
              <article
                key={post.id}
                data-aos="fade-up"
                data-aos-delay={Math.min(i * 60, 120)}
                className="glass-card flex flex-col gap-3 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-highlight/60">{post.date}</span>
                  {'readingTime' in post && (post as { readingTime?: string }).readingTime && (
                    <span className="font-mono text-[10px] text-highlight/55">{(post as { readingTime: string }).readingTime} read</span>
                  )}
                </div>
                <h3 className="font-display text-lg text-highlight leading-snug">{post.title}</h3>
                <p className="flex-1 font-sans text-sm text-highlight/60 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {('tags' in post ? (post as { tags: string[] }).tags : []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-highlight/15 px-2 py-0.5 font-mono text-[10px] text-highlight/65"
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
