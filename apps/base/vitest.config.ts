import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Simula un navegador (DOM) para que funcionen los componentes de React/Preact
        environment: "jsdom",
        // Archivo de configuración inicial (opcional, pero recomendado)
        setupFiles: ["./src/infrastructure/config/setup-test.ts"],
        globals: true, // Permite usar describe, it, expect sin importar
        pool: "forks", // Necesario para que esbuild/astro funcionen bien
        alias: {
            "@modules": "./src/modules",
            "@infrastructure": "./src/infrastructure",
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@hooks": "./src/hooks",
            "@stores": "./src/stores",
            "@src": "./src",
        },
    },
});
