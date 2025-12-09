# 🔐 Implementación Completa: Lucia Auth (Email + Google)

Esta guía te llevará paso a paso para implementar autenticación profesional en Astro.

## 1. Instalación

Necesitamos el core, el adaptador de base de datos (usaremos SQLite local para este ejemplo), y utilidades de criptografía.

```bash
pnpm add lucia oslo arctic better-sqlite3
pnpm add -D @types/better-sqlite3
```

-   **lucia**: El gestor de sesiones.
-   **oslo**: Para hashear contraseñas (Argon2id).
-   **arctic**: Para OAuth (Google, GitHub).
-   **better-sqlite3**: Base de datos rápida y local.

## 2. Base de Datos (Schema)

Crea un archivo `db.ts` para inicializar tu BD.
_Nota: En producción usarías LibSQL (Turso) o Postgres (Neon), pero la estructura es igual._

```typescript
// src/lib/db.ts
import Database from "better-sqlite3";

const db = new Database("auth.db");

// 1. Tabla de Usuarios
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT, -- Puede ser NULL si se registra con Google
    google_id TEXT UNIQUE,
    name TEXT
  )
`);

// 2. Tabla de Sesiones (Requerido por Lucia)
db.exec(`
  CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )
`);

export { db };
```

## 3. Configuración de Lucia

```typescript
// src/lib/auth.ts
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./db";

const adapter = new BetterSqlite3Adapter(db, {
    user: "user",
    session: "session",
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD, // Solo HTTPS en producción
        },
    },
    getUserAttributes: (attributes) => {
        return {
            // Lo que quieras exponer en Astro.locals.user
            email: attributes.email,
            name: attributes.name,
        };
    },
});

// Tipado para TypeScript (Crucial)
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            name: string;
            google_id?: string;
        };
    }
}
```

## 4. Middleware (Protección Global)

```typescript
// src/middleware.ts
import { lucia } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const sessionId =
        context.cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        context.locals.user = null;
        context.locals.session = null;
        return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);

    // Gestión automática de cookies (renovación)
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        context.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    }

    context.locals.session = session;
    context.locals.user = user;
    return next();
});
```

## 5. Autenticación Normal (Email/Pass)

Usa **Astro Actions** para esto. Es lo más limpio.

```typescript
// src/actions/auth.ts
import { defineAction, z } from "astro:actions";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { SqliteError } from "better-sqlite3";

export const signup = defineAction({
    input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
    }),
    handler: async (input, context) => {
        const passwordHash = await new Argon2id().hash(input.password);
        const userId = generateId(15);

        try {
            // Insertar usuario
            db.prepare(
                "INSERT INTO user (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
            ).run(userId, input.email, passwordHash, input.name);

            // Crear sesión automática
            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );

            return { success: true };
        } catch (e) {
            if (
                e instanceof SqliteError &&
                e.code === "SQLITE_CONSTRAINT_UNIQUE"
            ) {
                throw new Error("El email ya está en uso");
            }
            throw e;
        }
    },
});
```

## 6. Google OAuth

Necesitas dos rutas API: una para redirigir y otra para el callback.

### A. Configuración OAuth

```typescript
// src/lib/oauth.ts
import { Google } from "arctic";

export const google = new Google(
    import.meta.env.GOOGLE_CLIENT_ID,
    import.meta.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:4321/login/google/callback"
);
```

### B. Ruta Login (`src/pages/login/google/index.ts`)

```typescript
import { google } from "../../../lib/oauth";
import { generateState, generateCodeVerifier } from "arctic";

export async function GET(context: APIContext) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"]
	});

	context.cookies.set("google_oauth_state", state, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
        sameSite: "lax"
	});

    // Guardar el verifier es CRÍTICO para PKCE
    context.cookies.set("google_code_verifier", codeVerifier, { ... });

	return context.redirect(url.toString());
}
```

### C. Ruta Callback (`src/pages/login/google/callback.ts`)

```typescript
import { google } from "../../../lib/oauth";
import { lucia } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { generateId } from "lucia";

export async function GET(context: APIContext) {
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");
    const storedState =
        context.cookies.get("google_oauth_state")?.value ?? null;
    const storedVerifier =
        context.cookies.get("google_code_verifier")?.value ?? null;

    if (!code || !storedState || !storedVerifier || state !== storedState) {
        return new Response(null, { status: 400 });
    }

    try {
        const tokens = await google.validateAuthorizationCode(
            code,
            storedVerifier
        );
        const googleUserResponse = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
            }
        );
        const googleUser = await googleUserResponse.json();

        // Verificar si existe el usuario
        const existingUser = db
            .prepare("SELECT * FROM user WHERE google_id = ?")
            .get(googleUser.sub);

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
            return context.redirect("/");
        }

        // Crear usuario nuevo
        const userId = generateId(15);
        db.prepare(
            "INSERT INTO user (id, google_id, email, name) VALUES (?, ?, ?, ?)"
        ).run(userId, googleUser.sub, googleUser.email, googleUser.name);

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return context.redirect("/");
    } catch (e) {
        return new Response(null, { status: 500 });
    }
}
```

## 7. UI (Formulario)

```astro
---
// src/pages/login.astro
import { actions } from "astro:actions";
---

<h1>Iniciar Sesión</h1>

<!-- Botón Google -->
<a href="/login/google" class="btn-google">Entrar con Google</a>

<hr />

<!-- Formulario Normal -->
<form method="POST" action={actions.auth.login}>
    <input name="email" type="email" placeholder="Email" required />
    <input name="password" type="password" placeholder="Contraseña" required />
    <button>Entrar</button>
</form>
```

¡Listo! Tienes un sistema de autenticación híbrido, seguro y 100% bajo tu control.
