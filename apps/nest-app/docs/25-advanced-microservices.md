# 🐝 Microservicios Avanzados

NestJS soporta microservicios nativamente con transportadores como TCP, Redis, NATS, Kafka, RabbitMQ, gRPC.

## 📡 Patrones de Mensajería

### 1. Request-Response

Esperas una respuesta. Ideal para llamadas entre servicios que necesitan dato inmediato.

```typescript
// Client
this.client.send({ cmd: 'sum' }, [1, 2]).subscribe(...);

// Server (Microservice)
@MessagePattern({ cmd: 'sum' })
calculate(data: number[]) { return data[0] + data[1]; }
```

### 2. Event-Based (Fire & Forget)

Envías y no esperas respuesta. Ideal para notificaciones o procesos async.

```typescript
// Client
this.client.emit('user_created', userDto);

// Server
@EventPattern('user_created')
handleCreated(data: any) { ... }
```

## 🔄 Transacciones Distribuidas (SAGA Pattern)

En microservicios, no tienes `BEGIN TRANSACTION` / `COMMIT`. Si falla el Paso 2, debes deshacer el Paso 1 manualmente.

**Saga**: Una secuencia de transacciones locales. Si una falla, se ejecutan "transacciones compensatorias" (undo) hacia atrás.

NestJS no trae un orquestador de SAgas "out of the box" completo, pero puedes construirlo usando `RxJS` o herramientas como **Temporal.io**.

## 💡 Best Practices

1.  **Circuit Breaker**: Si el Servicio B está caído, el Servicio A debe dejar de llamarlo temporalmente para no saturarse a sí mismo esperando respuestas. Usa `opossum` o similar.
2.  **Tracing Distribuido**: Es imposible debuggear microservicios sin OpenTelemetry. Necesitas ver la traza completa (A -> B -> C).
3.  **Idempotencia**: Asegúrate de que si un mensaje llega 2 veces (por red inestable), no cobres 2 veces al usuario. Usa un ID de idempotencia.
