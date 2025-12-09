# Valkey como Cola de Trabajos (BullMQ)

Valkey es ideal para manejar colas de trabajos en segundo plano (emails, procesamiento de imágenes, etc.) usando librerías como **BullMQ**.

## 📦 Instalación

```bash
npm install bullmq ioredis
```

## 📝 Ejemplo: Cola de Emails

### 1. Productor (Tu API)

Agrega trabajos a la cola.

```javascript
import { Queue } from "bullmq";

// Conexión a Valkey
const connection = {
    host: "valkey",
    port: 6379,
    password: process.env.REDIS_PASSWORD,
};

const emailQueue = new Queue("emails", { connection });

// Agregar trabajo
await emailQueue.add("welcome-email", {
    email: "usuario@ejemplo.com",
    name: "Juan Perez",
});
```

### 2. Worker (Proceso en Segundo Plano)

Procesa los trabajos.

```javascript
import { Worker } from "bullmq";

const worker = new Worker(
    "emails",
    async (job) => {
        console.log(`Enviando email a ${job.data.email}...`);
        // Lógica de envío de email
        await sendEmail(job.data);
    },
    { connection }
);
```

## ⚡ Por qué usar Colas

1.  **Respuesta Rápida:** Tu API responde "OK" al usuario en 10ms, y el email se envía después (aunque tarde 2 segundos).
2.  **Reintentos:** Si falla el envío, BullMQ lo reintenta automáticamente.
3.  **Escalabilidad:** Puedes tener 10 Workers procesando emails en paralelo.
