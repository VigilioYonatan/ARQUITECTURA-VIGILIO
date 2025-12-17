import { cn } from "@infrastructure/libs/client/helpers";

interface LoaderProps {
	size?: "sm" | "md" | "lg";
	variant?: "spinner" | "dots" | "pulse";
	className?: string;
	color?: string;
}

function Loader({
	size = "md",
	variant = "spinner",
	className,
	color = "#ffffff",
}: LoaderProps) {
	const sizes = {
		sm: "min-w-4 h-4",
		md: "min-w-6 h-6",
		lg: "min-w-8 h-8",
	};

	if (variant === "dots") {
		return (
			<div className={cn("flex space-x-1", className)}>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className={cn(
							" rounded-full animate-pulse",
							size === "sm" && "w-2 h-2",
							size === "md" && "w-3 h-3",
							size === "lg" && "w-4 h-4",
						)}
						style={{
							animationDelay: `${i * 0.2}s`,
							animationDuration: "1s",
							backgroundColor: color,
						}}
					/>
				))}
			</div>
		);
	}

	if (variant === "pulse") {
		return (
			<div
				className={cn("rounded-full animate-pulse", sizes[size], className)}
				style={{
					backgroundColor: color,
				}}
			/>
		);
	}

	return (
		<div
			className={cn(
				"border-2 border-gray-300  rounded-full animate-spin",
				sizes[size],
				className,
			)}
			style={{ borderTopColor: color }}
		/>
	);
}
export default Loader;
