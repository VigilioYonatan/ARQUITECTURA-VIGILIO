# ⚙️ Configuración (ConfigModule)

Nunca guardes secretos (API Keys, contraseñas de DB) en el código. Usa variables de entorno (`.env`).

## 🛠️ Setup

```bash
npm install @nestjs/config
```

En `app.module.ts`:

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Para no tener que importarlo en cada módulo
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
```

## 🔌 Usando variables

Inyecta `ConfigService` donde lo necesites:

```typescript
// auth.service.ts
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  getJwtSecret() {
    // 💡 Tip: Puedes usar genéricos para autocompletado si tienes una interfaz custom
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no configurado!');
    }
    return secret;
  }
}
```

## 💡 Validación de Esquema (Joi)

Es buena práctica validar que las variables de entorno existan AL ARRANCAR la app, para que falle rápido si falta algo crítico.

```typescript
// app.module.ts
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    PORT: Joi.number().default(3000),
  }),
});
```

## 💡 Best Practices

1.  **Tipado Fuerte**: Crea una interfaz `EnvironmentVariables` para que `configService.get('PORT')` sepa que es un número.
2.  **Secretos en Vault**: Para producción enterprise, considera soluciones como AWS Secrets Manager en lugar de archivos `.env`.
3.  **Default Values**: Siempre provee valores por defecto seguros para variables no críticas.
