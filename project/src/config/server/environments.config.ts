import {
    custom,
    literal,
    object,
    safeParse,
    string,
    union,
} from "@vigilio/valibot";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

type NodeMode = "production" | "development" | "test";
export interface Enviroments {
    VITE_EMPRESA: string;
    VITE_NAME_APP: string;
    NODE_ENV: NodeMode;
    VITE_ENV: NodeMode;
    VITE_URL: string;
    VITE_PORT: string;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
    JWT_KEY: string;
    // upload
    MINIO_ENDPOINT: string;
    MINIO_PORT: number;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;
    MINIO_BUCKET: string;
    MINIO_REGION: string;
    // mail
    VITE_HMAC_KEY: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS: string;
}

function enviroments(): Enviroments {
    return {
        VITE_EMPRESA: process.env.VITE_EMPRESA as string,
        VITE_NAME_APP: process.env.VITE_NAME_APP as string,
        NODE_ENV: process.env.NODE_ENV! as NodeMode,
        VITE_ENV: process.env.VITE_ENV! as NodeMode,
        PORT: Number(process.env.PORT!),
        VITE_URL: process.env.VITE_URL!,
        VITE_PORT: process.env.VITE_PORT!,

        // db
        DB_HOST: process.env.DB_HOST!,
        DB_PORT: Number(process.env.DB_PORT)!,
        DB_NAME: process.env.DB_NAME!,
        DB_USER: process.env.DB_USER!,
        DB_PASS: process.env.DB_PASS!,

        // jwt
        JWT_KEY: process.env.JWT_KEY!,
        // upload
        MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
        MINIO_PORT: Number(process.env.MINIO_PORT!),
        MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
        MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
        MINIO_BUCKET: process.env.MINIO_BUCKET!,
        MINIO_REGION: process.env.MINIO_REGION!,
        // mail
        VITE_HMAC_KEY: process.env.VITE_HMAC_KEY!,
        MAIL_HOST: process.env.MAIL_HOST!,
        MAIL_PORT: process.env.MAIL_PORT!,
        MAIL_USER: process.env.MAIL_USER!,
        MAIL_PASS: process.env.MAIL_PASS!,
    };
}

const environmentsSchema = object({
    NODE_ENV: union(
        [literal("production"), literal("development"), literal("test")],
        "development"
    ),
    VITE_ENV: union(
        [literal("production"), literal("development"), literal("test")],
        "development"
    ),
    VITE_URL: string(),
    VITE_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
    PORT: string([custom((val) => !Number.isNaN(Number(val)))]),

    // db
    DB_HOST: string(),
    DB_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
    DB_NAME: string(),
    DB_USER: string(),
    DB_PASS: string(),

    // minio
    MINIO_ENDPOINT: string(),
    MINIO_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
    MINIO_ACCESS_KEY: string(),
    MINIO_SECRET_KEY: string(),
    MINIO_BUCKET: string(),
    MINIO_REGION: string(),

    // jwt
    JWT_KEY: string(),
    VITE_HMAC_KEY: string(),

    // mail
    MAIL_HOST: string(),
    MAIL_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
    MAIL_USER: string(),
    MAIL_PASS: string(),
});

export async function validateEnvironments() {
    const data = await safeParse(environmentsSchema, environmentsSchema);
    if (!data.success) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.log("[ENVIRONMENTS]: Funcionando correctamente");
        return;
    }
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error("❌ Invalid environment variables:", data.output);
    process.exit(1);
}
export default enviroments;
