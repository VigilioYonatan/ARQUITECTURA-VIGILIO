import { useContext } from "react";
import type {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import { FormControlContext } from "./Form";

export interface FormCheckProps<T extends object> {
	title: string;
	subtitle: string;
	name: Path<T>;
	options?: RegisterOptions<T, Path<T>>;
}
function FormCheck<T extends object>({
	name,
	title,
	subtitle,
}: FormCheckProps<T>) {
	const { watch, setValue } = useContext<
		UseFormReturn<T, unknown, FieldValues>
	>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		FormControlContext as any,
	);
	const value = watch(name as unknown as Path<T>);

	const nameId = `${name}-${Math.random().toString()}`;

	const toggleValue = () => {
		setValue(name as unknown as Path<T>, !value as PathValue<T, Path<T>>);
	};

	return (
		<div className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl">
			<label htmlFor={nameId}>
				<p className="font-semibold text-foreground">{title}</p>
				<p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
			</label>
			<input
				id={nameId}
				type="checkbox"
				name="enabled_web"
				checked={value}
				onChange={toggleValue}
				className="min-w-6 min-h-6 rounded cursor-pointer accent-primary"
			/>
		</div>
	);
}

export default FormCheck;
