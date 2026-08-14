import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateGenitiveTask, type GenitiveTask } from "@/lib/genitive.functions";

export const Route = createFileRoute("/a1/detective")({
  head: () => ({
    meta: [
      { title: "У кого? Кого? — Russian detective case game | russian.pro" },
      {
        name: "description",
        content:
          "Solve funny AI-generated detective clues and pick the right Russian case form for У кого? and Кого? questions.",
      },
      { property: "og:title", content: "У кого? Кого? — Russian detective game" },
      {
        property: "og:description",
        content: "Crack the case by choosing the correct Russian noun form.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DetectiveGame,
});

function DetectiveGame() {
  const fetchTask = useServerFn(generateGenitiveTask);
  const [task, setTask] = useState<GenitiveTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const seen = useRef<string[]>([]);

  const nextTask = useCallback(async () => {
    setLoading(true);
    setAnswer(null);
    try {
      const next = await fetchTask({ data: { exclude: seen.current.slice(-15) } });
      seen.current = [...seen.current, next.sentence];
      setTask(next);
    } finally {
      setLoading(false);
    }
  }, [fetchTask]);

  useEffect(() => {
    void nextTask();
  }, [nextTask]);

  const choose = (value: string) => {
    if (answer || !task) return;
    setAnswer(value);
    setScore((s) => ({
      correct: s.correct + (value === task.answer ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const isCorrect = answer !== null && answer === task?.answer;
  const [before, after] = (task?.sentence ?? "").split("___");

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Назад
        </Link>
        <p className="font-display text-sm font-bold">
          🔍 {score.correct}
          <span className="text-muted-foreground"> / {score.total}</span>
        </p>
      </div>

      <header className="mt-6">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Дело о пропавшем пироге 🥧
        </p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">У кого? Кого?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Detektivga yordam bering: har bir ulikada to‘g‘ri so‘z shaklini tanlang.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-border bg-card p-8">
        {loading ? (
          <p className="font-display animate-pulse py-8 text-center text-xl text-muted-foreground">
            🕵️ Детектив ищет новую улику…
          </p>
        ) : (
          <>
            <p className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
              🕵️ {task?.clue}
            </p>
            <p className="font-display mt-3 text-center text-xs font-bold uppercase tracking-widest text-primary">
              {task?.question} · {task?.base}
            </p>
            <p className="font-display mt-4 text-center text-2xl font-bold sm:text-3xl">
              {before}
              <span
                className={`mx-1 inline-block min-w-[6rem] rounded-xl border-2 border-dashed px-3 py-1 ${
                  answer
                    ? isCorrect
                      ? "border-success bg-success/15 text-success"
                      : "border-destructive bg-destructive/15 text-destructive"
                    : "border-border text-muted-foreground"
                }`}
              >
                {answer ?? "···"}
              </span>
              {after}
            </p>
          </>
        )}
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {task?.options.map((option) => {
          const chosen = answer === option;
          const reveal = answer !== null && task.answer === option;
          return (
            <button
              key={option}
              type="button"
              disabled={loading || answer !== null}
              onClick={() => choose(option)}
              className={`font-display rounded-2xl border-2 px-5 py-5 text-lg font-bold transition-all disabled:cursor-default ${
                reveal
                  ? "border-success bg-success/15 text-success"
                  : chosen
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-accent"
              }`}
            >
              {option}
            </button>
          );
        })}
      </section>

      {answer ? (
        <section className="mt-5 rounded-2xl border border-border bg-card p-5 text-center">
          <p className="font-display text-lg font-bold">
            {isCorrect ? "Улика раскрыта! 🎉" : "Мимо, детектив 🔎"}
          </p>
          {task?.translation ? (
            <p className="mt-2 text-sm text-muted-foreground">{task.translation}</p>
          ) : null}
          {task?.hint ? (
            <p className="mt-1 text-sm text-muted-foreground">{task.hint}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void nextTask()}
            className="font-display mt-4 w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Следующая улика →
          </button>
        </section>
      ) : null}
    </main>
  );
}
