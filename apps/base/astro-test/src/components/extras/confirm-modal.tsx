import { cn } from "@infrastructure/libs/client/helpers";
import {
    CircleCheckIconSolid,
    CircleInfoIconSolid,
    CircleXIconSolid,
    TriangleExclamationIconSolid,
} from "@vigilio/react-icons";
import { createPortal, useEffect, useRef } from "preact/compat";
import Button from "./button";
import type { IconType } from "./types";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";

type ConfirmModalType = "default" | "danger" | "success" | "warning";
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmModalType;
    className?: string;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    animationDuration?: number;
    contentClassName?: string;
    variant?: ButtonVariant;
}

function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "default",
    className,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    animationDuration = 300,
    contentClassName = "",
    variant = "outline",
}: ConfirmModalProps) {
    const icons: Record<ConfirmModalType, IconType> = {
        default: CircleInfoIconSolid,
        danger: CircleXIconSolid,
        success: CircleCheckIconSolid,
        warning: TriangleExclamationIconSolid,
    };

    const iconColors: Record<ConfirmModalType, string> = {
        default: "fill-primary dark:fill-primary/60",
        danger: "fill-destructive dark:fill-destructive/60",
        success: "fill-green-500 dark:fill-green-400",
        warning: "fill-yellow-500 dark:fill-yellow-400",
    };

    const confirmVariants = {
        default: "primary" as const,
        danger: "danger" as const,
        success: "success" as const,
        warning: "secondary" as const,
    };

    const Icon = icons[type];
    const modalRef = useRef<HTMLDivElement>(null);

    // Manejo de animaciones y eventos
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (closeOnEsc && e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);

            // Forzar reflow para activar la animación
            setTimeout(() => {
                modalRef.current?.classList.remove(
                    "opacity-0",
                    "invisible",
                    "[&>div]:translate-y-5"
                );
                modalRef.current?.classList.add(
                    "opacity-100",
                    "visible",
                    "[&>div]:translate-y-0"
                );
            }, 10);
        } else if (modalRef.current) {
            modalRef.current.classList.add(
                "opacity-0",
                "invisible",
                "[&>div]:translate-y-5"
            );
            modalRef.current.classList.remove(
                "opacity-100",
                "visible",
                "[&>div]:translate-y-0"
            );

            // Esperar a que termine la animación antes de limpiar
            const timer = setTimeout(() => {
                document.body.style.overflow = "unset";
            }, animationDuration);

            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose, closeOnEsc, animationDuration]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[999999] flex justify-center items-center bg-black/90 opacity-0 invisible transition-all duration-300 ease-in-out overflow-auto"
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "w-full max-w-md bg-card border border-border rounded-xl shadow-2xl transform transition-all duration-300 translate-y-5 p-6",
                    contentClassName
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={cn(
                            "p-2 rounded-full bg-accent",
                            iconColors[type]
                        )}
                    >
                        <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                        {title}
                    </h2>
                </div>

                {/* Message */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button type="button" variant={variant} onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={confirmVariants[type]}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmModal;
