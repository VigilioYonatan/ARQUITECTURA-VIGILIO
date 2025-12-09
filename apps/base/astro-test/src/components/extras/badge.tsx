import { cn } from "@infrastructure/libs/client/helpers";
import type { AnchorHTMLAttributes, JSX } from "preact";

type BadgeVariant =
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";

type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: JSX.Element | string | JSX.Element[] | (string | JSX.Element)[];
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    as?: "a" | "button" | "span" | "div";
};

export function Badge({
    children,
    variant = "default",
    size = "md",
    as = "span",
    className,
    ...rest
}: BadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        default: "bg-muted text-muted-foreground border-border",
        primary: "bg-primary text-primary-foreground border-primary",
        success:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-700",
        warning:
            "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 dark:border-amber-700",
        danger: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20 dark:border-red-700",
        info: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 dark:border-blue-700",
        outline: "bg-transparent text-foreground border-border",
    };

    const sizes: Record<BadgeSize, string> = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const Component = as as any;

    return (
        <Component
            class={cn(
                "inline-flex items-center font-medium rounded-full border transition-colors",
                variants[variant],
                sizes[size],
                className as string
            )}
            {...rest}
        >
            {children}
        </Component>
    );
}
