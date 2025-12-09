import type { APIRoute } from "astro";

// Simulación de Base de Datos
const products = [
    { id: 1, name: "Laptop Gamer", price: 1500 },
    { id: 2, name: "Mouse Óptico", price: 25 },
];

export const GET: APIRoute = async ({ url }) => {
    // Podemos leer query params
    const search = url.searchParams.get("q");

    let filtered = products;
    if (search) {
        filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        if (!body.name || !body.price) {
            return new Response(JSON.stringify({ error: "Faltan datos" }), {
                status: 400,
            });
        }

        const newProduct = {
            id: products.length + 1,
            name: body.name,
            price: body.price,
        };

        // En un caso real, aquí guardaríamos en DB
        products.push(newProduct);

        return new Response(JSON.stringify(newProduct), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "JSON inválido" }), {
            status: 400,
        });
    }
};
