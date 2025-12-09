# Inyección de Dependencias y `@Inject()`

La inyección de dependencias es un patrón de diseño fundamental en NestJS. Normalmente, NestJS maneja esto automáticamente basándose en los tipos de TypeScript (inyección por constructor), pero hay casos donde necesitamos ser explícitos.

## ¿Qué es `@Inject()`?

`@Inject()` es un decorador que permite decirle a NestJS explícitamente **qué** dependencia debe inyectar en una propiedad o parámetro del constructor.

En la mayoría de los casos (cuando inyectas Servicios que son Clases), **NO** necesitas usar `@Inject()`, ya que NestJS usa el tipo de la variable para resolver la dependencia.

```typescript
// Casos normales: NO se necesita @Inject()
constructor(private readonly usersService: UsersService) {}
```

## ¿Cuándo se usa `@Inject()`?

Debes usar `@Inject()` cuando NestJS no puede determinar la dependencia solo por el tipo de TypeScript. Esto ocurre principalmente en 4 escenarios:

### 1. Inyección de Tokens Personalizados (Strings o Symbols)

Si registraste un proveedor usando un string o un symbol como token (en lugar de una clase), debes usar ese mismo token para inyectarlo.

**Registro (Module):**

```typescript
{
  provide: 'API_KEY', // ⚠️ Mala práctica: "Magic String"
  useValue: '12345abcdef',
}
```

**Uso (Service/Controller):**

```typescript
constructor(@Inject('API_KEY') private apiKey: string) {}
```

> **🔥 Best Practice:**
> ¡Tienes toda la razón! Usar strings sueltos ("magic strings") es propenso a errores humanos (typos).
> Lo correcto es crear un archivo de constantes.
>
> ```typescript
> // constants.ts
> export const API_KEY_TOKEN = 'API_KEY';
>
> // app.module.ts
> import { API_KEY_TOKEN } from './constants';
> { provide: API_KEY_TOKEN, useValue: '...' }
>
> // my.service.ts
> import { API_KEY_TOKEN } from './constants';
> constructor(@Inject(API_KEY_TOKEN) private apiKey: string) {}
> ```

### 2. Inyección de Interfaces

TypeScript elimina las interfaces durante la compilación. Si intentas inyectar usando una interface como tipo, NestJS no sabrá qué inyectar en tiempo de ejecución. Para resolver esto, se usa un token asociado a esa interface.

**Registro:**

```typescript
{
  provide: 'MAIL_STRATEGY', // Token
  useClass: SendGridService, // Implementación
}
```

**Uso:**

```typescript
// Error: Nest no sabe qué es 'IMailService' en runtime
// constructor(private mailService: IMailService) {}

// Correcto:
constructor(@Inject('MAIL_STRATEGY') private mailService: IMailService) {}
```

### 3. Inyección de Configuraciones (Objetos planos)

A veces quieres inyectar un objeto de configuración simple o una conexión externa que no es una clase instanciable por Nest.

```typescript
// config.module.ts
{
  provide: 'DATABASE_CONFIG',
  useFactory: () => ({ host: 'localhost', port: 5432 }),
}

// database.service.ts
constructor(@Inject('DATABASE_CONFIG') private dbConfig: Record<string, any>) {}
```

### 4. Dependencias Circulares

Cuando dos servicios dependen mutuamente el uno del otro (A necesita B, y B necesita A), se produce una referencia circular. Para resolver esto, se usa `@Inject()` junto con `forwardRef()`.

```typescript
constructor(
  @Inject(forwardRef(() => UsersService))
  private usersService: UsersService,
) {}
```

## Resumen

| Escenario                         | ¿Usar `@Inject()`?       |
| :-------------------------------- | :----------------------- |
| Inyectar un Service (Clase)       | ❌ No (automático)       |
| Inyectar un string/symbol         | ✅ Sí (obligatorio)      |
| Inyectar una Interface            | ✅ Sí (obligatorio)      |
| Inyectar una dependencia circular | ✅ Sí (con `forwardRef`) |

## 💡 Concepto: ¿Es igual a los Traits de PHP o Helpers?

**No, es muy diferente.**

Es común confundirse al principio, pero **Dependency Injection (DI)** es un patrón de **Arquitectura**, no solo de reutilización de código (como los Traits).

| Concepto          | PHP Traits / Helpers                                       | Dependency Injection (NestJS)                                            |
| :---------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Objetivo**      | "Copiar y pegar" métodos comunes para no repetir código.   | Desacoplar clases. "Yo no creo mis herramientas, me las dan".            |
| **Uso Principal** | Lógica genérica (Loggers, formatters) que no tiene estado. | **TODO**: Lógica de Negocio (UsersService), Repositorios, Conexiones DB. |
| **Testing**       | Difícil de mockear (están pegados a la clase).             | **Fácil de mockear**. Puedo pasar un "FakeService" en los tests.         |

**Ejemplo de la diferencia:**

