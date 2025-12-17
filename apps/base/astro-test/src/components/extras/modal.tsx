import { createPortal, useEffect, useRef } from "preact/compat";
import type { JSX } from "preact/jsx-runtime";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: JSX.Element | JSX.Element[];
	closeOnOverlayClick?: boolean;
	closeOnEsc?: boolean;
	animationDuration?: number;
	modalClassName?: string;
	contentClassName?: string;
	closeButtonClassName?: string;
	content?: JSX.Element | JSX.Element[];
}

function Modal({
	isOpen,
	onClose,
	children,
	closeOnOverlayClick = false,
	closeOnEsc = true,
	animationDuration = 300,
	modalClassName = "justify-center",
	contentClassName = "",
	closeButtonClassName = "",
	content,
}: ModalProps) {
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
					"[&>div]:translate-y-5",
				);
				modalRef.current?.classList.add(
					"opacity-100",
					"visible",
					"[&>div]:translate-y-0",
				);
			}, 10);
		} else if (modalRef.current) {
			modalRef.current.classList.add(
				"opacity-0",
				"invisible",
				"[&>div]:translate-y-5",
			);
			modalRef.current.classList.remove(
				"opacity-100",
				"visible",
				"[&>div]:translate-y-0",
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
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			ref={modalRef}
			className={`${modalClassName} fixed inset-0 z-999999 flex justify-center items-center  bg-black/90 opacity-0 invisible transition-all duration-300 ease-in-out    overflow-auto`}
			onClick={closeOnOverlayClick ? onClose : undefined}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			<div
				className={`min-h-[500px] bg-card transition-all duration-300  rounded-2xl ${
					content ? "" : "p-8"
				}  ease-in-out translate-y-5 overflow-hidden   relative ${contentClassName} my-6 mx-2`}
				onClick={(e) => e.stopPropagation()}
			>
				{content ? <div class="px-6 pt-4">{content}</div> : null}
				<button
					onClick={onClose}
					type="button"
					className={`absolute top-2 right-2  ${
						closeButtonClassName
							? closeButtonClassName
							: content
								? "text-white"
								: "text-primary"
					} text-4xl z-10 font-black  `}
					aria-label="Cerrar modal"
				>
					&times;
				</button>
				{isOpen ? (
					content ? (
						<div className="p-6 children ">{children}</div>
					) : (
						children
					)
				) : null}
			</div>
		</div>,
		document.body,
	);
}

export default Modal;
