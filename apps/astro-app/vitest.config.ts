/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
    test: {
        // Simula un navegador (DOM) para que funcionen los componentes de React/Preact
        environment: "jsdom",
        // Archivo de configuración inicial (opcional, pero recomendado)
        setupFiles: ["./src/test/setup.ts"],
        globals: true, // Permite usar describe, it, expect sin importar
        pool: "forks", // Necesario para que esbuild/astro funcionen bien
    },
});
