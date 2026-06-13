import { NextResponse } from "next/server";

export const revalidate = 3600;

type Repo = { language?: string | null; stargazers_count: number };

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/EddyKilonzo", {
        headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "portfolio-site" },
        next: { revalidate: 3600 },
        signal: controller.signal,
      }),
      fetch("https://api.github.com/users/EddyKilonzo/repos?per_page=100&sort=updated", {
        headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "portfolio-site" },
        next: { revalidate: 3600 },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeout);

    if (!userRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const user = await userRes.json();
    const repos: Repo[] = reposRes.ok ? await reposRes.json() : [];

    const langCounts: Record<string, number> = {};
    let totalStars = 0;
    for (const repo of repos) {
      if (repo.language) langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1;
      totalStars += repo.stargazers_count ?? 0;
    }

    const topLanguages = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([lang, count]) => ({ lang, count }));

    return NextResponse.json({
      publicRepos: user.public_repos as number,
      followers: user.followers as number,
      totalStars,
      topLanguages,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    clearTimeout(timeout);
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
  }
}
