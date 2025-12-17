import type { JSX } from "preact/jsx-runtime";
import type { IconType } from "./types";

interface InfoRowProps {
	label: string;
	value: string | number | JSX.Element;
	icon?: JSX.Element | IconType;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 text-sm text-primary fill-primary">
				{icon && (
					<span className="text-gray-600 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
				)}
				<span>{label}:</span>
			</div>
			<p className="font-medium">{value}</p>
		</div>
	);
}

export default InfoRow;
