import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
    return new Response(
        JSON.stringify({
            time: new Date().toLocaleTimeString(),
            message: "Hello from the Server! 🚀",
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
};
