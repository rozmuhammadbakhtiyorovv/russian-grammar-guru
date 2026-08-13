export type LetterKind = "vowel" | "consonant" | "sign";

export type RussianLetter = {
  upper: string;
  lower: string;
  name: string;
  kind: LetterKind;
  sound: string;
  info: string;
  example: string;
};

export const RUSSIAN_ALPHABET: RussianLetter[] = [
  { upper: "А", lower: "а", name: "а", kind: "vowel", sound: "[a]", info: "Qattiq unli, inglizcha «father» dagi «a» kabi.", example: "арбуз — tarvuz" },
  { upper: "Б", lower: "б", name: "бэ", kind: "consonant", sound: "[b]", info: "Jarangli undosh, «b» tovushi.", example: "банан — banan" },
  { upper: "В", lower: "в", name: "вэ", kind: "consonant", sound: "[v]", info: "Jarangli undosh, «v» tovushi.", example: "вода — suv" },
  { upper: "Г", lower: "г", name: "гэ", kind: "consonant", sound: "[g]", info: "Jarangli undosh, «g» tovushi.", example: "город — shahar" },
  { upper: "Д", lower: "д", name: "дэ", kind: "consonant", sound: "[d]", info: "Jarangli undosh, «d» tovushi.", example: "дом — uy" },
  { upper: "Е", lower: "е", name: "е", kind: "vowel", sound: "[je]", info: "Yumshoq unli — oldingi undoshni yumshatadi.", example: "ель — archa" },
  { upper: "Ё", lower: "ё", name: "ё", kind: "vowel", sound: "[jo]", info: "Yumshoq unli, doim urg‘u ostida.", example: "ёж — kirpi" },
  { upper: "Ж", lower: "ж", name: "жэ", kind: "consonant", sound: "[ʐ]", info: "Doim qattiq undosh, «j» tovushi.", example: "жизнь — hayot" },
  { upper: "З", lower: "з", name: "зэ", kind: "consonant", sound: "[z]", info: "Jarangli undosh, «z» tovushi.", example: "зима — qish" },
  { upper: "И", lower: "и", name: "и", kind: "vowel", sound: "[i]", info: "Yumshoq unli, cho‘ziq «i» tovushi.", example: "игра — o‘yin" },
  { upper: "Й", lower: "й", name: "и краткое", kind: "consonant", sound: "[j]", info: "Yarim unli, «y» tovushi.", example: "чай — choy" },
  { upper: "К", lower: "к", name: "ка", kind: "consonant", sound: "[k]", info: "Jarangsiz undosh, «k» tovushi.", example: "кот — mushuk" },
  { upper: "Л", lower: "л", name: "эль", kind: "consonant", sound: "[l]", info: "Jarangli undosh, ingliz «l» dan qattiqroq.", example: "лампа — chiroq" },
  { upper: "М", lower: "м", name: "эм", kind: "consonant", sound: "[m]", info: "Jarangli undosh, «m» tovushi.", example: "мама — ona" },
  { upper: "Н", lower: "н", name: "эн", kind: "consonant", sound: "[n]", info: "Jarangli undosh, «n» tovushi.", example: "ночь — tun" },
  { upper: "О", lower: "о", name: "о", kind: "vowel", sound: "[o]", info: "Qattiq unli; urg‘usiz holda [a] kabi eshitiladi.", example: "окно — deraza" },
  { upper: "П", lower: "п", name: "пэ", kind: "consonant", sound: "[p]", info: "Jarangsiz undosh, «p» tovushi.", example: "парк — park" },
  { upper: "Р", lower: "р", name: "эр", kind: "consonant", sound: "[r]", info: "Titroq undosh — til tebranadi.", example: "рука — qo‘l" },
  { upper: "С", lower: "с", name: "эс", kind: "consonant", sound: "[s]", info: "Jarangsiz undosh, «s» tovushi.", example: "стол — stol" },
  { upper: "Т", lower: "т", name: "тэ", kind: "consonant", sound: "[t]", info: "Jarangsiz undosh, «t» tovushi.", example: "театр — teatr" },
  { upper: "У", lower: "у", name: "у", kind: "vowel", sound: "[u]", info: "Qattiq unli, «u» tovushi.", example: "утро — tong" },
  { upper: "Ф", lower: "ф", name: "эф", kind: "consonant", sound: "[f]", info: "Jarangsiz undosh, «f» tovushi.", example: "фильм — film" },
  { upper: "Х", lower: "х", name: "ха", kind: "consonant", sound: "[x]", info: "Jarangsiz undosh, «x» tovushi.", example: "хлеб — non" },
  { upper: "Ц", lower: "ц", name: "цэ", kind: "consonant", sound: "[ts]", info: "Doim qattiq, «ts» tovushi.", example: "цветок — gul" },
  { upper: "Ч", lower: "ч", name: "че", kind: "consonant", sound: "[tɕ]", info: "Doim yumshoq, «ch» tovushi.", example: "чай — choy" },
  { upper: "Ш", lower: "ш", name: "ша", kind: "consonant", sound: "[ʂ]", info: "Doim qattiq, «sh» tovushi.", example: "школа — maktab" },
  { upper: "Щ", lower: "щ", name: "ща", kind: "consonant", sound: "[ɕː]", info: "Doim yumshoq va cho‘ziq «sh» tovushi.", example: "щенок — kuchukcha" },
  { upper: "Ъ", lower: "ъ", name: "твёрдый знак", kind: "sign", sound: "—", info: "Tovushi yo‘q: old qo‘shimcha bilan o‘zakni ajratadi.", example: "объект — obyekt" },
  { upper: "Ы", lower: "ы", name: "ы", kind: "vowel", sound: "[ɨ]", info: "Qattiq unli, faqat qattiq undoshlardan keyin keladi.", example: "сыр — pishloq" },
  { upper: "Ь", lower: "ь", name: "мягкий знак", kind: "sign", sound: "—", info: "Tovushi yo‘q: oldingi undoshni yumshatadi.", example: "соль — tuz" },
  { upper: "Э", lower: "э", name: "э", kind: "vowel", sound: "[e]", info: "Qattiq unli, «e» tovushi.", example: "этаж — qavat" },
  { upper: "Ю", lower: "ю", name: "ю", kind: "vowel", sound: "[ju]", info: "Yumshoq unli — oldingi undoshni yumshatadi.", example: "юг — janub" },
  { upper: "Я", lower: "я", name: "я", kind: "vowel", sound: "[ja]", info: "Yumshoq unli — oldingi undoshni yumshatadi.", example: "яблоко — olma" },
];
