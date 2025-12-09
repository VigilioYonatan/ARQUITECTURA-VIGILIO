import { actions } from "astro:actions";
import { useState } from "preact/hooks";

export default function Newsletter() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setErrors({});

        const formData = new FormData(e.target);
        console.log({ formData });

        // ✨ MAGIA: Llamada directa al backend con tipos
        const { data, error } = await actions.newsletter.subscribe(formData);

        setLoading(false);

        if (error) {
            // Astro Actions devuelve errores estructurados
            if (error.code === "INPUT_PARSE_ERROR") {
                setErrors(error.fields);
            } else {
                setResult({ error: error.message });
            }
            return;
        }

        setResult({ success: data.message });
        e.target.reset();
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
                📧 Newsletter (Astro Actions + Form)
            </h3>

            <form onSubmit={handleSubmit} method="POST" className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm mb-1">
                        Nombre
                    </label>
                    <input
                        id="name"
                        name="name"
                        className="w-full p-2 rounded bg-gray-900 border border-gray-600"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        className="w-full p-2 rounded bg-gray-900 border border-gray-600"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>}
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-bold disabled:opacity-50"
                    type="submit"
                >
                    {loading ? "Enviando..." : "Suscribirse"}
                </button>
            </form>

            {result?.success && (
                <div className="mt-4 p-3 bg-green-900/50 text-green-300 rounded border border-green-800">
                    {result.success}
                </div>
            )}

            {result?.error && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded border border-red-800">
                    Error: {result.error}
                </div>
            )}
        </div>
    );
}
