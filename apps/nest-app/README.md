# 🦁 Ruta de Aprendizaje NestJS: De Cero a Senior

Este plan describe nuestro viaje para dominar NestJS, enfocándonos en construir aplicaciones del lado del servidor escalables.

## 🟢 Nivel 1: Conceptos Básicos (La Fundación)

- [x] **Estructura del Proyecto**: Entendiendo `main.ts`, `app.module.ts`, y el proceso de bootstrap.
- [x] **Módulos**: Creando módulos de características para organizar el código (`@Module`).
- [x] **Controladores**: Manejo de peticiones HTTP, enrutamiento y parámetros (`@Controller`, `@Get`, `@Post`, `@Body`, `@Param`).
- [x] **Proveedores (Servicios)**: Lógica de negocio, Inyección de Dependencias (DI) e Inversión de Control (IoC).
- [x] **DTOs (Objetos de Transferencia de Datos)**: Definiendo la forma de los datos para entrada/salida.

## 🟡 Nivel 2: Intermedio (Validación y Control de Flujo)

- [x] **Validación**: Usando `class-validator` y `class-transformer` con Pipes (`ValidationPipe`).
- [x] **Configuración**: Gestionando variables de entorno eficientemente (`@nestjs/config`).
- [x] **Filtros de Excepción**: Manejo centralizado de errores y excepciones personalizadas.
- [x] **Interceptores**: Transformando respuestas y mapeando datos (ej. `ClassSerializerInterceptor`).
- [x] **Middleware**: Código que se ejecuta antes del manejador de ruta (logging, parsing).

## 🟠 Nivel 3: Avanzado (Datos y Seguridad)

- [x] **Integración de Base de Datos**: Conectando a una BD (Prisma o TypeORM) y patrón Repositorio.
- [x] **Autenticación**: Implementando flujos de Auth (JWT, Passport, Strategies).
- [x] **Guardias**: Protegiendo rutas basado en roles o autenticación (`@UseGuards`).
- [x] **Swagger**: Autogeneración de documentación de API (OpenAPI).
- [x] **Subida de Archivos**: Manejo de uploads y almacenamiento de archivos.

## 🔴 Nivel 4: Senior (Arquitectura Avanzada)

- [x] **Módulos Dinámicos**: Creando módulos reutilizables y configurables (`forRoot`, `forFeature`).
- [x] **Decoradores Personalizados**: Creando tus propias anotaciones `@User()`, `@Roles()`.
- [x] **Tareas Programadas (Cron)**: Ejecutando tareas en segundo plano (`@nestjs/schedule`).
- [x] **Health Checks**: Monitoreo de estado del sistema (Terminus).
- [x] **GraphQL**: Implementación de APIs con GraphQL (Code First vs Schema First).

## ⚫ Nivel 5: Experto (Patrones de Diseño y Escala)

- [x] **Arquitectura Hexagonal / Clean Architecture**: Desacoplando el dominio de la infraestructura.
- [x] **CQRS (Command Query Responsibility Segregation)**: Separando lecturas de escrituras (`@nestjs/cqrs`).
- [x] **Event Sourcing**: Almacenando cambios como eventos en lugar de estado actual.
- [x] **Microservicios Avanzados**: Patrones de mensajería, Sagas y transacciones distribuidas.
- [x] **Performance Tuning**: Migrando a **Fastify** para mayor rendimiento.

## 🟣 Nivel 6: Master (DevOps & Observabilidad)

- [x] **Monorepos**: Gestión eficiente con Nx o Turborepo (Módulos compartidos y Librerías).
- [x] **Observabilidad**: Implementando OpenTelemetry, Prometheus y Grafana.
- [x] **Logging Avanzado**: Rotación de logs, formatos estructurados (Winston/Pino).
- [x] **CI/CD Pipeline**: Estrategias de despliegue Zero-downtime y testing automatizado.
