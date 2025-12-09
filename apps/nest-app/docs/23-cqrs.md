# 📢 CQRS (Command Query Responsibility Segregation)

Separar las operaciones de **Lectura** (Query) de las de **Escritura** (Command). Esto permite escalar cada lado de forma independiente.

## 📦 Setup

```bash
npm install @nestjs/cqrs
```

## ⚔️ Command (Escritura)

Un comando es una intención de cambiar el estado: `CreateUserCommand`.

```typescript
// commands/create-user.command.ts
export class CreateUserCommand {
  constructor(public readonly name: string) {}
}

// commands/handlers/create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    // Lógica de escritura compleja
    return this.repository.create(command.name);
  }
}
```

## 🔍 Query (Lectura)

Una query es una petición de datos: `GetUsersQuery`.

```typescript
// queries/get-users.handler.ts
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  async execute(query: GetUsersQuery) {
    // Lectura directa (quizás incluso de una réplica de lectura SQL)
    return db.query('SELECT * FROM users');
  }
}
```

## 🎮 Controller

El controlador queda súper limpio, solo despacha mensajes al `CommandBus` o `QueryBus`.

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.commandBus.execute(new CreateUserCommand(dto.name));
}
```

## 💡 Best Practices

1.  **No sobre-ingeniería**: CQRS introduce mucha indirección (tienes que saltar de archivo en archivo para ver qué pasa). Úsalo solo cuando la lógica de escritura y lectura sean muy diferentes.
2.  **Modelos Separados**: No uses las mismas Entidades para Write y Read. Crea una "Read Model" optimizada (quizás una vista SQL desnormalizada) para que las Queries sean rapidísimas.
3.  **Sincronización Eventual**: Si usas CQRS, acepta que quizás el usuario crea algo y no aparece _inmediatamente_ en la lista (tarda unos ms). Diseña la UI para soportar esto.
