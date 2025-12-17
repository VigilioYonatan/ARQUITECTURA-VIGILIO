import { cn } from "@infrastructure/libs/client/helpers";
import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProps {
	content: string;
	position?: TooltipPosition;
	children: JSX.Element;
	className?: string;
}

function Tooltip({
	content,
	position = "top",
	children,
	className,
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	const positions: Record<TooltipPosition, string> = {
		top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
		left: "right-full top-1/2 -translate-y-1/2 mr-2",
		right: "left-full top-1/2 -translate-y-1/2 ml-2",
	};

	const arrows: Record<TooltipPosition, string> = {
		top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
		bottom:
			"bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
		left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
		right:
			"right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800",
	};

	return (
		<div
			className={cn("relative inline-block", className)}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{children}

			{isVisible && (
				<div
					className={cn(
						"absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap",
						positions[position],
					)}
				>
					{content}
					<div className={cn("absolute w-0 h-0 border-4", arrows[position])} />
				</div>
			)}
		</div>
	);
}
export default Tooltip;
