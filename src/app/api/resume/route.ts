import { NextRequest, NextResponse } from "next/server";
import { cvVariants } from "@/content/portfolio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get("variant") as keyof typeof cvVariants | null;
  const selected = variant && cvVariants[variant] ? variant : "developer";
  const body = cvVariants[selected];

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="eddy-max-kilonzo-${selected}-resume.txt"`,
      "Cache-Control": "no-store",
    },
  });
}
