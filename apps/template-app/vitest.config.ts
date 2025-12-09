import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

export default defineConfig({
    test: {
        include: ["**/*.test.ts"],
        globals: true,
        root: "./",
        alias: {
            "@src": "./src",
        },
    },
    plugins: [
        swc.vite({
            module: { type: "es6" },
        }),
    ],
});
