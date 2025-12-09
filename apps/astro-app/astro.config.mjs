// @ts-check
import { defineConfig, envField } from "astro/config";

import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";

import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), preact()],

    adapter: node({
        mode: "standalone",
    }),
    trailingSlash: "always", // Asegura que todas las URLs terminen en /
    vite: {
        plugins: [tailwindcss()],
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "tap", // Prefetch en el tap (clic) para mejorar UX
    },
    i18n: {
        defaultLocale: "es",
        locales: ["es", "en"],
        routing: {
            prefixDefaultLocale: false, // No prefijo /es/ o /en/
        },
    },
    env: {
        schema: {
            API_SECRET: envField.string({
                context: "server",
                access: "secret",
                default: "dev_secret_123",
            }),
            DATABASE_URL: envField.string({
                context: "server",
                access: "secret",
                optional: true,
            }),
            PUBLIC_SITE_NAME: envField.string({
                context: "client",
                access: "public",
                default: "Mi Astro SaaS",
            }),
        },
    },
});
