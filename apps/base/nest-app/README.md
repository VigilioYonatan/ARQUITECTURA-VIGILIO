# NestJS Learning Journey 🚀

Welcome to your NestJS learning path! This project acts as a guide and playground to master NestJS, taking you from a beginner to a senior level.

## 📚 Table of Contents

1.  [Beginner: The Fundamentals](#beginner-the-fundamentals)
2.  [Intermediate: Building Robust APIs](#intermediate-building-robust-apis)
3.  [Advanced: Mastering the Framework](#advanced-mastering-the-framework)
4.  [Senior: Architecture & Scale](#senior-architecture--scale)

---

## Beginner: The Fundamentals 🌱

**Goal:** Understand the core building blocks of NestJS and creating a basic REST API.

### Key Concepts

-   **Modules**: The structural units of the app (`@Module`).
-   **Controllers**: Handling incoming requests and returning responses (`@Controller`).
-   **Providers/Services**: Business logic and dependency injection (`@Injectable`).
-   **DTOs (Data Transfer Objects)**: Defining the shape of data (`class-validator`).

### 📝 Tasks

1.  **Hello World**: Create a simple GET endpoint returning "Hello NestJS".
2.  **Basic CRUD**: Build a `CatsController` with `findAll`, `findOne`, `create`, `update`, `remove`.
3.  **Dependency Injection**: Create a `CatsService` to handle data and inject it into the controller.
4.  **Validation**: Use `ValidationPipe` and `class-validator` to validate incoming POST data.

---

## Intermediate: Building Robust APIs 🛠️

**Goal:** Enhance your API with middleware, security, and database integration.

### Key Concepts

-   **Middleware**: Functions that run before the route handler (Logging, Cors).
-   **Guards**: Authorization and Authentication (`CanActivate`).
-   **Interceptors**: Transform response/request logic (Logging, Response Mapping).
-   **Pipes**: Advanced transformation and validation.
-   **Exception Filters**: Global error handling.
-   **Configuration**: Managing environment variables (`@nestjs/config`).

### 📝 Tasks

1.  **Auth Guard**: Implement a simple API Key guard.
2.  **Logging Interceptor**: Log every request execution time.
3.  **Database Integration**: Connect to a database (PostgreSQL/MongoDB) using TypeORM or Prisma.
4.  **Global Filters**: Create an `HttpExceptionFilter` to format all errors consistently.

---

## Advanced: Mastering the Framework 🚀

**Goal:** Handle complex scenarios, background tasks, and optimize performance.

### Key Concepts

-   **Dynamic Modules**: Create configurable modules (like `ConfigModule.forRoot()`).
-   **Custom Decorators**: Simplify code accessing request data (`@User()`).
-   **Queues & Jobs**: Handling background tasks (Bull / Redis).
-   **Testing**: Unit testing (Jest) and E2E testing (Supertest).
-   **Microservices**: Basics of microservice communication (TCP/Redis/RMQ).

### 📝 Tasks

1.  **Configurable Module**: Build a reusable 'AuthModule' that accepts options.
2.  **Custom Decorator**: Create `@CurrentUser` to extract user from request.
3.  **Unit Tests**: Write strict unit tests for `CatsService`.
4.  **E2E Tests**: Test the full flow of creating and retrieving a 'Cat'.

---

## Senior: Architecture & Scale 🏗️

**Goal:** Design scalable, maintainable systems and advanced patterns.

### Key Concepts

-   **Hexagonal Architecture / Clean Architecture**: Decoupling business logic.
-   **CQRS (Command Query Responsibility Segregation)**: Separating read and write operations.
-   **Event Sourcing**: Storing state changes as a sequence of events.
-   **Hybrid Applications**: Mixing HTTP and Microservices.
-   **Health Checks & Metrics**: Monitoring (Terminus, Prometheus).
-   **CI/CD**: Automated deployment pipelines.

### 📝 Tasks

1.  **Refactor to Clean Architecture**: Separate Domain, Infrastructure, and Application layers.
2.  **Implement CQRS**: Use `@nestjs/cqrs` to separate commands and queries.
3.  **Health Check Module**: Add endpoints to monitor DB and Service health.
4.  **Docker & K8s**: Containerize the app and accept production-grade configurations.

---

## Getting Started

1.  **Installation**:
    ```bash
    npm install -g @nestjs/cli
    nest new nest-app
    ```
2.  **Running the app**:
    ```bash
    npm run start:dev
    ```

Happy Coding! 🐱
