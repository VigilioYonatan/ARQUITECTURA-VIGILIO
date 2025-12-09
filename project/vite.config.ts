/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";
import dotenv from "dotenv";
import tailwindcss from "@tailwindcss/vite";
import swc from "unplugin-swc";
dotenv.config({ path: ".env" });

export default defineConfig({
    plugins: [
        tailwindcss(),
        // liveReload([path.resolve(__dirname, "./src/views/**/*.html")]),
        // million.vite({ auto: true }),
        preact(),
        swc.vite(),
    ],
    root: "src",
    resolve: {
        // RESOURCES ALIAS
        alias: {
            "@": path.resolve(__dirname, "src", "services"),
            "~": path.resolve(__dirname, "src"),
        },
    },
    test: {
        environment: "jsdom", // o 'node' si no usas React
        globals: true,
        coverage: {
            provider: "v8", // usa @vitest/coverage-v8
            reporter: ["text", "json", "html"], // genera reporte en consola, JSON y HTML
            reportsDirectory: path.resolve(__dirname, "coverage"), // carpeta destino
            exclude: [
                "node_modules/",
                "dist/",
                "vite.config.ts",
                "**/*.e2e.test.ts",
            ],
        },
        setupFiles: "./src/config/test/setup-test.ts",
        include: ["**/*.test.ts"],
        exclude: [
            "**/*.e2e.test.ts",
            "node_modules/",
            "dist/",
            "vite.config.ts",
            "vitest.e2e.config.ts",
        ],
        alias: {
            "@": path.resolve(__dirname, "src", "services"),
            "~": path.resolve(__dirname, "src"),
        },
    },
    base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
    build: {
        outDir: path.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "src", "pages", "main.tsx"),
            output: {
                manualChunks(id) {
                    // separa dependencias de node_modules en un chunk vendor
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
        watch: {
            usePolling: true, // docker
        },
    },
});
