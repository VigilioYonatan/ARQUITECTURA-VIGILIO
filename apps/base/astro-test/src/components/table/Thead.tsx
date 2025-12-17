import type { JSX } from "preact/jsx-runtime";

interface TheadProps {
	className?: string;
	children: JSX.Element | JSX.Element[];
}
function Thead({
	children,
	className = "bg-card-foreground border-b border-border",
}: TheadProps) {
	return <thead className={className}>{children}</thead>;
}

export default Thead;
