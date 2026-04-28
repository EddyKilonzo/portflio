import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type HeatCell = { day: string; count: number; level: number };

type HeatDay = { date: string; count: number; level: number };

export type HeatWeek = { days: HeatDay[] };

/**
 * Maps GitHub's raw daily count to a 0–4 intensity level for heatmap cells.
 */
function countToLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

const GRAPHQL = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}`;

/**
 * Best-effort JSON parse for upstream responses. GitHub occasionally returns HTML
 * (rate limit, outage); parsing must not take down the whole handler.
 */
async function readJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * GitHub proxy: returns pinned repos, recent events, and contribution calendar.
 * - Without GITHUB_TOKEN: deterministic demo payload so the UI still renders.
 * - With token: live REST + GraphQL; partial failures degrade gracefully (empty heatmap, etc.).
 */
export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const user = process.env.GITHUB_USERNAME ?? "EddyKilonzo";

  // Demo mode: no secrets required; heatmap shape matches the live API for the same React tree.
  if (!token) {
    const demoHeat: HeatCell[] = Array.from({ length: 112 }).map((_, i) => ({
      day: `d-${i}`,
      count: (i * 3) % 9,
      level: ((i * 3) % 9 > 6 ? 3 : (i * 3) % 9 > 3 ? 2 : (i * 3) % 9 > 0 ? 1 : 0) as number,
    }));
    const demoWeeks: HeatWeek[] = [];
    for (let w = 0; w < 16; w++) {
      const days: HeatDay[] = [];
      for (let d = 0; d < 7; d++) {
        const i = w * 7 + d;
        const count = (i * 3) % 9;
        days.push({
          date: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
          count,
          level: countToLevel(count),
        });
      }
      demoWeeks.push({ days });
    }
    return NextResponse.json({
      source: "demo",
      login: user,
      pinned: [
        {
          name: "Set GITHUB_TOKEN",
          stars: 0,
          language: "—",
          description: "Live contribution graph uses GitHub GraphQL API.",
        },
      ],
      recent: [
        {
          sha: "—",
          message: "Add token for real activity",
          date: new Date().toISOString(),
          repo: user,
        },
      ],
      heatmap: demoHeat,
      heatmapWeeks: demoWeeks,
      totalContributions: null as number | null,
    });
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    };

    const [reposRes, eventsRes, gqlRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=6`,
        { headers, next: { revalidate: 3600 } },
      ),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=10`,
        { headers, next: { revalidate: 600 } },
      ),
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: GRAPHQL, variables: { login: user } }),
        next: { revalidate: 3600 },
      }),
    ]);

    const reposRaw =
      reposRes.ok ? await readJsonSafe<unknown>(reposRes) : null;
    const eventsRaw =
      eventsRes.ok ? await readJsonSafe<unknown>(eventsRes) : null;
    const repos = Array.isArray(reposRaw) ? reposRaw : [];
    const events = Array.isArray(eventsRaw) ? eventsRaw : [];

    const pinned = repos.slice(0, 6).map((r: Record<string, unknown>) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
      description: r.description,
    }));

    const recent = events
      .flatMap((e: Record<string, unknown>) => {
        const payload = (e.payload ?? {}) as { commits?: { sha?: string; message?: string }[] };
        const repo = (e.repo as { name?: string } | undefined)?.name ?? user;
        const createdAt = String(e.created_at ?? new Date().toISOString());
        const commits = payload.commits ?? [];
        if (commits.length) {
          return commits.map((c) => ({
            sha: c.sha?.slice(0, 7) ?? "—",
            message: c.message ?? "Commit",
            date: createdAt,
            repo,
          }));
        }
        return [
          {
            sha: "—",
            message: String(e.type ?? "Activity"),
            date: createdAt,
            repo,
          },
        ];
      })
      .slice(0, 8);

    let heatmapWeeks: HeatWeek[] = [];
    let totalContributions: number | null = null;
    const flatHeat: HeatCell[] = [];

    if (gqlRes.ok) {
      const gql = await readJsonSafe<{
        data?: {
          user?: {
            contributionsCollection?: {
              contributionCalendar?: {
                totalContributions?: number;
                weeks?: {
                  contributionDays: {
                    date: string;
                    contributionCount: number;
                  }[];
                }[];
              };
            };
          };
        };
      }>(gqlRes);

      const cal = gql?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal?.weeks) {
        totalContributions = cal.totalContributions ?? null;
        heatmapWeeks = cal.weeks.map((week) => ({
          days: week.contributionDays.map((day) => {
            const count = day.contributionCount ?? 0;
            const level = countToLevel(count);
            flatHeat.push({
              day: day.date,
              count,
              level,
            });
            return { date: day.date, count, level };
          }),
        }));
      }
    }

    return NextResponse.json({
      source: "live",
      login: user,
      pinned,
      recent,
      heatmap: flatHeat,
      heatmapWeeks,
      totalContributions,
    });
  } catch (cause) {
    console.error("[api/github] GET failed:", cause);
    return NextResponse.json({ error: "github_fetch_failed" }, { status: 502 });
  }
}
