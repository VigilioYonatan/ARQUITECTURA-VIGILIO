import { useClickOutside } from "@hooks/useClickOutside";
import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { useComputed, useSignal } from "@preact/signals";
import { EllipsisVerticalIconSolid } from "@vigilio/react-icons/fontawesome";
import { useRef } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import Button from "./button";
import Loader from "./loader";

interface EllipsisMenuProps {
	children: JSX.Element | JSX.Element[];
	position?: "left" | "right";
	classNameMenu?: string;
	isLoading?: boolean;
	size?: "small" | "medium" | "large";
}

function EllipsisMenu({
	children,
	position = "right",
	classNameMenu = "",
	isLoading = false,
	size = "large",
}: EllipsisMenuProps) {
	const isOpen = useSignal(false);
	const menuRef = useRef<HTMLDivElement>(null);
	useClickOutside(menuRef, () => {
		isOpen.value = false;
	});

	const toggleMenu = () => {
		isOpen.value = !isOpen.value;
	};

	const menuClasses = useComputed(() => {
		const base = `absolute ${
			position === "right" ? "left-full" : "right-full"
		} top-0 bg-popover border border-border p-1 min-w-[120px] rounded-lg z-10 transition-all duration-200 ease-in-out transform`;

		return isOpen.value
			? `${base} opacity-100 scale-100`
			: `${base} opacity-0 scale-95 pointer-events-none`;
	});

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			class="relative inline-block"
			ref={menuRef}
			onClick={(e) => e.stopPropagation()}
		>
			<Button
				type="button"
				className="!px-0 py-0"
				onClick={toggleMenu}
				variant="ghost"
			>
				{isLoading ? (
					<Loader className="w-4 h-4" />
				) : (
					<EllipsisVerticalIconSolid {...sizeIcon[size]} />
				)}
			</Button>

			<div class={`${menuClasses} ${classNameMenu}  `}>{children}</div>
		</div>
	);
}

export default EllipsisMenu;
