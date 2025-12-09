// src/services/newsletterService.ts

// Esta lógica es 100% reutilizable.
// No importa "astro:actions", ni "Next.js", ni "Express".
// Puedes copiar y pegar este archivo en cualquier otro backend.

export const newsletterService = {
    async subscribe(email: string, name: string) {
        // Simulación de retardo de red
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validaciones de negocio (independientes del framework)
        if (email.includes("error")) {
            throw new Error("Error de negocio: Email bloqueado");
        }

        // Aquí iría la llamada a la DB real
        console.log(`[SERVICE] Guardando en DB: ${name} (${email})`);

        return {
            id: Math.floor(Math.random() * 1000),
            status: "subscribed",
            createdAt: new Date(),
        };
    },
};
