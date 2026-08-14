type AIConfig = { url: string; headers: Record<string, string>; model: string };

function getConfig(): AIConfig | null {
  const groqKey = process.env["GROQ_API_KEY"];
  if (groqKey) {
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
      model: "llama-3.3-70b-versatile",
    };
  }
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (lovableKey) {
    return {
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableKey },
      model: "google/gemini-3.6-flash",
    };
  }
  return null;
}

export async function callAI(system: string, user: string): Promise<string | null> {
  const config = getConfig();
  if (!config) return null;
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({
        model: config.model,
        temperature: 1,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("AI request failed", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error("AI request error", error);
    return null;
  }
}

export function parseJson<T>(raw: string | null): Partial<T> | null {
  if (!raw) return null;
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Partial<T>;
  } catch {
    return null;
  }
}

export function shuffle<T>(items: T[]): T[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j]!, list[i]!];
  }
  return list;
}
