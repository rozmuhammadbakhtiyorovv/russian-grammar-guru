import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RUSSIAN_ALPHABET, type LetterKind } from "@/data/alphabet";

export const Route = createFileRoute("/a1/alphabet")({
  head: () => ({
    meta: [
      { title: "Алфавит — A1 Russian alphabet game | russian.pro" },
      {
        name: "description",
        content:
          "Learn all 33 Russian letters: vowels in red, consonants in blue. Click a card to hear the letter, hover for pronunciation notes.",
      },
      { property: "og:title", content: "Алфавит — Russian alphabet game" },
      {
        property: "og:description",
        content: "Hear every Russian letter and learn vowels vs consonants.",
      },
    ],
  }),
  component: AlphabetGame,
});

const KIND_LABEL: Record<LetterKind, string> = {
  vowel: "Гласная",
  consonant: "Согласная",
  sign: "Знак",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.rate = 0.8;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("ru"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function AlphabetGame() {
  const [active, setActive] = useState<string | null>(null);
  const counts = useMemo(
    () => ({
      vowel: RUSSIAN_ALPHABET.filter((l) => l.kind === "vowel").length,
      consonant: RUSSIAN_ALPHABET.filter((l) => l.kind === "consonant").length,
    }),
    [],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Назад
      </Link>

      <header className="mt-6">
        <h1 className="text-4xl font-black sm:text-5xl">Алфавит</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Нажми на букву, чтобы услышать её. Наведи курсор, чтобы узнать подробности.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full bg-vowel-soft px-3 py-1 font-bold text-vowel">
            Гласные — {counts.vowel}
          </span>
          <span className="rounded-full bg-consonant-soft px-3 py-1 font-bold text-consonant">
            Согласные — {counts.consonant}
          </span>
          <span className="rounded-full bg-sign-soft px-3 py-1 font-bold text-sign">
            Знаки — 2
          </span>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {RUSSIAN_ALPHABET.map((letter) => {
          const tone =
            letter.kind === "vowel"
              ? "border-vowel/40 bg-vowel-soft text-vowel hover:border-vowel"
              : letter.kind === "consonant"
                ? "border-consonant/40 bg-consonant-soft text-consonant hover:border-consonant"
                : "border-sign/40 bg-sign-soft text-sign hover:border-sign";
          const isActive = active === letter.upper;

          return (
            <div key={letter.upper} className="group relative">
              <button
                type="button"
                onClick={() => {
                  setActive(letter.upper);
                  speak(letter.lower);
                }}
                onFocus={() => setActive(letter.upper)}
                onMouseEnter={() => setActive(letter.upper)}
                aria-label={`Буква ${letter.upper}, ${KIND_LABEL[letter.kind]}`}
                className={`font-display flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 transition-all hover:-translate-y-1 active:scale-95 ${tone} ${
                  isActive ? "-translate-y-1 shadow-lg" : ""
                }`}
              >
                <span className="text-2xl font-black sm:text-3xl">
                  {letter.upper} {letter.lower}
                </span>
                <span className="mt-1 text-[10px] font-medium opacity-80">
                  {letter.sound}
                </span>
              </button>

              <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-56 -translate-x-1/2 translate-y-2 rounded-xl border border-border bg-popover p-3 text-left shadow-xl group-hover:block group-focus-within:block">
                <p className="font-display text-sm font-bold text-popover-foreground">
                  {letter.upper} {letter.lower} — «{letter.name}»
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {KIND_LABEL[letter.kind]} · {letter.sound}
                </p>
                <p className="mt-2 text-xs text-popover-foreground">{letter.info}</p>
                <p className="mt-2 text-xs text-muted-foreground">{letter.example}</p>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}