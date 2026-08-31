import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/drizzle",
  schema: "./db/schema/index.ts",
  dialect: "postgresql",

  schemaFilter: ["public"],
  tablesFilter: [
    "!pg_stat_statements",
    "!pg_stat_statements_info",
    "*",
  ],

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});