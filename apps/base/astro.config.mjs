/// <reference types="vitest/config" />
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
// https://astro.build/config

export default defineConfig({
    output: "server",
    integrations: [preact()],
    adapter: node({ mode: "middleware" }),
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@modules": "./src/modules",
                "@infrastructure": "./src/infrastructure",
                "@assets": "./src/assets",
                "@components": "./src/components",
                "@hooks": "./src/hooks",
                "@stores": "./src/stores",
                "@src": "./src",
            },
            preserveSymlinks: true,
        },
        server: {
            watch: {
                ignored: [
                    "**/node_modules/**",
                    "**/dist/**",
                    "**/src/**/*.controller.ts",
                    "**/src/**/*.service.ts",
                    "**/src/**/*.module.ts",
                ],
                usePolling: true,
                // interval: 100,
                // binaryInterval: 3000,
            },
            host: true,
            // hmr: {
            //     clientPort: 3000, // O el puerto que expongas en tu PC
            // },
        },
    },
    test: {
        // Simula un navegador (DOM) para que funcionen los componentes de React/Preact
        environment: "jsdom",
        // Archivo de configuración inicial (opcional, pero recomendado)
        setupFiles: ["./src/infrastructure/config/setup-test.ts"],
        globals: true, // Permite usar describe, it, expect sin importar
        pool: "forks", // Necesario para que esbuild/astro funcionen bien
    },
    server: {
        port: Number(process.env.VITE_PORT),
    },
});
