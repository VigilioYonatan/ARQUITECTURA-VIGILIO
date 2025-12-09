import { cn } from "@infrastructure/libs/client/helpers";
import {
    CircleCheckIconLight,
    CircleInfoIconLight,
    CircleXIconLight,
    TriangleExclamationIconLight,
    XmarkIconLight,
} from "@vigilio/react-icons";
import type { IconType, TypeComponent } from "./types";

interface AlertProps {
    type: TypeComponent;
    title?: string;
    message: string;
    onClose?: () => void;
    className?: string;
}

function Alert({ type, title, message, onClose, className }: AlertProps) {
    const icons: Record<TypeComponent, IconType> = {
        success: CircleCheckIconLight,
        error: CircleXIconLight,
        warning: TriangleExclamationIconLight,
        info: CircleInfoIconLight,
    };

    const styles: Record<
        TypeComponent,
        { container: string; icon: string; title: string }
    > = {
        success: {
            container:
                "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-100",
            icon: "fill-emerald-600 dark:fill-green-400",
            title: "text-emerald-700 dark:text-green-200",
        },
        error: {
            container:
                "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-100",
            icon: "fill-red-600 dark:fill-red-400",
            title: "text-red-700 dark:text-red-200",
        },
        warning: {
            container:
                "bg-amber-50 border-amber-200 text-amber-800 dark:bg-yellow-900/20 dark:border-yellow-500/30 dark:text-yellow-100",
            icon: "fill-amber-600 dark:fill-yellow-400",
            title: "text-amber-700 dark:text-yellow-200",
        },
        info: {
            container:
                "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500/30 dark:text-blue-100",
            icon: "fill-blue-600 dark:fill-blue-400",
            title: "text-blue-700 dark:text-blue-200",
        },
    };

    const Icon = icons[type];
    const style = styles[type];

    return (
        <div
            class={cn(
                "p-4 rounded-lg border backdrop-blur-sm",
                style.container,
                className
            )}
        >
            <div class="flex items-start gap-3">
                <Icon
                    class={cn("mt-0.5 flex-shrink-0", style.icon)}
                    width={20}
                    height={20}
                />

                <div class="flex flex-col">
                    {title && (
                        <h4 class={cn("font-medium", style.title)}>{title}</h4>
                    )}
                    <p class="text-sm leading-relaxed">{message}</p>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        class="shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                    >
                        <XmarkIconLight
                            width={20}
                            height={20}
                            class="text-current opacity-70 hover:opacity-100"
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Alert;
