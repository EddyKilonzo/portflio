import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Invalid request body.";
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name || name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 100) return "Name is too long.";
  if (!email || !EMAIL_RE.test(email)) return "A valid email address is required.";
  if (email.length > 254) return "Email address is too long.";
  if (!message || message.length < 10) return "Message must be at least 10 characters.";
  if (message.length > 3000) return "Message is too long (max 3000 characters).";

  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  const { name, email, message, projectType, budget, timeline } = body as Record<string, string>;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "hello@eddymax.dev";

  if (!apiKey) {
    // Dev mode: log and return success without sending
    console.log("[contact] No RESEND_API_KEY — logging submission:", { name, email, projectType });
    return NextResponse.json({ ok: true, dev: true });
  }

  const html = `
    <h2>New contact from EMK Portfolio</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Project type:</strong> ${projectType ?? "—"}</p>
    <p><strong>Budget:</strong> ${budget ?? "—"}</p>
    <p><strong>Timeline:</strong> ${timeline ?? "—"}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${message}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `[Portfolio] Message from ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[contact] Resend error:", err);
      return NextResponse.json({ error: "Failed to send. Please try email directly." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Network error:", err);
    return NextResponse.json({ error: "Network error. Please try email directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
