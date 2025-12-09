import { object, string, parse, minLength, enum_ } from "@vigilio/valibot";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision",
}

const envSchema = object({
    NODE_ENV: enum_(Environment),
    PORT: string(),
    POSTGRES_HOST: string(),
    POSTGRES_PORT: string(),
    POSTGRES_USER: string(),
    POSTGRES_PASSWORD: string(),
    POSTGRES_DB: string(),
    REDIS_HOST: string(),
    REDIS_PORT: string(),
    JWT_SECRET: string([minLength(1)]),
    MINIO_ENDPOINT: string(),
    MINIO_PORT: string(),
    MINIO_ACCESS_KEY: string(),
    MINIO_SECRET_KEY: string(),
    MINIO_BUCKET: string(),
    GOOGLE_CLIENT_ID: string(),
    GOOGLE_CLIENT_SECRET: string(),
    GOOGLE_CALLBACK_URL: string(),
});

export function validate(config: Record<string, unknown>) {
    return parse(envSchema, config);
}
