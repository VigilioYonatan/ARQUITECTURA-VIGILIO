import { z } from "@infrastructure/config/zod-i18n.config";
import dotenv from "dotenv";

dotenv.config({ debug: false, path: [".env"] });

// ============================================================================
// SCHEMA DE VALIDACIÓN CON ZOD
// ============================================================================

/**
 * Schema de validación para variables de entorno.
 * Usa z.coerce para conversión automática de tipos.
 */
export const environmentsSchema = z
    .object({
        // App
        PUBLIC_NAME_APP: z.string().min(1).default("MyApp"),
        NODE_ENV: z
            .enum(["production", "development", "staging", "test"])
            .default("development"),
        PUBLIC_URL: z.url(),
        PUBLIC_PORT: z.coerce.number().int().positive(),
        PORT: z.coerce.number().int().positive().default(3000),

        // Database
        DB_HOST: z.string().min(1),
        DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
        DB_NAME: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_PASS: z.string().min(1),
        DATABASE_URL: z
            .string()
            .min(1)
            .refine(
                (url) => url.startsWith("postgres"),
                "DATABASE_URL debe ser una URL de PostgreSQL"
            ),

        // Cache (Redis/Dragonfly)
        REDIS_HOST: z.string().min(1).default("localhost"),
        REDIS_PORT: z.coerce.number().int().positive().default(6379),
        REDIS_PASSWORD: z.string().optional(),

        // JWT - SEGURIDAD CRÍTICA
        JWT_KEY: z
            .string()
            .min(32, "JWT_KEY debe tener al menos 32 caracteres"),
        JWT_EXPIRES_IN: z.string().default("1h"),
        JWT_REFRESH_KEY: z.string().min(32).optional(),
        JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

        // HMAC
        PUBLIC_HMAC_KEY: z
            .string()
            .min(16, "HMAC_KEY debe tener al menos 16 caracteres"),

        // Storage (MinIO/RustFS)
        RUSTFS_ENDPOINT: z.string().min(1),
        RUSTFS_PORT: z.coerce.number().int().positive().default(9000),
        RUSTFS_ROOT_USER: z.string().min(1),
        RUSTFS_ROOT_PASSWORD: z.string().min(8),
        RUSTFS_BUCKET_NAME: z.string().min(1),
        RUSTFS_REGION: z.string().default("us-east-1"),
        RUSTFS_INTERNAL_ENDPOINT: z.string().url().optional(),
        RUSTFS_PUBLIC_ENDPOINT: z.string().url().optional(),

        // Mail
        MAIL_HOST: z.string().min(1),
        MAIL_PORT: z.coerce.number().int().positive().default(587),
        MAIL_USER: z.string().min(1),
        MAIL_PASS: z.string().min(1),
        MAIL_FROM: z.email().optional(),
        MAIL_FROM_NAME: z.string().optional(),

        // Security extras
        CORS_ORIGINS: z.string().default("*"),
        THROTTLE_TTL: z.coerce.number().int().positive().default(60),
        THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
        LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    })
    .refine(
        (data) => {
            // En producción, passwords de Redis y refresh key son obligatorios
            if (data.NODE_ENV === "production") {
                return !!data.REDIS_PASSWORD && !!data.JWT_REFRESH_KEY;
            }
            return true;
        },
        {
            message:
                "REDIS_PASSWORD y JWT_REFRESH_KEY son obligatorios en producción",
        }
    );

// ============================================================================
// TIPOS INFERIDOS DEL SCHEMA
// ============================================================================

/** Tipo inferido automáticamente del schema Zod */
export type Environments = z.infer<typeof environmentsSchema>;

/** Modos de Node.js disponibles */
export type NodeMode = Environments["NODE_ENV"];

// ============================================================================
// CACHE DE ENVIRONMENTS VALIDADOS
// ============================================================================

let cachedEnvironments: Environments | null = null;

/**
 * Obtiene las variables de entorno validadas.
 * Usa cache para evitar re-validación en cada llamada.
 *
 * @throws {Error} Si las variables de entorno son inválidas
 * @returns {Environments} Variables de entorno tipadas y validadas
 */
export function getEnvironments(): Environments {
    if (cachedEnvironments) {
        return cachedEnvironments;
    }

    const result = environmentsSchema.safeParse(process.env);

    if (!result.success) {
        // NO loggear valores para evitar exponer secrets
        const missingVars = result.error.issues.map((issue) => {
            const path = issue.path.join(".");
            return `  - ${path}: ${issue.message}`;
        });

        // biome-ignore lint/suspicious/noConsole: Necesario para errores críticos
        console.error(
            `\n❌ Variables de entorno inválidas:\n${missingVars.join("\n")}\n`
        );
        process.exit(1);
    }

    cachedEnvironments = result.data;
    return cachedEnvironments;
}

/**
 * Valida las variables de entorno al iniciar la aplicación.
 * Debe llamarse antes de inicializar NestJS.
 */
export function validateEnvironments(): void {
    const env = getEnvironments();
    const mode = env.NODE_ENV;

    // biome-ignore lint/suspicious/noConsole: Log informativo de inicio
    console.log(`✅ [ENVIRONMENTS] Validado correctamente (${mode})`);
}

/**
 * Retorna las variables de entorno para ConfigModule de NestJS.
 * Compatible con ConfigModule.forRoot({ load: [environments] })
 */
export default function environments(): Environments {
    return getEnvironments();
}
