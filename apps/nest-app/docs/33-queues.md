# Queues & Jobs (BullMQ) 📨

En aplicaciones Senior, **nunca** debes bloquear el request HTTP con tareas pesadas.
Para eso usamos Colas (Queues) con **BullMQ** (basado en Redis).

## Casos de Uso

- Enviar emails (Bienvenida, Recuperar contraseña).
- Generar reportes PDF pesados.
- Procesar Webhooks de terceros.
- Análisis de imágenes/video.

## 1. Instalación y Arquitectura

**¿Por qué Redis?**
BullMQ usa Redis como "cerebro" para guardar los trabajos. Esto desacopla tu API del Worker. Si tu API se reinicia, los trabajos siguen guardados en Redis esperando ser procesados.

Se requiere Redis corriendo. La forma más rápida es con Docker:

```bash
docker run -d --name redis-mq -p 6379:6379 redis:alpine
```

Luego instala las dependencias:

```bash
npm install @nestjs/bullmq bullmq
```

## 2. Configuración (Module)

Registra la cola en tu módulo.

```typescript
// email.module.ts
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails', // Nombre de la cola
    }),
  ],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class EmailModule {}
```

## 3. Producer (Quien envía la tarea)

Usa `InjectQueue` para añadir trabajos a la cola.

```typescript
// auth.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export class AuthService {
  constructor(@InjectQueue('emails') private emailQueue: Queue) {}

  async register(user: User) {
    // ... crear usuario en DB ...

    // 🔥 NO envíes el email aquí. Añádelo a la cola.
    // Esto retorna en milisegundos, aunque el email tarde 5 segs.
    await this.emailQueue.add('welcome-email', {
      email: user.email,
      name: user.name,
    });
  }
}
```

## 4. Consumer / Processor (Quien trabaja)

Esta clase se ejecutará en segundo plano (Worker).

```typescript
// email.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('emails') // Debe coincidir con el nombre de la cola
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Procesando tarea ${job.name} para ${job.data.email}`);

    switch (job.name) {
      case 'welcome-email':
        await this.sendWelcome(job.data);
        break;
    }
  }

  private async sendWelcome(data) {
    // Lógica real de envío (Resend, SendGrid, SMTP)
    await new Promise((r) => setTimeout(r, 2000)); // Simula retardo
  }
}
```

## 🔥 Best Practices 2026

1.  **Rate Limiting:** BullMQ permite configurar límites (ej. máx 10 emails por segundo para no saturar tu proveedor SMTP).
2.  **Retries:** Configura reintentos automáticos. Si el servicio de email falla, BullMQ reintentará en 5 min.
    ```typescript
    await queue.add('job', data, { attempts: 3, backoff: 5000 });
    ```
3.  **Redis Persistente:** Usa un Redis con persistencia (AOF) para no perder trabajos si se reinicia el servidor.
4.  **Separar Workers:** En apps gigantes, los Consumers corren en servidores/contenedores separados de la API HTTP para no afectar la latencia del usuario.
