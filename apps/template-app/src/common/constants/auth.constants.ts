export const AUTH_CONSTANTS = {
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY_DAYS: 7,
    REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
    COOKIE_PATH: "/auth/refresh",
    COOKIE_NAME: "refresh_token",
} as const;
