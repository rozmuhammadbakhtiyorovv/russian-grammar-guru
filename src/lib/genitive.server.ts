import { callAI, parseJson, shuffle } from "./ai.server";
import type { GenitiveTask } from "./genitive.types";

const FALLBACK: Omit<GenitiveTask, "options">[] = [
  { question: "У кого?", clue: "Улика №1: на месте преступления нашли крошки пирога.", sentence: "У ___ есть большая собака.", base: "брат", answer: "брата", translation: "My brother has a big dog. / Akamda katta it bor.", hint: "«У кого?» — roditelniy padej: брат → брата." },
  { question: "У кого?", clue: "Улика №2: кто-то оставил красный зонт у двери.", sentence: "У ___ красный зонт.", base: "сестра", answer: "сестры", translation: "My sister has a red umbrella. / Opamda qizil soyabon bor.", hint: "-а → -ы: сестра → сестры." },
  { question: "Кого?", clue: "Свидетель говорит, что видел кого-то в парке.", sentence: "Я вижу ___ в парке.", base: "кот", answer: "кота", translation: "I see the cat in the park. / Men parkda mushukni ko‘ryapman.", hint: "«Кого?» jonli mujskoy: кот → кота." },
  { question: "Кого?", clue: "Соседка ждала кого-то весь вечер.", sentence: "Она ждёт ___ дома.", base: "мама", answer: "маму", translation: "She is waiting for mom at home. / U uyda onasini kutyapti.", hint: "«Кого?» -а → -у: мама → маму." },
  { question: "У кого?", clue: "Улика №3: чёрная кошка сидела на окне.", sentence: "У ___ живёт чёрная кошка.", base: "друг", answer: "друга", translation: "My friend has a black cat. / Do‘stimda qora mushuk yashaydi.", hint: "друг → друга." },
  { question: "Кого?", clue: "Детектив ищет главного подозреваемого.", sentence: "Полиция ищет ___.", base: "вор", answer: "вора", translation: "The police are looking for the thief. / Politsiya o‘g‘rini qidiryapti.", hint: "вор → вора." },
  { question: "У кого?", clue: "Улика №4: на столе стоял пустой стакан молока.", sentence: "У ___ есть молоко.", base: "бабушка", answer: "бабушки", translation: "Grandma has milk. / Buvimda sut bor.", hint: "-ка → -ки: бабушка → бабушки." },
  { question: "Кого?", clue: "Кто-то громко звал по имени.", sentence: "Он зовёт ___.", base: "сын", answer: "сына", translation: "He is calling his son. / U o‘g‘lini chaqiryapti.", hint: "сын → сына." },
];

const SYSTEM =
  "Ты — весёлый детектив, который учит русскому языку уровня A1 (вопросы «У кого?» и «Кого?», родительный и винительный падеж людей и животных). " +
  "Верни ТОЛЬКО JSON без markdown: " +
  '{"question":"У кого?"|"Кого?","clue":"смешная фраза детектива по-русски (1 предложение)","sentence":"простое предложение с ___ вместо слова","base":"слово в именительном падеже","answer":"правильная форма слова","wrong":["неправильная форма","неправильная форма"],"translation":"english / uzbek tarjima","hint":"qisqa izoh o‘zbek tilida"}. ' +
  "Предложение A1, 3-5 слов, ровно один пропуск ___ . Неправильные формы — реальные падежные формы того же слова.";

function withOptions(task: Omit<GenitiveTask, "options">, wrong?: string[]): GenitiveTask {
  const base = wrong?.length
    ? wrong
    : [task.base, task.answer.endsWith("а") ? `${task.answer.slice(0, -1)}у` : `${task.base}у`];
  const distractors = base.filter((w) => w && w !== task.answer).slice(0, 2);
  return { ...task, options: shuffle([task.answer, ...distractors]) };
}

function pickFallback(exclude: string[]): GenitiveTask {
  const pool = FALLBACK.filter((t) => !exclude.includes(t.sentence));
  const list = pool.length > 0 ? pool : FALLBACK;
  return withOptions(list[Math.floor(Math.random() * list.length)]!, undefined);
}

export async function generateGenitive(
  exclude: string[],
): Promise<GenitiveTask & { source: "ai" | "fallback" }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await callAI(
      SYSTEM,
      `Новая улика! Не повторяй эти предложения: ${
        exclude.join(" | ") || "нет"
      }. Придумай смешную детективную ситуацию.`,
    );
    if (raw === null) break;
    const parsed = parseJson<GenitiveTask & { wrong?: string[] }>(raw);
    const sentence = String(parsed?.sentence ?? "").trim();
    const answer = String(parsed?.answer ?? "").toLowerCase().trim();
    const base = String(parsed?.base ?? "").toLowerCase().trim();
    if (!sentence.includes("___") || !answer || !base) continue;
    if (exclude.includes(sentence)) continue;
    const question = parsed?.question === "Кого?" ? "Кого?" : "У кого?";
    const task = withOptions(
      {
        question,
        clue: String(parsed?.clue ?? "").trim(),
        sentence,
        base,
        answer,
        translation: String(parsed?.translation ?? "").trim(),
        hint: String(parsed?.hint ?? "").trim(),
      },
      (parsed?.wrong ?? []).map((w) => String(w).toLowerCase().trim()),
    );
    if (task.options.length < 2) continue;
    return { ...task, source: "ai" };
  }
  return { ...pickFallback(exclude), source: "fallback" };
}
