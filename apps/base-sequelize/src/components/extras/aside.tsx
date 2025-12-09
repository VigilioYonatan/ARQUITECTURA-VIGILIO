import { cn, sizeIcon } from "@infrastructure/libs/client/helpers";
import { CircleXIconLight } from "@vigilio/react-icons";
import { useEffect, useRef } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import Button from "./button";

interface AsideProps {
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    animationDuration?: number;
}
export default function Aside({
    isOpen,
    onClose,
    children,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    animationDuration = 300,
}: AsideProps) {
    const modalRef = useRef<HTMLDivElement>(null);

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

    return (
        <div
            class={cn(
                "fixed inset-0 w-full h-full bg-black/50 z-99999",
                isOpen ? "visible opacity-100" : "invisible opacity-0",
                "transition-all duration-300"
            )}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden={!isOpen}
        >
            <div
                class={cn(
                    "absolute  bg-background right-0 top-0 bottom-0 w-full sm:max-w-[400px] h-full flex flex-col gap-4",
                    isOpen ? "translate-x-0" : "translate-x-full",
                    "transition-all duration-300"
                )}
                onClick={(e) => e.stopPropagation()}
                aria-hidden={!isOpen}
            >
                <Button
                    type="button"
                    className="py-4! w-full rounded-none fill-white! flex items-center gap-2  "
                    onClick={onClose}
                >
                    {" "}
                    <CircleXIconLight {...sizeIcon.small} />
                    Cerrar
                </Button>

                <div class="p-4">{children}</div>
            </div>
        </div>
    );
}
