import { callAI, parseJson, shuffle } from "./ai.server";
import type { PossessiveTask } from "./possessive.types";

const GROUPS: string[][] = [
  ["мой", "моя", "моё", "мои"],
  ["твой", "твоя", "твоё", "твои"],
  ["наш", "наша", "наше", "наши"],
  ["ваш", "ваша", "ваше", "ваши"],
  ["его", "её", "их"],
];

const ALL = GROUPS.flat();

const FALLBACK: { sentence: string; answer: string; translation: string; hint: string }[] = [
  { sentence: "Это ___ жизнь.", answer: "моя", translation: "This is my life. / Bu mening hayotim.", hint: "«жизнь» — jenskiy rod, shuning uchun «моя»." },
  { sentence: "___ кот мяукает.", answer: "твой", translation: "Your cat is meowing. / Sening mushuging miyovlaydi.", hint: "«кот» — mujskoy rod → «твой»." },
  { sentence: "___ дом большой.", answer: "наш", translation: "Our house is big. / Bizning uyimiz katta.", hint: "«дом» — mujskoy rod → «наш»." },
  { sentence: "Вот ___ ключи.", answer: "ваши", translation: "Here are your keys. / Mana sizning kalitlaringiz.", hint: "«ключи» — ko‘plik → «ваши»." },
  { sentence: "___ собака добрая.", answer: "его", translation: "His dog is kind. / Uning iti mehribon.", hint: "«его» hech qachon o‘zgarmaydi." },
  { sentence: "___ сумка дорогая.", answer: "её", translation: "Her bag is expensive. / Uning sumkasi qimmat.", hint: "«её» hech qachon o‘zgarmaydi." },
  { sentence: "___ дети здесь.", answer: "их", translation: "Their children are here. / Ularning bolalari shu yerda.", hint: "«их» hech qachon o‘zgarmaydi." },
  { sentence: "___ окно открыто.", answer: "моё", translation: "My window is open. / Mening derazam ochiq.", hint: "«окно» — sredniy rod → «моё»." },
  { sentence: "___ сестра студентка.", answer: "моя", translation: "My sister is a student. / Mening opam talaba.", hint: "«сестра» — jenskiy rod → «моя»." },
  { sentence: "___ книги на столе.", answer: "твои", translation: "Your books are on the table. / Sening kitoblaring stolda.", hint: "«книги» — ko‘plik → «твои»." },
];

const SYSTEM =
  "Ты помощник для изучения русской грамматики уровня A1 (притяжательные местоимения). " +
  "Верни ТОЛЬКО JSON без markdown: " +
  '{"sentence":"предложение с ___ вместо местоимения","answer":"мой|моя|моё|мои|твой|твоя|твоё|твои|наш|наша|наше|наши|ваш|ваша|ваше|ваши|его|её|их","translation":"english / uzbek tarjima","hint":"qisqa izoh o‘zbek tilida"}. ' +
  "Предложение простое, уровень A1, 3-5 слов, ровно один пропуск ___ .";

function buildOptions(answer: string): string[] {
  const group = GROUPS.find((g) => g.includes(answer)) ?? GROUPS[0]!;
  const others = group.filter((w) => w !== answer);
  const extra = ALL.filter((w) => w !== answer && !group.includes(w));
  const distractors = [...others, ...shuffle(extra)].slice(0, 3);
  return shuffle([answer, ...distractors]);
}

function pickFallback(exclude: string[]): PossessiveTask {
  const pool = FALLBACK.filter((t) => !exclude.includes(t.sentence));
  const list = pool.length > 0 ? pool : FALLBACK;
  const item = list[Math.floor(Math.random() * list.length)]!;
  return { ...item, options: buildOptions(item.answer) };
}

export async function generatePossessive(
  exclude: string[],
): Promise<PossessiveTask & { source: "ai" | "fallback" }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await callAI(
      SYSTEM,
      `Дай новое предложение A1. Не повторяй эти предложения: ${
        exclude.join(" | ") || "нет"
      }. Меняй тему и местоимение.`,
    );
    if (raw === null) break;
    const parsed = parseJson<PossessiveTask>(raw);
    const answer = String(parsed?.answer ?? "").toLowerCase().trim().replace("ё", "ё");
    const sentence = String(parsed?.sentence ?? "").trim();
    if (!sentence.includes("___") || !ALL.includes(answer)) continue;
    if (exclude.includes(sentence)) continue;
    return {
      sentence,
      answer,
      options: buildOptions(answer),
      translation: String(parsed?.translation ?? "").trim(),
      hint: String(parsed?.hint ?? "").trim(),
      source: "ai",
    };
  }
  return { ...pickFallback(exclude), source: "fallback" };
}
