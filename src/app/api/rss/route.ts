import { profile } from "@/content/portfolio";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Parses the configured RSS feed into a tiny JSON list for the integrations panel.
 * Not a full XML parser—regex split is enough for typical `<title>` sequences.
 */
export async function GET() {
  const url = profile.rssFeedUrl;
  const fallbackItems = [
    { id: "1", title: "Detection engineering: writing Sigma rules that survive iteration" },
    { id: "2", title: "Building a Next.js portfolio with WebGL and scroll-linked storytelling" },
    { id: "3", title: "OSINT workflows for passive phishing domain discovery" },
  ];
  try {
    if (!url?.trim()) {
      throw new Error("RSS URL not configured");
    }
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`RSS HTTP ${res.status}`);
    }
    const xml = await res.text();
    const titles = xml
      .split(/<title>/i)
      .slice(1)
      .map((chunk) =>
        chunk
          .split("</title>")[0]
          ?.replace(/<!\[CDATA\[|\]\]>/g, "")
          .trim(),
      )
      .filter(Boolean) as string[];
    // First title is usually the channel name; skip it for "latest post" style rows.
    const items = titles
      .slice(1)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((t, i) => ({ id: String(i + 1), title: t }));
    if (!items.length) {
      return NextResponse.json({ items: fallbackItems });
    }
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: fallbackItems });
  }
}
