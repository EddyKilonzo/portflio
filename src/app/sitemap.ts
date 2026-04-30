import type { MetadataRoute } from "next";
import { projects } from "@/content/portfolio";
import { sectionLinks } from "@/content/sections";

const BASE = "https://eddymax.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Root page (contains all sections as anchors)
  const root: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // One URL per named section anchor for search engines that follow fragments
  const sections: MetadataRoute.Sitemap = sectionLinks
    .filter((s) => s.id !== "hero")
    .map((s) => ({
      url: `${BASE}/#${s.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // One entry per project (anchored into the projects section)
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/#projects?q=${encodeURIComponent(p.title)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...root, ...sections, ...projectEntries];
}
