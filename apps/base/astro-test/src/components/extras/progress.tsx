import { cn } from "@infrastructure/libs/client/helpers";

interface ProgressProps {
    value: number;
    max?: number;
    variant?: "default" | "success" | "warning" | "danger" | "primary";
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    showLabel?: boolean;
    labelPosition?: "top" | "bottom" | "none";
    className?: string;
    trackClassName?: string;
    indicatorClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export function Progress({
    value,
    max = 100,
    variant = "default",
    size = "md",
    showValue = true,
    showLabel = true,
    labelPosition = "top",
    className,
    trackClassName,
    indicatorClassName,
    labelClassName,
    valueClassName,
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
        default: "bg-muted-foreground",
        primary: "bg-primary",
        success: "bg-emerald-500 dark:bg-emerald-600",
        warning: "bg-amber-500 dark:bg-amber-600",
        danger: "bg-destructive",
    };

    const sizes = {
        sm: {
            track: "h-1.5",
            indicator: "h-1.5",
            text: "text-xs",
        },
        md: {
            track: "h-2.5",
            indicator: "h-2.5",
            text: "text-sm",
        },
        lg: {
            track: "h-4",
            indicator: "h-4",
            text: "text-base",
        },
    };

    const renderLabel = () => (
        <div
            className={cn(
                "flex justify-between gap-2",
                sizes[size].text,
                labelClassName
            )}
        >
            {showLabel && (
                <span className="text-muted-foreground">Progreso</span>
            )}
            {showValue && (
                <span
                    className={cn(
                        "font-medium text-foreground",
                        valueClassName
                    )}
                >
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );

    return (
        <div className={cn("space-y-2 w-full", className)}>
            {labelPosition === "top" && renderLabel()}

            <div
                className={cn(
                    "w-full bg-muted rounded-full overflow-hidden",
                    sizes[size].track,
                    trackClassName
                )}
            >
                <div
                    className={cn(
                        "h-full transition-all duration-300 ease-out rounded-full",
                        variants[variant],
                        indicatorClassName
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {labelPosition === "bottom" && renderLabel()}
        </div>
    );
}
