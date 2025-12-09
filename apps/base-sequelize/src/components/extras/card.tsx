import { cn } from "@infrastructure/libs/client/helpers";
import type { HTMLAttributes } from "preact/compat";

type CardVariant = "default" | "elevated" | "outlined" | "glass";
type CardSize = "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    size?: CardSize;
    className?: string;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

// Componente principal Card
function Card({
    className,
    variant = "default",
    size = "md",
    ...props
}: CardProps) {
    const variants: Record<CardVariant, string> = {
        default: "bg-card border border-border",
        elevated:
            "bg-card border-border shadow-lg shadow-gray-400/10 dark:shadow-black/50",
        outlined: "bg-background border-2 border-border",
        glass: "bg-background/80 dark:bg-card/30 border border-border/50 backdrop-blur-md",
    };

    const sizes: Record<CardSize, string> = {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
    };

    return (
        <div
            className={cn(
                "flex flex-col transition-all duration-200  ",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

// Subcomponente CardHeader
function CardHeader({ className, ...props }: CardHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-1.5 p-4 border-b border-border",
                className
            )}
            {...props}
        />
    );
}

// Subcomponente CardTitle
function CardTitle({ className, as = "h3", ...props }: CardTitleProps) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const Component = as as unknown as any;
    return (
        <Component
            className={cn(
                "text-lg font-semibold leading-none tracking-tight text-foreground",
                className
            )}
            {...props}
        />
    );
}

// Subcomponente CardContent
function CardContent({ className, ...props }: CardContentProps) {
    return <div className={cn("p-4 flex-1", className)} {...props} />;
}

// Subcomponente CardFooter
function CardFooter({ className, ...props }: CardFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center p-4 border-t border-border",
                className
            )}
            {...props}
        />
    );
}

Card.header = CardHeader;
Card.title = CardTitle;
Card.content = CardContent;
Card.footer = CardFooter;

// Exportamos todos los componentes juntos
export default Card;
