import { NextResponse } from "next/server";

type ImprovePayload =
  | {
      type: "project";
      name: string;
      category: string;
      tags: string[];
      current: string;
    }
  | {
      type: "post";
      title: string;
      tags: string[];
      current: string;
    };

function buildPrompt(payload: ImprovePayload): string {
  if (payload.type === "project") {
    return [
      "Rewrite this project description for a 3D design/prototyping studio portfolio.",
      "Return only one improved paragraph (max 45 words), no quotes, no bullets.",
      "Keep it credible and specific. Avoid hype and generic marketing language.",
      `Project name: ${payload.name}`,
      `Category: ${payload.category}`,
      `Tags: ${payload.tags.join(", ") || "none"}`,
      `Current description: ${payload.current || "(empty)"}`,
    ].join("\n");
  }

  return [
    "Rewrite this blog post excerpt for a 3D design/prototyping studio journal.",
    "Return only one improved paragraph (max 45 words), no quotes, no bullets.",
    "Make it clear and practical, not salesy.",
    `Post title: ${payload.title}`,
    `Tags: ${payload.tags.join(", ") || "none"}`,
    `Current excerpt: ${payload.current || "(empty)"}`,
  ].join("\n");
}

function getTextFromResponse(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const root = json as Record<string, unknown>;

  if (typeof root.output_text === "string" && root.output_text.trim()) {
    return root.output_text.trim();
  }

  const output = Array.isArray(root.output) ? root.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const content = Array.isArray(row.content) ? row.content : [];
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const segment = part as Record<string, unknown>;
      if (
        segment.type === "output_text" &&
        typeof segment.text === "string" &&
        segment.text.trim()
      ) {
        return segment.text.trim();
      }
    }
  }
  return "";
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing on the server." },
      { status: 500 }
    );
  }

  let payload: ImprovePayload;
  try {
    payload = (await req.json()) as ImprovePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload?.type || (payload.type !== "project" && payload.type !== "post")) {
    return NextResponse.json({ error: "Invalid payload type." }, { status: 400 });
  }

  const input = buildPrompt(payload);

  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: `OpenAI request failed (${resp.status}): ${text}` },
      { status: 502 }
    );
  }

  const data = await resp.json();
  const improved = getTextFromResponse(data);
  if (!improved) {
    return NextResponse.json({ error: "No text returned from OpenAI." }, { status: 502 });
  }

  return NextResponse.json({ text: improved });
}
