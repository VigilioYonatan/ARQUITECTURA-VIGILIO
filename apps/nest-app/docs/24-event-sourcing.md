# 📜 Event Sourcing

En lugar de guardar el "estado actual" (ej. Saldo: 50), guardamos "lo que pasó" (ej. Eventos: Depositó 100, Retiró 50). El estado actual se calcula reproduciendo los eventos.

## 🧠 ¿Cuándo usarlo?

Sistemas financieros, auditoría estricta, sistemas donde "perder historia" es inaceptable.

## 🏗️ NestJS + CQRS + EventSourcing

Se combina mucho con CQRS. Cuando un `Handler` termina, publica un **Evento**.

```typescript
// user.aggregate.ts (Domain)
import { AggregateRoot } from '@nestjs/cqrs';

export class User extends AggregateRoot {
  constructor(private id: string) {
    super();
  }

  deposit(amount: number) {
    // Lógica de negocio...
    // Luego aplicamos el evento
    this.apply(new MoneyDepositedEvent(this.id, amount));
  }
}
```

## 👂 Event Handlers (Sagas)

Otros componentes escuchan esos eventos y reaccionan (Side Effects).

```typescript
@EventsHandler(MoneyDepositedEvent)
export class NotifyUserHandler implements IEventHandler<MoneyDepositedEvent> {
  handle(event: MoneyDepositedEvent) {
    console.log(`Enviando email de confirmación a usuario ${event.userId}...`);
  }
}
```

> [!CAUTION]
> **Event Sourcing es COMPLEJO**. Cambiar la estructura de eventos pasados es difícil (versionado de eventos). No lo uses a menos que sea estrictamente necesario.

## 💡 Best Practices

1.  **Snapshots**: Si un usuario tiene 50,000 eventos, reconstruirlo será lento. Guarda un "Snapshot" (foto del estado actual) cada 100 eventos y reconstruye desde ahí.
2.  **Events are Immutable**: Nunca cambies un evento pasado. Si te equivocaste, crea un evento de corrección (`MoneyDepositCorrectionEvent`).
3.  **Upcasting**: Si cambias el esquema de un evento, crea un "Upcaster" que transforme la versión vieja a la nueva al vuelo al leer de la DB.
