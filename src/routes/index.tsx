import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "russian.pro grammar game — Learn Russian grammar by playing" },
      {
        name: "description",
        content:
          "AI-powered Russian grammar games organized by CEFR level: alphabet cards, gender practice and more from A1 to C2.",
      },
      { property: "og:title", content: "russian.pro grammar game" },
      {
        property: "og:description",
        content: "AI-powered Russian grammar games from A1 to C2.",
      },
    ],
  }),
  component: Index,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];

type Game = {
  title: string;
  subtitle: string;
  description: string;
  to?: string;
  accent: "vowel" | "consonant";
};

const GAMES: Record<Level, Game[]> = {
  A1: [
    {
      title: "Алфавит",
      subtitle: "The Russian alphabet",
      description:
        "33 буквы в карточках. Гласные — красные, согласные — синие. Нажми, чтобы услышать звук.",
      to: "/a1/alphabet",
      accent: "vowel",
    },
    {
      title: "Род",
      subtitle: "Noun gender",
      description:
        "ИИ придумывает слово уровня A1 — выбери мужской, женский или средний род.",
      to: "/a1/gender",
      accent: "consonant",
    },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
};

function Index() {
  const [level, setLevel] = useState<Level>("A1");
  const games = GAMES[level];

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-12">
      <header className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-muted-foreground">
          AI powered
        </p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">
          russian<span className="text-primary">.pro</span> grammar game
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Учи русскую грамматику через игру — от алфавита до сложных конструкций.
        </p>
      </header>

      <nav
        aria-label="CEFR levels"
        className="mt-10 flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur"
      >
        {LEVELS.map((item) => {
          const active = item === level;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              aria-current={active ? "page" : undefined}
              className={`font-display min-w-[72px] rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {games.length === 0 ? (
          <div className="sm:col-span-2 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Игры уровня {level} скоро появятся.
          </div>
        ) : (
          games.map((game) => (
            <Link
              key={game.title}
              to={game.to!}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/60"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 ${
                  game.accent === "vowel" ? "bg-vowel" : "bg-consonant"
                }`}
              />
              <h2 className="text-2xl font-bold">{game.title}</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {game.subtitle}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{game.description}</p>
              <p className="font-display mt-6 text-sm font-bold text-primary">
                Играть →
              </p>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}