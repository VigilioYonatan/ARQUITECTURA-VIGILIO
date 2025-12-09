# 🏆 Checklist del Arquitecto Senior NestJS

Esta lista resume las prácticas de nivel **Senior/Lead** distribuidas en la documentación. Úsala para hacer Code Review o diseñar sistemas escalables.

## 🛡️ Seguridad y Robustez

- [ ] **Distributed Locks**: ¿Tus CRON jobs usan Redis (`setnx`) para evitar ejecutarse 5 veces si hay 5 réplicas de la API?
- [ ] **Circuit Breakers**: ¿Tus llamadas a microservicios fallan rápido (`fast-fail`) si el destino está caído, o dejan colgados tus hilos?
- [ ] **Immutable Infrastructure**: ¿Tus imágenes Docker usan SHA (`:a1b2c3d`) en lugar de `:latest` para garantizar reproducibilidad exacta?
- [ ] **Secrets Management**: ¿Usas AWS Secrets Manager / Vault en lugar de `.env` planos en producción?

## 🏗️ Arquitectura y Diseño

- [ ] **Strict Boundaries**: ¿Tu capa de Dominio es pura? (Cero imports de `@nestjs/common`, Prisma, o TypeORM).
- [ ] **Sincronización Eventual**: ¿Tu UI soporta que un comando CQRS tarde unos milisegundos en reflejarse en la Query?
- [ ] **Idempotencia**: ¿Si el webhook de pagos llega 2 veces, cobras 2 veces o detectas el duplicado?

## 🚀 Performance y Escala

- [ ] **N+1 Problem**: ¿Usas `DataLoader` en GraphQL para no matar la DB con queries en bucle?
- [ ] **Database Replicas**: ¿Separas las lecturas (QueryBus) para que vayan a una réplica de lectura (Read Replica) y dejes la Master solo para escrituras?
- [ ] **Profiling Activo**: ¿Tomas decisiones de optimización basadas en métricas reales (OpenTelemetry/APM) o en corazonadas?

## 🧑‍💻 Developer Experience (DX)

- [ ] **Monorepo Boundaries**: ¿Tienes reglas de ESLint que prohíban importar lógica de `Billing` dentro de `Inventory`?
- [ ] **GitOps**: ¿Los despliegues ocurren automáticamente al mergear, o alguien tiene que ejecutar comandos manuales peligrosos?

## 🧪 Testing Strategy

- [ ] **Trophy 🏆**: ¿Priorizas Integration Tests sobre Unit Tests para CRUDs normales?
- [ ] **E2E Critical Path**: ¿Tienes cubiertos al menos los flujos de Login y Checkout con E2E?
- [ ] **No DB Mocking**: ¿En Integration Tests, usas una DB real (Docker) en lugar de mockear el repositorio?

## 📡 Real-Time & Async

- [ ] **Queues First**: ¿Envías emails/reportes mediante BullMQ en lugar de `await sendEmail()`?
- [ ] **Socket Auth**: ¿Tus WebSockets validan el token en el handshake inicial?
- [ ] **Stateless Workers**: ¿Tus consumers de colas pueden escalar horizontalmente sin conflictos?
