import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateGenderWord, type Gender, type GenderWord } from "@/lib/gender.functions";

export const Route = createFileRoute("/a1/gender")({
  head: () => ({
    meta: [
      { title: "Род — A1 Russian noun gender game | russian.pro" },
      {
        name: "description",
        content:
          "AI generates A1 Russian nouns and you guess the gender: masculine, feminine or neuter. Instant feedback and grammar hints.",
      },
      { property: "og:title", content: "Род — Russian noun gender game" },
      {
        property: "og:description",
        content: "Guess masculine, feminine or neuter for AI-generated A1 nouns.",
      },
    ],
  }),
  component: GenderGame,
});

const OPTIONS: { value: Gender; label: string; en: string }[] = [
  { value: "мужской", label: "Мужской род", en: "masculine" },
  { value: "женский", label: "Женский род", en: "feminine" },
  { value: "средний", label: "Средний род", en: "neuter" },
];

function GenderGame() {
  const fetchWord = useServerFn(generateGenderWord);
  const [current, setCurrent] = useState<GenderWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState<Gender | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const seen = useRef<string[]>([]);

  const nextWord = useCallback(async () => {
    setLoading(true);
    setAnswer(null);
    try {
      const word = await fetchWord({ data: { exclude: seen.current.slice(-30) } });
      seen.current = [...seen.current, word.word];
      setCurrent(word);
    } finally {
      setLoading(false);
    }
  }, [fetchWord]);

  useEffect(() => {
    void nextWord();
  }, [nextWord]);

  const choose = (value: Gender) => {
    if (answer || !current) return;
    setAnswer(value);
    setScore((s) => ({
      correct: s.correct + (value === current.gender ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const isCorrect = answer !== null && current !== null && answer === current.gender;

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Назад
        </Link>
        <p className="font-display text-sm font-bold">
          {score.correct}
          <span className="text-muted-foreground"> / {score.total}</span>
        </p>
      </div>

      <header className="mt-6">
        <h1 className="text-4xl font-black sm:text-5xl">Род</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ИИ придумывает слово — определи его род.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
        {loading ? (
          <p className="font-display animate-pulse py-6 text-2xl text-muted-foreground">
            ИИ придумывает слово…
          </p>
        ) : (
          <>
            <p className="font-display text-4xl font-black sm:text-5xl">{current?.word}</p>
            {answer && current?.translation ? (
              <p className="mt-2 text-sm text-muted-foreground">{current.translation}</p>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-5 grid gap-3">
        {OPTIONS.map((option) => {
          const chosen = answer === option.value;
          const reveal = answer !== null && current?.gender === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={loading || answer !== null}
              onClick={() => choose(option.value)}
              className={`font-display rounded-2xl border-2 px-6 py-5 text-left text-lg font-bold transition-all disabled:cursor-default ${
                reveal
                  ? "border-success bg-success/15 text-success"
                  : chosen
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-accent"
              }`}
            >
              {option.label}
              <span className="ml-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {option.en}
              </span>
            </button>
          );
        })}
      </section>

      {answer ? (
        <section className="mt-5 rounded-2xl border border-border bg-card p-5 text-center">
          <p className="font-display text-lg font-bold">
            {isCorrect ? "Правильно! 🎉" : "Ошибка"}
          </p>
          {current?.hint ? (
            <p className="mt-2 text-sm text-muted-foreground">{current.hint}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void nextWord()}
            className="font-display mt-4 w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Следующее слово →
          </button>
        </section>
      ) : null}
    </main>
  );
}