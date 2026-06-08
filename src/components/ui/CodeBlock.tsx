import { codeToHtml } from "shiki";

interface Props {
  code: string;
  lang: string;
  filename?: string;
}

export async function CodeBlock({ code, lang, filename }: Props) {
  let html = "";
  try {
    html = await codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch {
    // Fallback if lang not recognised by shiki
    html = `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-highlight/10">
      {filename && (
        <div className="flex items-center gap-2 border-b border-highlight/10 bg-surface/20 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[11px] text-highlight/50">{filename}</span>
        </div>
      )}
      <div
        className="overflow-x-auto p-4 text-sm [&>pre]:bg-transparent! [&_code]:font-mono [&_code]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ background: "#0d1117" }}
      />
    </div>
  );
}
