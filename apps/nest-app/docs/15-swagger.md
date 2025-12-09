# 📄 Swagger (OpenAPI)

NestJS tiene una integración increíble con Swagger. Puede generar documentación interactiva automáticamente leyendo tus DTOs y decoradores.

## 🛠️ Setup

```bash
npm install @nestjs/swagger swagger-ui-express
```

En `main.ts`:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mi API NestJS')
    .setDescription('Documentación automática')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth() // Soporte para botón "Authorize" con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Docs en /api

  await app.listen(3000);
}
```

## 📝 Documentando DTOs

Para que Swagger muestre los esquemas de tus objetos, usa sus decoradores (similares a class-validator pero para docs).

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Pepe', description: 'El nombre del usuario' })
  name: string;

  @ApiProperty({ example: 'pepe@mail.com' })
  email: string;
}
```

Ahora entra a `http://localhost:3000/api` y verás tu documentación profesional.

## 💡 Best Practices

1.  **CLI Plugin**: Instalar `@nestjs/swagger/plugin` en tu `nest-cli.json` hace que no tengas que escribir `@ApiProperty` manualmente en cada campo. Nest lo deduce del tipo de TS automáticamente. ¡Ahorra horas!
2.  **Ocultar Endpoints**: Usa `@ApiExcludeController()` o `@ApiExcludeEndpoint()` para rutas internas o de admin que no quieres exponer públicamente en los docs.
