import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env" });

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/**/*.entity.ts",
	out: "./drizzle/migrations",
	dbCredentials: {
		url: `postgresql://localhost:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
	},
	verbose: true,
	strict: true,
});
