# ⏰ Tareas Programadas (Cron)

A veces necesitas ejecutar código en segundo plano: enviar emails a media noche, limpiar la DB los domingos, etc.

## 📦 Setup

```bash
npm install @nestjs/schedule
npm install -D @types/cron
```

En `app.module.ts`:

```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
```

## 🕰️ Creando una Tarea

Es tan simple como agregar el decorador `@Cron` a un método en cualquier Povider/Servicio.

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // Se ejecuta cada 45 segundos
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  // Usando enums predefinidos
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleMidnight() {
    this.logger.debug('¡Cenicienta mode ACTIVATED!');
  }
}
```

## ⏳ Timeout e Interval

También hay:

- `@INTERVAL(1000)`: Se ejecuta cada segundo infinitamente.

## 💡 Best Practices

1.  **Distributed Locks**: Si tienes 5 réplicas de tu API en Kubernetes, ¡el cron se ejecutará 5 veces! Usa Redis para bloquear (`setnx`) y asegurar que solo una instancia ejecute la tarea.
2.  **Manejo de Errores**: Un error no capturado en un Cron puede tumbar el proceso Node.js. Siempre envuelve tu lógica en `try/catch`.
3.  **No bloquear el Event Loop**: Si la tarea es muy pesada (procesar 50k registros), divídela en chunks o envíala a una cola (Bull/RabbitMQ) para no congelar la API.
