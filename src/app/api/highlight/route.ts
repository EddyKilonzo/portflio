import { codeToHtml } from "shiki";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string; lang?: string };
    const code = String(body.code ?? "").slice(0, 60000);
    const lang = String(body.lang ?? "python");
    const supportedLangs = ["python", "bash", "go", "typescript", "javascript", "json", "yaml", "text"];
    const safeLang = supportedLangs.includes(lang) ? lang : "text";
    const html = await codeToHtml(code, {
      lang: safeLang,
      theme: "github-dark",
    });
    return Response.json({ html });
  } catch {
    return Response.json({ html: null }, { status: 500 });
  }
}
