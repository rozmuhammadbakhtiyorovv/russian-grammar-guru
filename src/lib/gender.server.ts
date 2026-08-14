import { callAI, parseJson } from "./ai.server";
import type { Gender, GenderWord } from "./gender.types";

const FALLBACK: GenderWord[] = [
  { word: "стол", gender: "мужской", translation: "table / stol", hint: "Oxiri undosh — mujskoy rod." },
  { word: "книга", gender: "женский", translation: "book / kitob", hint: "Oxiri -а — jenskiy rod." },
  { word: "окно", gender: "средний", translation: "window / deraza", hint: "Oxiri -о — sredniy rod." },
  { word: "мама", gender: "женский", translation: "mom / ona", hint: "Oxiri -а — jenskiy rod." },
  { word: "море", gender: "средний", translation: "sea / dengiz", hint: "Oxiri -е — sredniy rod." },
  { word: "дом", gender: "мужской", translation: "house / uy", hint: "Oxiri undosh — mujskoy rod." },
  { word: "школа", gender: "женский", translation: "school / maktab", hint: "Oxiri -а — jenskiy rod." },
  { word: "яблоко", gender: "средний", translation: "apple / olma", hint: "Oxiri -о — sredniy rod." },
  { word: "город", gender: "мужской", translation: "city / shahar", hint: "Oxiri undosh — mujskoy rod." },
  { word: "ночь", gender: "женский", translation: "night / tun", hint: "Oxiri -ь, bu so‘z jenskiy rod." },
  { word: "брат", gender: "мужской", translation: "brother / aka", hint: "Oxiri undosh — mujskoy rod." },
  { word: "сестра", gender: "женский", translation: "sister / opa", hint: "Oxiri -а — jenskiy rod." },
  { word: "письмо", gender: "средний", translation: "letter / xat", hint: "Oxiri -о — sredniy rod." },
  { word: "врач", gender: "мужской", translation: "doctor / shifokor", hint: "Oxiri undosh — mujskoy rod." },
  { word: "вода", gender: "женский", translation: "water / suv", hint: "Oxiri -а — jenskiy rod." },
  { word: "солнце", gender: "средний", translation: "sun / quyosh", hint: "Oxiri -е — sredniy rod." },
  { word: "друг", gender: "мужской", translation: "friend / do‘st", hint: "Oxiri undosh — mujskoy rod." },
  { word: "улица", gender: "женский", translation: "street / ko‘cha", hint: "Oxiri -а — jenskiy rod." },
  { word: "молоко", gender: "средний", translation: "milk / sut", hint: "Oxiri -о — sredniy rod." },
  { word: "чай", gender: "мужской", translation: "tea / choy", hint: "Oxiri -й — mujskoy rod." },
];

const SYSTEM =
  "Ты помощник для изучения русской грамматики уровня A1. " +
  "Верни ТОЛЬКО JSON без markdown: " +
  '{"word":"...","gender":"мужской|женский|средний","translation":"english / uzbek tarjima","hint":"qisqa qoida o‘zbek tilida"}. ' +
  "Слово — простое существительное уровня A1 в именительном падеже, единственное число, строчными буквами.";

const GENDERS = ["мужской", "женский", "средний"];

function pickFallback(exclude: string[]): GenderWord {
  const pool = FALLBACK.filter((w) => !exclude.includes(w.word));
  const list = pool.length > 0 ? pool : FALLBACK;
  return list[Math.floor(Math.random() * list.length)]!;
}

function parseWord(raw: string | null): GenderWord | null {
  const parsed = parseJson<GenderWord>(raw);
  if (!parsed?.word || !parsed.gender) return null;
  if (!GENDERS.includes(parsed.gender)) return null;
  return {
    word: String(parsed.word).toLowerCase().trim(),
    gender: parsed.gender as Gender,
    translation: String(parsed.translation ?? "").trim(),
    hint: String(parsed.hint ?? "").trim(),
  };
}

export async function generateWord(
  exclude: string[],
): Promise<GenderWord & { source: "ai" | "fallback" }> {
  const seen = exclude.map((w) => w.toLowerCase().trim());
  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await callAI(
      SYSTEM,
      `Дай одно НОВОЕ существительное уровня A1. Строго запрещено использовать эти слова: ${
        seen.join(", ") || "нет"
      }. Выбери слово из другой темы, чем предыдущие.`,
    );
    if (raw === null) break;
    const parsed = parseWord(raw);
    if (parsed && !seen.includes(parsed.word)) return { ...parsed, source: "ai" };
  }
  return { ...pickFallback(seen), source: "fallback" };
}
