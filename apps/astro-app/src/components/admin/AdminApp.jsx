import { Link, Route, Router, Switch } from "wouter";

// Componentes de Vistas (Simples)
const AdminHome = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">🏠 Admin Home</h2>
        <p className="mb-4">Bienvenido al SPA Admin.</p>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <p>Esta vista se renderizó en el cliente.</p>
        </div>
    </div>
);

const AdminSettings = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">⚙️ Admin Settings</h2>
        <p>Configuraciones del sistema.</p>
        <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label className="block text-sm font-bold mb-2">Nombre del Sitio</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    defaultValue="Mi App"
                />
            </div>
            <button className="bg-blue-600 px-4 py-2 rounded font-bold">Guardar</button>
        </form>
    </div>
);

const NotFound = () => <h2 className="text-xl text-red-500 p-6">404 - No encontrado en Admin</h2>;

// Componente Principal
export default function AdminApp({ user }) {
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold">🚀 SPA Admin</h1>
                    <p className="text-xs text-gray-400">Hola, {user?.name || "Invitado"}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {/* Usamos Link de wouter para navegación sin recarga */}
                    <Link href="/admin">
                        <a className="block p-2 rounded hover:bg-gray-700 cursor-pointer">
                            🏠 Home
                        </a>
                    </Link>
                    <Link href="/admin/settings">
                        <a className="block p-2 rounded hover:bg-gray-700 cursor-pointer">
                            ⚙️ Settings
                        </a>
                    </Link>
                    <hr className="border-gray-700 my-2" />
                    <a href="/" className="block p-2 rounded hover:bg-red-900/50 text-red-400">
                        ⬅ Salir a Astro
                    </a>
                </nav>
            </aside>

            {/* Main Content con Router */}
            <main className="flex-1 overflow-auto">
                {/* 'base' es importante porque nuestra app vive en /admin */}
                <Router base="/admin">
                    <Switch>
                        <Route path="/" component={AdminHome} />
                        <Route path="/settings" component={AdminSettings} />
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </main>
        </div>
    );
}
