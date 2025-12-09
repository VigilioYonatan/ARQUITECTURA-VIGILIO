import { cn } from "@infrastructure/libs/client/helpers";
import {
    CircleCheckIconSolid,
    CircleExclamationIconSolid,
    CircleXIconSolid,
    InfoIconSolid,
} from "@vigilio/react-icons";
import { JSX } from "preact/jsx-runtime";
import type { IconType } from "./types";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    type: ToastType;
    title?: string;
    message: string;
    className?: string;
    custom?: JSX.Element | JSX.Element[] | string;
}

function Toast({ type, title, message, className, custom }: ToastProps) {
    const icons: Record<ToastType, IconType> = {
        success: CircleCheckIconSolid,
        error: CircleXIconSolid,
        warning: CircleExclamationIconSolid,
        info: InfoIconSolid,
    };

    const styles: Record<
        ToastType,
        { container: string; icon: string; progress: string }
    > = {
        success: {
            container: "bg-green-900/90 border-green-500/50 text-green-100",
            icon: "fill-green-400",
            progress: "bg-green-400",
        },
        error: {
            container:
                "border-l-3 border-destructive/50 [&>div>div>h4]:text-destructive! text-destructive-foreground",
            icon: "fill-red-400",
            progress: "bg-destructive-foreground",
        },
        warning: {
            container: "bg-yellow-900/90 border-yellow-500/50 text-yellow-100",
            icon: "fill-yellow-400",
            progress: "bg-yellow-400",
        },
        info: {
            container: "bg-blue-900/90 border-blue-500/50 text-blue-100",
            icon: "fill-blue-400",
            progress: "bg-blue-400",
        },
    };

    const Icon = icons[type];
    const style = styles[type];

    return (
        <div
            className={cn(
                " max-w-sm w-full p-4 rounded-lg  backdrop-blur-sm shadow-2xl overflow-hidden",
                "transform transition-all duration-300 ease-out",
                style.container,
                className
            )}
        >
            {custom ? (
                custom
            ) : (
                <div className="flex items-start gap-3">
                    <Icon
                        className={cn("w-5 h-5 mt-0.5 shrink-0", style.icon)}
                    />

                    <div className="flex-1 min-w-0">
                        {title && <h4 className="font-medium mb-1">{title}</h4>}
                        <p className="text-sm leading-relaxed">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Toast;
