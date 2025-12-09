import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const server = {
    newsletter: {
        subscribe: defineAction({
            accept: "form", // Permite usarlo con <form> nativo o JS
            input: z.object({
                email: z.string().email({ message: "Email inválido" }),
                name: z.string().min(2, { message: "Nombre muy corto" }),
            }),
            handler: async ({ email, name }, context) => {
                // Simulación de retardo de red
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Aquí iría la lógica de DB (Prisma, Drizzle, etc.)
                console.log(`Nuevo suscriptor: ${name} (${email})`);

                if (email.includes("error")) {
                    throw new Error("Error simulado de base de datos");
                }

                return {
                    success: true,
                    id: Math.floor(Math.random() * 1000),
                    message: `¡Gracias ${name}! Te has suscrito correctamente.`,
                };
            },
        }),
    },
};
