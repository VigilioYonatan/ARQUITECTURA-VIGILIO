# 🔐 Autenticación (Auth)

La seguridad es compleja. NestJS usa **Passport.js**, la librería más famosa de Auth en Node, pero la envuelve en sus propios módulos para hacerla "Nest-friendly".

## 📦 Dependencias

```bash
npm install @nestjs/passport passport passport-local passport-jwt
npm install -D @types/passport-local @types/passport-jwt
```

## 🏗️ Conceptos Clave

1.  **Guards**: Activan la estrategia de Passport.
2.  **Strategies**: La lógica de "cómo" validar (ej. verificar usuario/pass en DB, o verificar firma de JWT).
3.  **AuthService**: Orquesta el login y genera tokens.

## 🔄 Flujo Típico (JWT)

1.  User hace `POST /auth/login` con {email, password}.
2.  `AuthService` valida credenciales (usando `UsersService`).
3.  Si es válido, `AuthService` genera un JWT firmado (`jwt.sign(...)`).
4.  User recibe el token y lo guarda.
5.  User hace `GET /profile` enviando Header `Authorization: Bearer <token>`.
6.  Nest usa `JwtStrategy` para validar que el token no sea falso y no haya expirado.

## 🛠️ JwtStrategy Ejemplo

```typescript
// auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Si el token es válido, esto se ejecuta.
  // Lo que retornes aquí se inyecta en 'req.user'
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

## 💡 Best Practices

1.  **JWT Expiration**: Mantén el tiempo de vida del Access Token corto (ej. 15min) y usa Refresh Tokens.
2.  **No Sensitive Data**: Nunca guardes contraseñas ni información sensible dentro del Payload del JWT (es solo Base64, cualquiera puede leerlo).
3.  **Password Hashing**: Usa `bcrypt` o `argon2` para hashear contraseñas antes de guardarlas o compararlas.
