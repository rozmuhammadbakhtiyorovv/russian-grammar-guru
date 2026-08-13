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
  { upper: "А", lower: "а", name: "а", kind: "vowel", sound: "[a]", info: "Твёрдая гласная, как «a» в «father».", example: "арбуз — watermelon" },
  { upper: "Б", lower: "б", name: "бэ", kind: "consonant", sound: "[b]", info: "Звонкий согласный, как «b» в «boy».", example: "банан — banana" },
  { upper: "В", lower: "в", name: "вэ", kind: "consonant", sound: "[v]", info: "Звонкий согласный, как «v» в «voice».", example: "вода — water" },
  { upper: "Г", lower: "г", name: "гэ", kind: "consonant", sound: "[g]", info: "Звонкий согласный, как «g» в «go».", example: "город — city" },
  { upper: "Д", lower: "д", name: "дэ", kind: "consonant", sound: "[d]", info: "Звонкий согласный, как «d» в «door».", example: "дом — house" },
  { upper: "Е", lower: "е", name: "е", kind: "vowel", sound: "[je]", info: "Мягкая гласная — смягчает согласный перед собой.", example: "ель — fir tree" },
  { upper: "Ё", lower: "ё", name: "ё", kind: "vowel", sound: "[jo]", info: "Мягкая гласная, всегда под ударением.", example: "ёж — hedgehog" },
  { upper: "Ж", lower: "ж", name: "жэ", kind: "consonant", sound: "[ʐ]", info: "Всегда твёрдый согласный, как «s» в «pleasure».", example: "жизнь — life" },
  { upper: "З", lower: "з", name: "зэ", kind: "consonant", sound: "[z]", info: "Звонкий согласный, как «z» в «zoo».", example: "зима — winter" },
  { upper: "И", lower: "и", name: "и", kind: "vowel", sound: "[i]", info: "Мягкая гласная, как «ee» в «see».", example: "игра — game" },
  { upper: "Й", lower: "й", name: "и краткое", kind: "consonant", sound: "[j]", info: "Полугласный звук, как «y» в «boy».", example: "чай — tea" },
  { upper: "К", lower: "к", name: "ка", kind: "consonant", sound: "[k]", info: "Глухой согласный, как «k» в «kite».", example: "кот — cat" },
  { upper: "Л", lower: "л", name: "эль", kind: "consonant", sound: "[l]", info: "Звонкий согласный, тяжелее английского «l».", example: "лампа — lamp" },
  { upper: "М", lower: "м", name: "эм", kind: "consonant", sound: "[m]", info: "Звонкий согласный, как «m» в «map».", example: "мама — mom" },
  { upper: "Н", lower: "н", name: "эн", kind: "consonant", sound: "[n]", info: "Звонкий согласный, как «n» в «no».", example: "ночь — night" },
  { upper: "О", lower: "о", name: "о", kind: "vowel", sound: "[o]", info: "Твёрдая гласная; без ударения звучит как [a].", example: "окно — window" },
  { upper: "П", lower: "п", name: "пэ", kind: "consonant", sound: "[p]", info: "Глухой согласный, как «p» в «spot».", example: "парк — park" },
  { upper: "Р", lower: "р", name: "эр", kind: "consonant", sound: "[r]", info: "Раскатистый согласный — язык вибрирует.", example: "рука — hand" },
  { upper: "С", lower: "с", name: "эс", kind: "consonant", sound: "[s]", info: "Глухой согласный, как «s» в «sun».", example: "стол — table" },
  { upper: "Т", lower: "т", name: "тэ", kind: "consonant", sound: "[t]", info: "Глухой согласный, как «t» в «stop».", example: "театр — theatre" },
  { upper: "У", lower: "у", name: "у", kind: "vowel", sound: "[u]", info: "Твёрдая гласная, как «oo» в «boot».", example: "утро — morning" },
  { upper: "Ф", lower: "ф", name: "эф", kind: "consonant", sound: "[f]", info: "Глухой согласный, как «f» в «fine».", example: "фильм — film" },
  { upper: "Х", lower: "х", name: "ха", kind: "consonant", sound: "[x]", info: "Глухой согласный, как «ch» в «Bach».", example: "хлеб — bread" },
  { upper: "Ц", lower: "ц", name: "цэ", kind: "consonant", sound: "[ts]", info: "Всегда твёрдый, как «ts» в «cats».", example: "цветок — flower" },
  { upper: "Ч", lower: "ч", name: "че", kind: "consonant", sound: "[tɕ]", info: "Всегда мягкий, как «ch» в «cheese».", example: "чай — tea" },
  { upper: "Ш", lower: "ш", name: "ша", kind: "consonant", sound: "[ʂ]", info: "Всегда твёрдый, как «sh» в «shop».", example: "школа — school" },
  { upper: "Щ", lower: "щ", name: "ща", kind: "consonant", sound: "[ɕː]", info: "Всегда мягкий и долгий «шь».", example: "щенок — puppy" },
  { upper: "Ъ", lower: "ъ", name: "твёрдый знак", kind: "sign", sound: "—", info: "Не имеет звука: разделяет приставку и корень.", example: "объект — object" },
  { upper: "Ы", lower: "ы", name: "ы", kind: "vowel", sound: "[ɨ]", info: "Твёрдая гласная, только после твёрдых согласных.", example: "сыр — cheese" },
  { upper: "Ь", lower: "ь", name: "мягкий знак", kind: "sign", sound: "—", info: "Не имеет звука: смягчает предыдущий согласный.", example: "соль — salt" },
  { upper: "Э", lower: "э", name: "э", kind: "vowel", sound: "[e]", info: "Твёрдая гласная, как «e» в «met».", example: "этаж — floor" },
  { upper: "Ю", lower: "ю", name: "ю", kind: "vowel", sound: "[ju]", info: "Мягкая гласная — смягчает согласный перед собой.", example: "юг — south" },
  { upper: "Я", lower: "я", name: "я", kind: "vowel", sound: "[ja]", info: "Мягкая гласная — смягчает согласный перед собой.", example: "яблоко — apple" },
];