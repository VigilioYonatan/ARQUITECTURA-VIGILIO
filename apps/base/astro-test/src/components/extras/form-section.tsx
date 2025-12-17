import type { JSX } from "preact/jsx-runtime";

interface FormSectionProps {
	ico: JSX.Element;
	title: string;
}

function FormSection({ ico, title }: FormSectionProps) {
	return (
		<div class="flex items-center gap-4 fill-primary mb-4">
			{ico}
			<span class="text-xl font-bold text-gray-700">{title}</span>
		</div>
	);
}

export default FormSection;
