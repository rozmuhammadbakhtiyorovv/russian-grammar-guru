import { createServerFn } from "@tanstack/react-start";

export type Gender = "мужской" | "женский" | "средний";

export type GenderWord = {
  word: string;
  gender: Gender;
  translation: string;
  hint: string;
};

const FALLBACK: GenderWord[] = [
  { word: "стол", gender: "мужской", translation: "table", hint: "Оканчивается на согласный." },
  { word: "книга", gender: "женский", translation: "book", hint: "Оканчивается на -а." },
  { word: "окно", gender: "средний", translation: "window", hint: "Оканчивается на -о." },
  { word: "мама", gender: "женский", translation: "mom", hint: "Оканчивается на -а." },
  { word: "море", gender: "средний", translation: "sea", hint: "Оканчивается на -е." },
  { word: "дом", gender: "мужской", translation: "house", hint: "Оканчивается на согласный." },
  { word: "школа", gender: "женский", translation: "school", hint: "Оканчивается на -а." },
  { word: "яблоко", gender: "средний", translation: "apple", hint: "Оканчивается на -о." },
  { word: "город", gender: "мужской", translation: "city", hint: "Оканчивается на согласный." },
  { word: "ночь", gender: "женский", translation: "night", hint: "Оканчивается на -ь (женский род)." },
];

const SYSTEM =
  "Ты помощник для изучения русской грамматики уровня A1. " +
  "Верни ТОЛЬКО JSON без markdown: " +
  '{"word":"...","gender":"мужской|женский|средний","translation":"english translation","hint":"короткое правило по-русски"}. ' +
  "Слово — простое существительное уровня A1 в именительном падеже, единственное число, строчными буквами.";

function pickFallback(exclude: string[]): GenderWord {
  const pool = FALLBACK.filter((w) => !exclude.includes(w.word));
  const list = pool.length > 0 ? pool : FALLBACK;
  return list[Math.floor(Math.random() * list.length)]!;
}

function parseWord(raw: string): GenderWord | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as Partial<GenderWord>;
    if (!parsed.word || !parsed.gender) return null;
    if (!["мужской", "женский", "средний"].includes(parsed.gender)) return null;
    return {
      word: String(parsed.word).toLowerCase().trim(),
      gender: parsed.gender,
      translation: String(parsed.translation ?? "").trim(),
      hint: String(parsed.hint ?? "").trim(),
    };
  } catch {
    return null;
  }
}

export const generateGenderWord = createServerFn({ method: "POST" })
  .inputValidator((input: { exclude?: string[] }) => ({
    exclude: (input?.exclude ?? []).slice(0, 20).map(String),
  }))
  .handler(async ({ data }): Promise<GenderWord & { source: "ai" | "fallback" }> => {
    const prompt =
      `Дай одно новое существительное уровня A1. Не используй эти слова: ${
        data.exclude.join(", ") || "нет"
      }.`;

    const groqKey = process.env["GROQ_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];

    const config = groqKey
      ? {
          url: "https://api.groq.com/openai/v1/chat/completions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          model: "llama-3.3-70b-versatile",
        }
      : lovableKey
        ? {
            url: "https://ai.gateway.lovable.dev/v1/chat/completions",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": lovableKey,
            },
            model: "google/gemini-3.6-flash",
          }
        : null;

    if (!config) return { ...pickFallback(data.exclude), source: "fallback" };

    try {
      const res = await fetch(config.url, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({
          model: config.model,
          temperature: 1,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        console.error("AI word generation failed", res.status, await res.text());
        return { ...pickFallback(data.exclude), source: "fallback" };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const parsed = parseWord(json.choices?.[0]?.message?.content ?? "");
      if (!parsed) return { ...pickFallback(data.exclude), source: "fallback" };
      return { ...parsed, source: "ai" };
    } catch (error) {
      console.error("AI word generation error", error);
      return { ...pickFallback(data.exclude), source: "fallback" };
    }
  });