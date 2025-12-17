import { createContext, JSX } from "preact";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export const FormControlContext = createContext(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	{} as UseFormReturn<any, unknown, FieldValues>,
);

interface WebFormProps<T extends object> extends UseFormReturn<T> {
	children: JSX.Element | JSX.Element[] | null;
	onSubmit: (data: T) => void;
	className?: string;
	id?: string;
}
function WebForm<T extends object>({
	children,
	onSubmit,
	className = "w-full flex flex-col gap-4",
	id,
	...rest
}: WebFormProps<T>) {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		<FormControlContext.Provider value={rest as any}>
			<form
				noValidate
				onSubmit={rest.handleSubmit(onSubmit)}
				className={className}
				autoComplete="off"
				id={id}
			>
				{children}
			</form>
		</FormControlContext.Provider>
	);
}

export default WebForm;
