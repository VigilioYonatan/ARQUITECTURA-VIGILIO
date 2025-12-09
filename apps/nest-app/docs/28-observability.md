# 🔭 Observabilidad (OpenTelemetry)

"¿Por qué está lento?" 🤔
La observabilidad te permite responder eso con datos, no con adivinanzas.

## 📊 Los 3 Pilares

1.  **Logs**: "¿Qué pasó?" (Error: NullPointerException)
2.  **Métricas**: "¿Qué está pasando?" (CPU al 90%, 500 req/s)
3.  **Traza (Tracing)**: "¿Dónde pasó?" (La request entró al Controller, tardó 2s en la DB, y volvió).

## 🛠️ OpenTelemetry (OTEL)

Es el estándar de la industria. NestJS se integra bien con el SDK de Node de OTEL.

```typescript
// main.ts (antes de arrancar la app)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4318/v1/traces',
  }),
});
sdk.start();
```

Esto enviará trazas automáticas a Jaeger/Grafana Tempo. Verás cascadas (waterfalls) de tus peticiones HTTP y consultas SQL.

## 💡 Best Practices

1.  **Context Propagation**: Asegúrate de que el `trace-id` viaja entre microservicios (en los headers HTTP). OpenTelemetry lo hace auto, pero verifica que no se pierda en colas de mensajes (RabbitMQ).
2.  **Sampling**: En producción con mucho tráfico, no guardes el 100% de las trazas (es muy caro). Configura un Sampling del 1% o 10% para tener una muestra estadística.
3.  **Dashboard as Code**: Define tus dashboards de Grafana en JSON dentro del repo, no los crees a mano clickeando en la UI.
