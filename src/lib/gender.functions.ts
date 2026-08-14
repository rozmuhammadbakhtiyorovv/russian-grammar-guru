import { createServerFn } from "@tanstack/react-start";
import { generateWord } from "./gender.server";
import type { GenderWord } from "./gender.types";

export type { Gender, GenderWord } from "./gender.types";

export const generateGenderWord = createServerFn({ method: "POST" })
  .inputValidator((input: { exclude?: string[] }) => ({
    exclude: (input?.exclude ?? []).slice(0, 40).map(String),
  }))
  .handler(
    async ({ data }): Promise<GenderWord & { source: "ai" | "fallback" }> =>
      generateWord(data.exclude),
  );
