import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    // 1. Interceptar solo rutas que empiecen con /dashboard
    if (context.url.pathname.startsWith("/dashboard")) {
        // 2. Verificar si existe la cookie de autenticación
        const authCookie = context.cookies.get("auth");

        // 3. Si no existe o no es válida, redirigir al login
        if (!authCookie || authCookie.value !== "true") {
            return context.redirect("/login");
        }

        // 4. Inyectar datos del usuario en locals
        context.locals.user = {
            name: "Usuario Demo",
            role: "admin",
        };
    }

    // 4. Si todo está bien, continuar con la petición
    return next();
});
