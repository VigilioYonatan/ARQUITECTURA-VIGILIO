import {
    custom,
    literal,
    object,
    safeParse,
    string,
    union,
} from "@vigilio/valibot";
import dotenv from "dotenv";

dotenv.config({ path: [".env"], debug: false });

type NodeMode = "production" | "development" | "test";
export interface Enviroments {
    PUBLIC_NAME_APP: string;
    NODE_ENV: NodeMode;
    PUBLIC_URL: string;
    PUBLIC_PORT: string;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
    DATABASE_URL: string;
    JWT_KEY: string;
    // upload
    MINIO_ENDPOINT: string;
    MINIO_PORT: number;
    MINIO_ROOT_USER: string;
    MINIO_ROOT_PASSWORD: string;
    MINIO_BUCKET_NAME: string;
    MINIO_REGION: string;
    // mail
    PUBLIC_HMAC_KEY: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    // cache
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
}

function enviroments(): Enviroments {
    return {
        PUBLIC_NAME_APP: process.env.PUBLIC_NAME_APP as string,
        NODE_ENV: process.env.NODE_ENV! as NodeMode,
        PORT: Number(process.env.PORT!),
        PUBLIC_URL: process.env.PUBLIC_URL!,
        PUBLIC_PORT: process.env.PUBLIC_PORT!,

        // db
        DB_HOST: process.env.DB_HOST!,
        DB_PORT: Number(process.env.DB_PORT)!,
        DB_NAME: process.env.DB_NAME!,
        DB_USER: process.env.DB_USER!,
        DB_PASS: process.env.DB_PASS!,
        DATABASE_URL: process.env.DATABASE_URL!,

        // cache
        REDIS_HOST: process.env.REDIS_HOST!,
        REDIS_PORT: Number(process.env.REDIS_PORT!),
        REDIS_PASSWORD: process.env.REDIS_PASSWORD!,

        // jwt
        JWT_KEY: process.env.JWT_KEY!,

        // upload
        MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
        MINIO_PORT: Number(process.env.MINIO_PORT!),
        MINIO_ROOT_USER: process.env.MINIO_ROOT_USER!,
        MINIO_ROOT_PASSWORD: process.env.MINIO_ROOT_PASSWORD!,
        MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME!,
        MINIO_REGION: process.env.MINIO_REGION!,

        // mail
        PUBLIC_HMAC_KEY: process.env.PUBLIC_HMAC_KEY!,
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
    PUBLIC_ENV: union(
        [literal("production"), literal("development"), literal("test")],
        "development"
    ),
    PUBLIC_URL: string(),
    PUBLIC_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
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

    // cache
    REDIS_HOST: string(),
    REDIS_PORT: string([custom((val) => !Number.isNaN(Number(val)))]),
    REDIS_PASSWORD: string(),

    // jwt
    JWT_KEY: string(),
    PUBLIC_HMAC_KEY: string(),

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
        console.error(
            "❌ Invalid environment variables:",
            data.issues.map((issue) => issue.message).join("\n")
        );
        process.exit(1);
    }
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log("[ENVIRONMENTS]: Funcionando correctamente");
}
export default enviroments;
