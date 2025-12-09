import {
    McpServer,
    ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ============================================
// 🚀 MI PRIMER SERVIDOR MCP
// ============================================
// Este servidor expone:
// - 1 Resource: información del proyecto
// - 2 Tools: saludar y calcular
// ============================================

// Crear instancia del servidor
const server = new McpServer({
    name: "mi-primer-servidor",
    version: "1.0.0",
});

// ============================================
// 📁 RESOURCES - Datos que el cliente puede leer
// ============================================

// Resource estático: información del proyecto
server.resource("project-info", "project://info", async (uri) => ({
    contents: [
        {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
                {
                    nombre: "Mi Primer Servidor MCP",
                    autor: "Tu nombre aquí",
                    version: "1.0.0",
                    descripcion: "Un servidor MCP de ejemplo para aprender",
                    fecha: new Date().toISOString(),
                },
                null,
                2
            ),
        },
    ],
}));

// Resource dinámico con template
server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                mimeType: "text/plain",
                text: `¡Hola, ${name}! Bienvenido a MCP 🚀`,
            },
        ],
    })
);

// ============================================
// 🔧 TOOLS - Funciones que el LLM puede ejecutar
// ============================================

// Tool 1: Saludar
server.tool(
    "saludar",
    "Genera un saludo personalizado para una persona",
    {
        nombre: z.string().describe("Nombre de la persona a saludar"),
        idioma: z
            .enum(["es", "en", "fr"])
            .default("es")
            .describe("Idioma del saludo"),
    },
    async ({ nombre, idioma }) => {
        const saludos = {
            es: `¡Hola, ${nombre}! ¿Cómo estás?`,
            en: `Hello, ${nombre}! How are you?`,
            fr: `Bonjour, ${nombre}! Comment ça va?`,
        };

        return {
            content: [
                {
                    type: "text" as const,
                    text: saludos[idioma],
                },
            ],
        };
    }
);

// Tool 2: Calculadora simple
server.tool(
    "calcular",
    "Realiza operaciones matemáticas básicas",
    {
        operacion: z
            .enum(["sumar", "restar", "multiplicar", "dividir"])
            .describe("Operación a realizar"),
        a: z.number().describe("Primer número"),
        b: z.number().describe("Segundo número"),
    },
    async ({ operacion, a, b }) => {
        let resultado: number;
        let simbolo: string;

        switch (operacion) {
            case "sumar":
                resultado = a + b;
                simbolo = "+";
                break;
            case "restar":
                resultado = a - b;
                simbolo = "-";
                break;
            case "multiplicar":
                resultado = a * b;
                simbolo = "×";
                break;
            case "dividir":
                if (b === 0) {
                    return {
                        content: [
                            {
                                type: "text" as const,
                                text: "❌ Error: No se puede dividir por cero",
                            },
                        ],
                        isError: true,
                    };
                }
                resultado = a / b;
                simbolo = "÷";
                break;
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `🧮 ${a} ${simbolo} ${b} = ${resultado}`,
                },
            ],
        };
    }
);

// Tool 3: Obtener fecha y hora actual
server.tool(
    "fecha_hora",
    "Obtiene la fecha y hora actual en diferentes formatos",
    {
        formato: z
            .enum(["completo", "fecha", "hora", "iso"])
            .default("completo")
            .describe("Formato de salida"),
    },
    async ({ formato }) => {
        const ahora = new Date();

        const formatos = {
            completo: ahora.toLocaleString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            fecha: ahora.toLocaleDateString("es-ES"),
            hora: ahora.toLocaleTimeString("es-ES"),
            iso: ahora.toISOString(),
        };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `📅 ${formatos[formato]}`,
                },
            ],
        };
    }
);

// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================

async function main() {
    // Usar transporte stdio para comunicación
    const transport = new StdioServerTransport();

    // Conectar servidor al transporte
    await server.connect(transport);

    // Log a stderr (no interfiere con stdio)
    console.error("🚀 Servidor MCP iniciado correctamente");
    console.error("📁 Resources: project-info, greeting://{name}");
    console.error("🔧 Tools: saludar, calcular, fecha_hora");
}

main().catch((error) => {
    console.error("❌ Error al iniciar servidor:", error);
    process.exit(1);
});
