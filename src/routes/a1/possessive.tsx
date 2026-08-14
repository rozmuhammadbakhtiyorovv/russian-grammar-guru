import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { generatePossessiveTask, type PossessiveTask } from "@/lib/possessive.functions";

export const Route = createFileRoute("/a1/possessive")({
  head: () => ({
    meta: [
      { title: "Притяжательные местоимения — A1 drag & drop game | russian.pro" },
      {
        name: "description",
        content:
          "Duolingo-style drag & drop game: put мой, твоя, наше or их into the blank of AI-generated A1 Russian sentences.",
      },
      { property: "og:title", content: "Притяжательные местоимения — Russian A1 game" },
      {
        property: "og:description",
        content: "Drag the right possessive pronoun into the blank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PossessiveGame,
});

function PossessiveGame() {
  const fetchTask = useServerFn(generatePossessiveTask);
  const [task, setTask] = useState<PossessiveTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [placed, setPlaced] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const seen = useRef<string[]>([]);

  const nextTask = useCallback(async () => {
    setLoading(true);
    setPlaced(null);
    setChecked(false);
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

  const check = () => {
    if (!placed || !task || checked) return;
    setChecked(true);
    setScore((s) => ({
      correct: s.correct + (placed === task.answer ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const isCorrect = checked && placed === task?.answer;
  const [before, after] = (task?.sentence ?? "").split("___");

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
        <h1 className="text-3xl font-black sm:text-4xl">Притяжательные местоимения</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          To‘g‘ri so‘zni bo‘sh joyga sudrab tashlang (yoki ustiga bosing).
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-border bg-card p-8">
        {loading ? (
          <p className="font-display animate-pulse py-8 text-center text-xl text-muted-foreground">
            ИИ придумывает предложение…
          </p>
        ) : (
          <>
            <p className="font-display flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center text-2xl font-bold sm:text-3xl">
              <span>{before}</span>
              <span
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (!checked) setPlaced(e.dataTransfer.getData("text/plain"));
                }}
                onClick={() => !checked && setPlaced(null)}
                className={`inline-flex min-w-[8rem] items-center justify-center rounded-xl border-2 border-dashed px-4 py-2 transition-colors ${
                  checked
                    ? isCorrect
                      ? "border-success bg-success/15 text-success"
                      : "border-destructive bg-destructive/15 text-destructive"
                    : dragOver
                      ? "border-primary bg-primary/10"
                      : placed
                        ? "border-accent bg-secondary"
                        : "border-border text-muted-foreground"
                }`}
              >
                {placed ?? "···"}
              </span>
              <span>{after}</span>
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {task?.options.map((option) => {
                const used = placed === option;
                return (
                  <button
                    key={option}
                    type="button"
                    draggable={!checked}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", option)}
                    disabled={checked}
                    onClick={() => setPlaced(option)}
                    className={`font-display cursor-grab rounded-xl border-2 px-5 py-3 text-lg font-bold transition-all active:cursor-grabbing disabled:cursor-default ${
                      used
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card hover:-translate-y-0.5 hover:border-accent"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {!checked ? (
        <button
          type="button"
          disabled={!placed || loading}
          onClick={check}
          className="font-display mt-5 w-full rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Проверить
        </button>
      ) : (
        <section className="mt-5 rounded-2xl border border-border bg-card p-5 text-center">
          <p className="font-display text-lg font-bold">
            {isCorrect ? "Правильно! 🎉" : `Ошибка — правильно: ${task?.answer}`}
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
            Следующее предложение →
          </button>
        </section>
      )}
    </main>
  );
}
