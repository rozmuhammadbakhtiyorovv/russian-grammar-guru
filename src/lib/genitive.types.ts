export type GenitiveTask = {
  question: "У кого?" | "Кого?";
  clue: string;
  sentence: string;
  base: string;
  answer: string;
  options: string[];
  translation: string;
  hint: string;
};
