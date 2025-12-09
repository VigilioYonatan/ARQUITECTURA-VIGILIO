/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "node:path";
import dotenv from "dotenv";
import swc from "unplugin-swc";
dotenv.config({ path: ".env" });

// only end to end test
export default defineConfig({
    plugins: [swc.vite()],
    test: {
        globals: true,
        include: ["**/*.e2e.test.ts"],
        alias: {
            "@": path.resolve(__dirname, "src", "services"),
            "~": path.resolve(__dirname, "src"),
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src", "services"),
            "~": path.resolve(__dirname, "src"),
        },
    },
    root: ".",
});
