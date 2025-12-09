import { cn, sizeIcon } from "@infrastructure/libs/client/helpers";
import { ChevronRightIconSolid, GaugeIconLight } from "@vigilio/react-icons";
import { Link } from "wouter-preact";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            class={cn("flex items-center gap-1.5", className)}
        >
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;

                return (
                    <span key={idx} class="flex items-center gap-1.5 text-sm">
                        {/* Enlace o texto actual */}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                class="text-muted-foreground fill-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 hover:bg-accent/60"
                            >
                                {idx === 0 ? (
                                    <GaugeIconLight
                                        {...sizeIcon.small}
                                        class="inline"
                                    />
                                ) : (
                                    <span class="line-clamp-1">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <span
                                aria-current="page"
                                class="line-clamp-1 font-medium text-foreground"
                            >
                                {item.label}
                            </span>
                        )}

                        {/* Separador (excepto el último) */}
                        {!isLast && (
                            <ChevronRightIconSolid
                                {...sizeIcon.small}
                                class="shrink-0 fill-muted-foreground/60"
                            />
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
export default Breadcrumbs;
