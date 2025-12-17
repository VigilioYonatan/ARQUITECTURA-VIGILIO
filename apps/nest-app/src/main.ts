import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Cliente Redis Optimizado para Dragonfly
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  // 2. Configurar Redis Session Store
  app.use(
    session({
      store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
      secret: process.env.SESSION_SECRET || 'super-complex-secret',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'sid', // Nombre de la cookie
      cookie: {
        secure: process.env.NODE_ENV === 'production', // true solo en HTTPS/Prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      },
    }),
  );

  // 3. Inicializar Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
