export interface Enviroments {
    PUBLIC_NAME_APP: string;
    PUBLIC_ENV: "production" | "development";
    PUBLIC_URL: string;
    PUBLIC_PORT: number;
    // notificaciones push
    PUBLIC_PLUBIC_VAPID_KEY: string;
    PUBLIC_PRIVATE_VAPID_KEY: string;
}
