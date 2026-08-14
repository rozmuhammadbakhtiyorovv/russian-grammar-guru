import { createServerFn } from "@tanstack/react-start";
import { generateGenitive } from "./genitive.server";
import type { GenitiveTask } from "./genitive.types";

export type { GenitiveTask } from "./genitive.types";

export const generateGenitiveTask = createServerFn({ method: "POST" })
  .inputValidator((input: { exclude?: string[] }) => ({
    exclude: (input?.exclude ?? []).slice(0, 20).map(String),
  }))
  .handler(
    async ({ data }): Promise<GenitiveTask & { source: "ai" | "fallback" }> =>
      generateGenitive(data.exclude),
  );
