# 🎛️ Módulos Dinámicos (Dynamic Modules)

Los **Módulos Dinámicos** son una feature poderosa de NestJS que permiten crear módulos "configurables".

## 🤔 ¿Cuál es el problema con los Módulos Estáticos?

Un **Módulo Estático** (`@Module({...})`) es fijo. No puedes pasarle parámetros.
Imagina un `DatabaseModule`. Si fuera estático, tendrías que "quemar" la URL de conexión dentro del código del módulo. Pero, ¿qué pasa si quieres usar una DB distinta para Test y otra para Prod?

## 💡 La Solución: Módulos Dinámicos

Permiten pasar una configuración _antes_ de que el módulo se cree. En lugar de importar la clase directa, llamas a un método estático (usualmente `forRoot` o `register`) que devuelve el módulo configurado.

### Ejemplo: ConfigModule

```typescript
// app.module.ts
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    // ¡Aquí estamos configurando el módulo!
    ConfigModule.forRoot({
      envFilePath: '.env.production',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## 🏗️ ¿Cómo se crea uno?

En lugar de solo decorar la clase, defines un método estático que retorna un `DynamicModule`.

```typescript
// database.module.ts
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class DatabaseModule {
  // El nombre 'forRoot' es convención, podría llamarse 'connect' o 'register'
  static forRoot(connectionString: string): DynamicModule {
    return {
      module: DatabaseModule, // El módulo "real"
      providers: [
        {
          provide: 'CONNECTION_STRING',
          useValue: connectionString, // Inyectamos el valor que nos pasaron
        },
        DatabaseService, // El servicio que usará esa conexión
      ],
      exports: [DatabaseService], // Exportamos lo que sea útil
    };
  }
}
```

## 🔄 `forRoot` vs `forFeature`

Es una convención de nombres muy usada (inspirada en Angular):

1.  **`forRoot`**: Se usa **una sola vez** en el `AppModule` (o el módulo raíz). Configura el módulo de forma global (ej. Conexión a la Base de Datos).
2.  **`forFeature`**: Se usa en **módulos de características** (`UsersModule`, `ProductsModule`). Configura cosas específicas para ese módulo usando la configuración global base (ej. Registrar la entidad `User` o el repositorio `UserRepository`).

### Ejemplo con TypeORM:

```typescript
// app.module.ts
TypeOrmModule.forRoot({ ...configGlobalDeLaDB... })

// users.module.ts
TypeOrmModule.forFeature([User]) // Aquí solo registramos la entidad User
```

## 💡 Best Practices

1.  **Async Registration**: Implementa siempre `forRootAsync`. Es vital para cargar configuraciones que vienen de bases de datos o secretos asíncronos en el arranque.
2.  **Config Interface**: Define una interfaz estricta para las opciones de tu módulo (`MyModuleOptions`), no uses `any`.
3.  **Global vs Scoped**: Evita hacer módulos `isGlobal: true` por pereza. El encapsulamiento hace que el código sea más mantenible a largo plazo.
