import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: [".env"] });

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/**/*.entity.ts",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});
