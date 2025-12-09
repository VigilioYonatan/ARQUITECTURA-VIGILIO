# 🏗️ Estructura del Proyecto NestJS

NestJS tiene una estructura opinada pero flexible que facilita la escalabilidad. Entender cómo arranca y se organiza es el primer paso para dominarlo.

## 🚀 El Punto de Entrada (`main.ts`)

Es el archivo que "enciende" la aplicación. Utiliza `NestFactory` para crear una instancia de la aplicación Nest.

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Crea la aplicación usando el módulo raíz
  const app = await NestFactory.create(AppModule);

  // Define un prefijo global para las rutas (opcional pero recomendado en APIs)
  app.setGlobalPrefix('api/v1');

  // Escucha en el puerto 3000
  await app.listen(3000);
}
bootstrap();
```

> [!TIP]
> **Pro Tip**: Mantén el `main.ts` limpio. Solo config global (CORS, Swagger, Pipes globales) debe ir aquí. No metas lógica de negocio.

## 📦 El Módulo Raíz (`app.module.ts`)

Es el cerebro central que une todas las piezas. NestJS organiza el código en **Módulos**. El `AppModule` es el módulo principal del cual cuelgan todos los demás.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'; // Importamos módulos de características

@Module({
  imports: [UsersModule], // Aquí se registran otros módulos
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## 📂 Convenciones de Carpetas (Best Practices)

Una estructura limpia separa responsabilidades:

```text
src/
├── main.ts           # Entry point
├── app.module.ts     # Root module
├── common/           # Decoradores, filtros, guards compartidos
│   ├── filters/
│   └── guards/
└── users/            # Módulo de "Feature" (Usuarios)
    ├── dto/          # Data Transfer Objects (validación de entrada)
    ├── entities/     # Modelos de base de datos
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts
```

> [!NOTE]
> NestJS usa el patrón **Kebab-case** para nombres de archivos (`users.controller.ts`) y **PascalCase** para clases (`UsersController`).

## 🧠 ¿Qué pasa al hacer `npm run start`?

1.  Node ejecuta `main.ts`.
2.  `NestFactory.create(AppModule)` inicializa el contenedor de Inyección de Dependencias (IoC).
3.  Nest escanea `AppModule` y sus `imports`.
4.  Resuelve todas las dependencias (Servicios, Controllers) y levanta el servidor HTTP.
