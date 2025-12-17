import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Simula un navegador (DOM) para que funcionen los componentes de React/Preact
        environment: "jsdom",
        // Archivo de configuración inicial (opcional, pero recomendado)
        setupFiles: [
            path.join(
                __dirname,
                "src",
                "infrastructure",
                "config",
                "server",
                "setup-test.ts"
            ),
        ],
        include: ["**/*.e2e.test.ts", "**/*.test.ts"],
        globals: true, // Permite usar describe, it, expect sin importar
        pool: "forks", // Necesario para que esbuild/astro funcionen bien
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/modules/**/*.ts"],
            exclude: [
                "**/*.dto.ts",
                "**/*.schema.ts",
                "**/*.module.ts",
                "**/index.ts",
                "**/*.interface.ts",
            ],
        },
    },
    resolve: {
        alias: {
            "@modules": path.join(__dirname, "src", "modules"),
            "@infrastructure": path.join(__dirname, "src", "infrastructure"),
            "@assets": path.join(__dirname, "src", "assets"),
            "@components": path.join(__dirname, "src", "components"),
            "@hooks": path.join(__dirname, "src", "hooks"),
            "@stores": path.join(__dirname, "src", "stores"),
            "@src": path.join(__dirname, "src"),
        },
    },
});
