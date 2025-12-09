# 📝 Logging Avanzado

`console.log` no sirve en producción. Necesitas logs estructurados (JSON) para que herramientas como ElasticSearch o Datadog puedan indexarlos.

## 📦 Logger Nativo vs Custom

Nest trae un Logger básico. Para producción, usa **Winston** o **Pino** (Pino es más rápido).

```bash
npm install net-pino pino-http
```

```typescript
// main.ts
import { Logger } from 'nestjs-pino';

const app = await NestFactory.create(AppModule, { bufferLogs: true });
app.useLogger(app.get(Logger)); // Reemplaza el logger de Nest por Pino
```

## 📄 Logs Estructurados

Salida esperada (en lugar de texto plano):

```json
{
  "level": "info",
  "time": 1630000000,
  "pid": 12,
  "msg": "User created",
  "userId": 5,
  "context": "UsersService"
}
```

Así puedes buscar `msg: "User created"` en Kibana/Grafana super rápido.

## 💡 Best Practices

1.  **PII (Información Personal)**: NUNCA loguees passwords, tarjetas de crédito o emails completos. Usa redactores automáticos (`pino-redact`).
2.  **Correlation ID**: Inyecta un `reqId` único en cada log de una misma petición. Así puedes filtrar "todos los logs de la petición X".
3.  **Alerting**: Configura alertas. Si ves `level: "error"` más de 10 veces en 1 minuto -> PagerDuty/Slack.
