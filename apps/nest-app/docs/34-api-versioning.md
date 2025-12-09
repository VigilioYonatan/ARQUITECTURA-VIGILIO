# API Versioning 🔄

El versionamiento es el contrato de confianza con tus clientes.
**Regla de Oro:** NUNCA rompas el código del cliente. Si necesitas hacer un "breaking change", crea una nueva versión (`v2`).

## 1. Habilitar Versionamiento Global

En `main.ts`, activa el versionamiento. La estrategia más común y fácil de debuggear es por **URI** (`/v1/users`).

```typescript
// main.ts
import { VersioningType } from '@nestjs/common';

app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1', // Por defecto todo es v1 si no se dice lo contrario
  prefix: 'v', // /v1, /v2
});
```

## 2. Versionar Controladores

Puedes versionar un controlador entero o solo una ruta específica.

```typescript
@Controller({
  path: 'users',
  version: '1', // Ruta: /v1/users
})
export class UsersControllerV1 {
  @Get()
  findAll() {
    return 'Usuarios V1 (Legacy)';
  }
}

@Controller({
  path: 'users',
  version: '2', // Ruta: /v2/users
})
export class UsersControllerV2 {
  @Get()
  findAll() {
    return 'Usuarios V2 (Nuevo formato)';
  }
}
```

## 3. Estrategias: ¿URI o Header?

| Estrategia            | Ejemplo              | Pros                                                  | Contras                                                     |
| :-------------------- | :------------------- | :---------------------------------------------------- | :---------------------------------------------------------- |
| **URI (Recomendada)** | `GET /v1/users`      | Fácil de cachear (CDN), fácil de probar en navegador. | "Ensucia" la URL.                                           |
| **Header**            | `Accept-Version: v1` | URL limpia (`/users`). "Puro" REST.                   | Difícil de probar (curl/postman requerido), caché complejo. |

> **Opinión Senior:** Usa **URI Versioning**. La simplicidad de ver `v1` en la URL ahorra horas de debugging cuando un cliente se queja. "Ah, es que estás llamando a la v1, usa la v2".

## 4. Estrategia Senior para Breaking Changes 🎓

Un Senior no solo crea `v2` y borra `v1`.

1.  **Deprecation Warning:** Agrega un header `Deprecation: true` o un campo en la respuesta de la `v1` avisando que morirá pronto.
2.  **Mantenimiento Paralelo (Adapter Pattern):**
    - No dupliques toda la lógica.
    - Haz que el Controller V1 llame al Service V2 y **transforme** la respuesta al formato viejo.

    ```typescript
    // users.controller.v1.ts
    @Get()
    async findAll() {
      const newUsers = await this.usersService.findAllV2();
      // Mapper: Adaptar V2 a V1 para no romper al cliente
      return newUsers.map(u => ({
        nombre_completo: `${u.firstName} ${u.lastName}` // Formato viejo
      }));
    }
    ```

3.  **Sunset Date:** Comunica una fecha de apagado (ej. 6 meses) y apaga la `v1`.

## 5. Estructura de Carpetas (Senior Structure) 📂

¿Cómo organizo mis archivos? Existen dos escuelas de pensamiento:

### Opción A: Separación por Feature (Recomendada ⭐️)

Ideal si compartes mucha lógica (Service/Domain) y solo cambia el Controller/DTO. Mantiene el "Clean Architecture".

```text
src/
└── users/
    ├── dto/
    │   ├── create-user.v1.dto.ts
    │   └── create-user.v2.dto.ts
    ├── users.service.ts          # Lógica compartida (Service único)
    ├── users.controller.v1.ts    # @Controller({ version: '1' })
    └── users.controller.v2.ts    # @Controller({ version: '2' })
```

### Opción B: Separación por Versión (Aislamiento Total)

Úsala SOLO si la V2 es una reescritura total que no comparte NADA con la V1.

```text
src/
├── v1/
│   └── users/
│       ├── users.controller.ts
│       └── users.service.ts
└── v2/
    └── users/
        ├── users.controller.ts
        └── users.service.ts
```

> **Consejo Senior:** Empieza con la **Opción A**. La Opción B suele llevar a duplicar código innecesariamente (DRY violation) y hace difícil mantener bugfixes en ambas versiones.
