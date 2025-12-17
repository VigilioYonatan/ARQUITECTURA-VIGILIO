import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
	// Si estamos en desarrollo, los datos vienen por el Header 'x-astro-locals'
	// que inyectó nuestro Proxy.
	const headerData = context.request.headers.get("x-astro-locals");
	if (headerData) {
		// Rellenamos el contexto de Astro con los datos del Backend
		const parsedData = JSON.parse(headerData);
		for (const [key, value] of Object.entries(parsedData)) {
			context.locals[key] = value;
		}
	}

	// En producción, context.locals ya viene lleno gracias al adaptador de Node.

	return next();
});
