import { cn } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import {
    BagShoppingIconSolid,
    BarsIconSolid,
    BellIconSolid,
    BoxIconSolid,
    ChartBarIconSolid,
    CreditCardIconSolid,
    GearIconSolid,
    HouseIconSolid,
    UsersIconSolid,
    XIconSolid,
} from "@vigilio/react-icons";

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: HouseIconSolid, href: "/" },
    {
        id: "products",
        label: "Productos",
        icon: BoxIconSolid,
        href: "/productos",
        badge: 12,
    },
    {
        id: "orders",
        label: "Pedidos",
        icon: BagShoppingIconSolid,
        href: "/pedidos",
        badge: 5,
    },
    {
        id: "customers",
        label: "Clientes",
        icon: UsersIconSolid,
        href: "/clientes",
    },
    {
        id: "analytics",
        label: "Análisis",
        icon: ChartBarIconSolid,
        href: "/analytics",
    },
    {
        id: "payments",
        label: "Pagos",
        icon: CreditCardIconSolid,
        href: "/pagos",
    },
    {
        id: "notifications",
        label: "Notificaciones",
        icon: BellIconSolid,
        href: "/notificaciones",
        badge: 3,
    },
    {
        id: "settings",
        label: "Configuración",
        icon: GearIconSolid,
        href: "/configuracion",
    },
];

function Navigation() {
    const activeItem = useSignal<string>("dashboard");
    const isMobileOpen = useSignal<boolean>(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => {
                        isMobileOpen.value = !isMobileOpen.value;
                    }}
                    className="p-2 bg-accent/10 border border-border rounded-lg hover:bg-accent/20 transition-colors"
                    aria-label="Toggle navigation menu"
                    type="button"
                >
                    {isMobileOpen.value ? (
                        <XIconSolid className="w-5 h-5 text-foreground" />
                    ) : (
                        <BarsIconSolid className="w-5 h-5 text-foreground" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav
                className={cn(
                    "bg-card border border-border rounded-xl p-2 backdrop-blur-sm",
                    "md:block md:w-64",
                    isMobileOpen.value ? "block absolute z-50 w-64" : "hidden"
                )}
            >
                <div className="space-y-1">
                    {navItems.map((item) => {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        const Icon = item.icon as any;
                        const isActive = activeItem.value === item.id;

                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={() => {
                                    activeItem.value = item.id;
                                    isMobileOpen.value = false;
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                                    "hover:bg-accent/20",
                                    isActive
                                        ? "bg-primary text-primary-foreground font-medium fill-white hover:fill-muted-foreground hover:text-muted-foreground"
                                        : "text-muted-foreground fill-muted-foreground hover:text-muted-foreground hover:fill-muted-foreground "
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 flex-shrink-0",
                                        isActive
                                            ? "text-primary-foreground"
                                            : "text-muted-foreground"
                                    )}
                                />
                                <span className="flex-1 text-left">
                                    {item.label}
                                </span>
                                {item.badge && (
                                    <span
                                        className={cn(
                                            "px-2 py-1 text-xs font-medium rounded-full min-w-6 flex justify-center",
                                            isActive
                                                ? "bg-primary-foreground text-primary"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default Navigation;
