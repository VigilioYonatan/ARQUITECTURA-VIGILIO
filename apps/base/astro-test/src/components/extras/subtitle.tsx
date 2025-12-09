import { JSX } from "preact/jsx-runtime";

interface SubtitleProps {
	children: JSX.Element | string | JSX.Element[];
	className?: string;
}
function Subtitle({ children, className }: SubtitleProps) {
	return (
		<h3
			class={`text-xl text-foreground font-bold ${className || "!text-center"}`}
		>
			{children}
		</h3>
	);
}

export default Subtitle;
