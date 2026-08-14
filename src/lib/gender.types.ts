export type Gender = "мужской" | "женский" | "средний";

export type GenderWord = {
  word: string;
  gender: Gender;
  translation: string;
  hint: string;
};
