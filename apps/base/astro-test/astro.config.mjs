import path from "node:path";
import { fileURLToPath } from "node:url";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import dotenv from "dotenv";

dotenv.config({ path: [".env"] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    output: "server",
    integrations: [preact({ compat: true })],
    env: {
        schema: {
            PUBLIC_NAME_APP: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_ENV: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_URL: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_PORT: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_HMAC_KEY: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_VAPID_EMAIL: envField.string({
                context: "client",
                access: "public",
            }),
            PUBLIC_VAPID_KEY: envField.string({
                context: "client",
                access: "public",
            }),
        },
    },
    adapter: node({ mode: "middleware" }),
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@modules": path.join(__dirname, "src", "modules"),
                "@infrastructure": path.join(
                    __dirname,
                    "src",
                    "infrastructure"
                ),
                "@assets": path.join(__dirname, "src", "assets"),
                "@components": path.join(__dirname, "src", "components"),
                "@hooks": path.join(__dirname, "src", "hooks"),
                "@stores": path.join(__dirname, "src", "stores"),
                "@src": path.join(__dirname, "src"),
            },
            // preserveSymlinks: true,
        },
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "tap", // Prefetch en el tap (clic) para mejorar UX
    },
    test: {
        // Simula un navegador (DOM) para que funcionen los componentes de React/Preact
        environment: "jsdom",
        // Archivo de configuración inicial (opcional, pero recomendado)
        setupFiles: [
            path.resolve(
                __dirname,
                "./src/infrastructure/config/server/setup-test.ts"
            ),
        ],
        globals: true, // Permite usar describe, it, expect sin importar
        pool: "forks", // Necesario para que esbuild/astro funcionen bien
    },
    server: {
        port: Number(process.env.PUBLIC_PORT),
    },
});
