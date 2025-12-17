import environments from "@infrastructure/config/server/environments.config";
import { cacheTimes } from "@infrastructure/libs/server/helpers";
import type { INestApplication } from "@nestjs/common";
import * as connectRedis from "connect-redis";
// import { RedisStore } from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import * as passport from "passport";

export function setupSession(app: INestApplication) {
    const redisClient = new Redis({
        host: environments().REDIS_HOST,
        port: environments().REDIS_PORT,
        // password: enviroments().REDIS_PASSWORD || undefined,
    });
    const store = new connectRedis.RedisStore({
        client: redisClient,
        prefix: "sess:",
    });

    app.use(
        session({
            store,
            secret: environments().JWT_KEY,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            proxy: environments().NODE_ENV === "production",
            cookie: {
                secure: environments().NODE_ENV === "production",
                httpOnly: environments().NODE_ENV === "production",
                maxAge: cacheTimes.days3 * 1000, // 3 days
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
}
