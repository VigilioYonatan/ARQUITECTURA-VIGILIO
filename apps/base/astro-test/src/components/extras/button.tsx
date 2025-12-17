import { cn } from "@infrastructure/libs/client/helpers";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "preact";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "success"
	| "gradient";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	loading_title?: string;
	fullWidth?: boolean;
	as?: "button" | "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

function Button({
	className,
	variant = "primary",
	size = "md",
	loading = false,
	disabled = false,
	fullWidth = false,
	children,
	loading_title = "Cargando...",
	as = "button",
	...props
}: ButtonProps) {
	const baseStyles = cn(
		"inline-flex  items-center justify-center font-medium transition-all",
		"duration-200 focus-visible:outline-none focus-visible:ring-2",
		"focus-visible:ring-ring focus-visible:ring-offset-2",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		"relative ",
		fullWidth ? "w-full" : "",
	);

	const variants: Record<ButtonVariant, string> = {
		primary: cn(
			"bg-primary text-primary-foreground hover:bg-primary/90 fill-white text-white",
			"shadow hover:shadow-md",
			"border border-primary",
		),
		secondary: cn(
			"bg-black text-white fill-white dark:bg-white dark:text-black dark:fill-black dark:hover:bg-white/80",
			"border border-border",
		),
		outline: cn(
			"border border-input  fill-foreground hover:bg-accent hover:text-accent-foreground text-primary hover:[&>svg]:fill-primary",
			"shadow-sm",
		),
		ghost:
			"hover:bg-accent fill-foreground text-foreground hover:text-accent-foreground hover:fill-primary",
		danger: cn(
			"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			"shadow-sm border border-destructive/50 fill-white",
		),
		success: cn(
			"bg-emerald-600 text-white hover:bg-emerald-700",
			"dark:bg-emerald-700 dark:hover:bg-emerald-800",
			"shadow-sm border border-emerald-500/30 dark:border-emerald-600/50",
		),
		gradient: cn(
			"bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white fill-white",
		),
	};

	const sizes: Record<ButtonSize, string> = {
		sm: "h-8 px-3  text-xs rounded-md",
		md: "h-10 px-4  py-2 text-sm rounded-md",
		lg: "h-12 px-8  text-base rounded-lg",
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const Component = as as any;
	return (
		<Component
			className={cn(
				baseStyles,
				variants[variant],
				sizes[size],
				loading && "cursor-wait px-6!",
				className as string,
			)}
			disabled={disabled || loading}
			aria-busy={loading}
			{...props}
		>
			{loading ? (
				<div className="flex items-center justify-center gap-2">
					<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
					{loading_title}
				</div>
			) : (
				children
			)}
		</Component>
	);
}
export default Button;
