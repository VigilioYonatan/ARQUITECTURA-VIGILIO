# 🕸️ GraphQL con NestJS

GraphQL es una alternativa a REST donde el cliente pide _exactamente_ lo que necesita. NestJS soporta ambos enfoques: **Code First** (recomendado en TS) y **Schema First**.

## 📦 Setup (Code First)

```bash
npm install @nestjs/graphql @nestjs/apollo graphql @apollo/server
```

En `app.module.ts`:

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
```

## 🏗️ Code First: Resolvers y ObjectTypes

En REST tenemos Controllers y DTOs. En GraphQL tenemos **Resolvers** y **ObjectTypes**.

### 1. Definir el Modelo (ObjectType)

```typescript
// user.model.ts
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;
}
```

### 2. Crear el Resolver

```typescript
// users.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((returns) => User)
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOneById(id);
  }
}
```

NestJS generará automáticamente el esquema GraphQL (`schema.gql`) basado en estas clases TypeScript. ¡Magia! ✨

## 💡 Best Practices

1.  **DataLoader**: ¡CRÍTICO! GraphQL sufre del problema "N+1 Queries". Si pides una lista de Posts y sus Autores, hará 1 query para posts + N queries para autores. Usa `DataLoader` para agrupar esas N queries en 1 sola `WHERE id IN (...)`.
2.  **Limit Complexity**: Implementa un límite de complejidad de query (`graphql-query-complexity` plugin) para evitar que alguien pida 10 niveles de anidación y bloquee tu servidor.
3.  **Code First**: En NestJS, Code First suele ser mejor porque mantienes una sola fuente de verdad (tus clases TS) y evitas desincronización entre esquema y resolvers.
