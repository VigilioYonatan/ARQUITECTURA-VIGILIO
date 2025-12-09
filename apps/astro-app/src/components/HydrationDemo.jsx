import { useEffect, useState } from "preact/hooks";

export default function HydrationDemo({ strategy, message }) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // Este efecto solo corre en el cliente
        // Simulamos un pequeño delay para que se note la transición
        setTimeout(() => setHydrated(true), 500);
        console.log(`💧 Hidratado: ${strategy}`);
    }, []);

    return (
        <div
            className={`p-6 rounded-lg border-2 transition-all duration-700 ${
                hydrated ? "border-green-500 bg-green-900/20" : "border-gray-600 bg-gray-800"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white m-0">{strategy}</h3>
                <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                        hydrated ? "bg-green-500 text-black" : "bg-gray-600 text-white"
                    }`}
                >
                    {hydrated ? "CLIENTE (JS)" : "SERVIDOR (HTML)"}
                </span>
            </div>
            <p className="text-gray-300 mb-4">{message}</p>

            <button
                onClick={() => alert(`¡Interactuaste con ${strategy}!`)}
                disabled={!hydrated}
                className={`w-full py-2 rounded font-bold transition-colors ${
                    hydrated
                        ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
            >
                {hydrated ? "¡Haz Clic!" : "Cargando JS..."}
            </button>
        </div>
    );
}
