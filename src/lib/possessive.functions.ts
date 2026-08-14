import { createServerFn } from "@tanstack/react-start";
import { generatePossessive } from "./possessive.server";
import type { PossessiveTask } from "./possessive.types";

export type { PossessiveTask } from "./possessive.types";

export const generatePossessiveTask = createServerFn({ method: "POST" })
  .inputValidator((input: { exclude?: string[] }) => ({
    exclude: (input?.exclude ?? []).slice(0, 20).map(String),
  }))
  .handler(
    async ({ data }): Promise<PossessiveTask & { source: "ai" | "fallback" }> =>
      generatePossessive(data.exclude),
  );
