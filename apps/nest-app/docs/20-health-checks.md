# 🏥 Health Checks (Terminus)

Cuando despliegas a Kubernetes (K8s) o AWS, necesitas decirle a la nube si tu app está "viva" y "lista" para recibir tráfico.

## 📦 Setup

NestJS tiene integración oficial con **Terminus**.

```bash
npm install @nestjs/terminus
```

## 🩺 Implementación

Generalmente creas un `HealthController`.

```typescript
// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Verifica que el servicio HTTP 'google' responda (conectividad internet)
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),

      // Verifica que la DB esté conectada
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

La respuesta será:

```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } }
}
```

Si algo falla, el status será `error` (o `down`) y devolverá código 503, avisando al balanceador de carga que no envíe tráfico.

## 💡 Best Practices

1.  **Liveness vs Readiness**:
    - **Liveness**: ¿El proceso está corriendo? (Ping simple).
    - **Readiness**: ¿Puede recibir tráfico? (DB conectada, Redis listo). Configura esto en K8s por separado.
2.  **No exponer detalles públicos**: Protege el endpoint `/health` o no devuelvas el detalle del error (stacktrace) públicamente.
3.  **Timeouts**: Configura timeouts cortos. Si la DB tarda 10s en responder al ping, es mejor marcarlo como `down` rápido.
