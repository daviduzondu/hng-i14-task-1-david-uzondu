import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CORS_ORIGIN: z.url().or(z.literal("*")),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});