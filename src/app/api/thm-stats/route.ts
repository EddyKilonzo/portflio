import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("https://tryhackme.com/api/user/eddy.kilonzo", {
      headers: { "User-Agent": "portfolio-site" },
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: "THM API unavailable" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      rank: data.userRank ?? data.rank ?? null,
      points: data.userPoints ?? data.points ?? null,
      completedRooms: data.completedRooms ?? null,
      badgesCount: Array.isArray(data.badges) ? data.badges.length : null,
    });
  } catch {
    clearTimeout(timeout);
    return NextResponse.json({ error: "THM API unavailable" }, { status: 502 });
  }
}
