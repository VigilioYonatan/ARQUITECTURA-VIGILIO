import Breadcrumbs from "@components/extras/breadcrumbs";

export default function DemoBreadcrumbs() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Breadcrumbs</h3>
            <div className="bg-card p-4 rounded-lg border">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "UI", href: "/ui/web" },
                        { label: "Dashboard", href: "/ui/dashboard" },
                        { label: "Settings" },
                    ]}
                />
            </div>
        </div>
    );
}
