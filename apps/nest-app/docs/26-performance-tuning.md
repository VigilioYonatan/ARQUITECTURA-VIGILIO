# 🏎️ Performance Tuning

Cómo hacer que tu NestJS vuele. 🚀

## 1. Fastify (vs Express)

Por defecto Nest usa Express. **Fastify** es hasta 2x más rápido.

```typescript
// main.ts
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
```

> [!NOTE]
> Cuidado con librerías de Express (middleares antiguos) que podrían no ser compatibles con Fastify.

## 2. Serialización

Usa `fast-json-stringify` si necesitas exprimir milisegundos en endpoints con JSONs enormes.

## 3. Compresión

Activa `gzip` para reducir el tamaño del payload.

```typescript
import compression from 'compression';
app.use(compression());
```

## 4. Lazy Loading Modules

Si tienes una app monolítica gigante (Serverless), cargar todos los módulos al inicio es lento (Cold Start). Puedes cargar módulos bajo demanda.

```typescript
// Solo carga HeroesService cuando se invoca la ruta, no al bootear.
const { HeroesService } = await import('./heroes.service');
```

## 💡 Best Practices

1.  **Profile First**: No optimices a ciegas. Usa las herramientas de Profile de Node.js o Chrome DevTools (`--inspect`) para ver dónde está el cuello de botella real.
2.  **Caching is King**: La base de datos es siempre lo más lento. Usa `@nestjs/cache-manager` con Redis para cachear respuestas frecuentes y evitar tocar la DB.
3.  **Non-Blocking**: Node.js es monohilo. Nunca hagas cálculos matemáticos pesados (CPU bound) en el hilo principal. Usa `Worker Threads` para eso.