- **Trait/Helper:** "Yo (Clase A) busco la función `formatDate` globalmente y la uso." (Dependencia oculta/rígida).
- **DI:** "Yo (Clase A) pido que alguien me pase un `DateProvider` en mi constructor. No sé cuál es, solo lo uso." (Inversión de Control).

En NestJS, **usamos DI para todo**, desde la lógica más crítica del negocio hasta simples utilidades.

## 🤔 Entonces, ¿está mal usar archivos `helpers.ts`?

Depende de lo que haga el helper. La regla de oro es:

### ✅ Sí, usa Helpers (funciones puras) cuando:

La función **solo** transforma datos y **siempre** devuelve lo mismo para la misma entrada (determinista). No toca base de datos, no llama APIs externas, no depende de configuración.

- `slugify(title: string)`
- `formatCurrency(amount: number)`
- `calculateAge(birthDate: Date)`

```typescript
// utils/format.helper.ts
export const formatCurrency = (val: number) => `$${val.toFixed(2)}`;
// Importar esto directamente está perfecto.
```

### ❌ No, usa Servicios (DI) cuando:

La lógica involucra efectos secundarios, configuración o dependencias externas.

- Hacer peticiones HTTP (¿Qué pasa si quieres mockear la API en tests?).
- Leer base de datos.
- Loggers (¿Quieres loguear a consola en dev y a Datadog en prod?).
- Funciones que dependen de `ConfigService` (API Keys, URLs).

En estos casos, **envuélvelo en un `@Injectable()`**.

## 🎓 Master Class: Anatomía de un Provider

Un Provider en NestJS no es más que un objeto que le dice al framework "Cuando alguien pida X, dale Y".
A veces usas la sintaxis corta, pero por debajo todo se convierte en esto:

```typescript
providers: [
  // Sintaxis Corta
  UsersService,

  // Sintaxis Real (Lo que Nest ve)
  {
    provide: UsersService, // Token (¿Qué pido?)
    useClass: UsersService, // Estrategia (¿Qué me das?)
  },
];
```

Aquí tienes el desglose de todas las estrategias (`use...`) y opciones:

### 1. `useClass` (El estándar)

Crea una instancia de la clase.

```typescript
{
  provide: 'EmailService',
  useClass: SendGridService // Crea "new SendGridService()"
}
```

### 2. `useValue` (Constantes)

Inyecta un valor fijo que ya existe. Útil para mocks en tests o configuraciones.

```typescript
{
  provide: 'API_URL',
  useValue: 'https://api.google.com'
}
```

### 3. `useFactory` (El más potente ⚡️)

Ejecuta una función para crear la dependencia. Puede ser síncrona o asíncrona.
Lo mejor es que puede recibir argumentos (`inject`).

```typescript
{
  provide: 'DATABASE_CONNECTION',
  // 'inject' lista los providers que la factory necesita
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const url = config.get('DB_URL');
    const connection = await createConnection(url);
    return connection;
  }
}
```

- `inject`: Arreglo de tokens que Nest resolverá y pasará como argumentos a tu función factory.

### 4. `useExisting` (Alias)

No crea nada nuevo, solo hace un "puntero" a otro provider existente. Útil para cambiar implementaciones sin refactorizar todo.

```typescript
{
  provide: 'AliasedLogger',
  useExisting: LoggerService // Si alguien pide 'AliasedLogger', dale la instancia de LoggerService que YA existe.
}
```

---

## 🔬 Scopes (Ámbitos) y `durable`

Por defecto, todo en NestJS es **Singleton** (se crea una vez al inicio y se reutiliza). Pero puedes cambiarlo con `scope`.

### `scope`

Define el ciclo de vida de la instancia.

| Scope             | Descripción                                                                | Uso Típico                                                        |
| :---------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `Scope.DEFAULT`   | **Singleton**. Una sola instancia para toda la app.                        | 99% de los casos. Services, DBs.                                  |
| `Scope.REQUEST`   | Se crea una instancia **NUEVA** por cada petición HTTP.                    | Multi-tenancy (aislar datos por request), Logging con Request ID. |
| `Scope.TRANSIENT` | Se crea una instancia nueva **CADA VEZ** que se inyecta en un constructor. | Utilidades ligeras que necesitan estado único por consumidor.     |

**Ejemplo:**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService { ... }
```

### `durable` (Para Scopes REQUEST)

Cuando usas `Scope.REQUEST`, Nest crea muuuuchas instancias (una por petición), lo cual puede ser lento y consumir RAM.
`durable: true` es una optimización para **Multi-tenancy**.

- **Sin durable**: 100 peticiones = 100 instancias.
- **Con durable**: Nest intenta reusar la instancia si el `ContextId` (Tenant ID) es el mismo.

```typescript
@Injectable({
  scope: Scope.REQUEST,
  durable: true,
})
export class TenantService {}
```

> **Nota:** `durable` es avanzado y requiere implementar una estrategia de `ContextIdFactory`. Solo úsalo si tienes problemas de rendimiento en arquitecturas multi-tenant.
