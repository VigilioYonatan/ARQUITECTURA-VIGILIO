import { createContext, type JSX } from "preact";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export const FormControlContext = createContext(
	{} as UseFormReturn<any, unknown, FieldValues>,
);

interface FormProps<T extends object> extends UseFormReturn<T> {
	children:
		| JSX.Element
		| JSX.Element[]
		| (JSX.Element | JSX.Element[] | string)[]
		| null;
	onSubmit: (data: T) => void;
	className?: string;
	id?: string;
}
function Form<T extends object>({
	children,
	onSubmit,
	className = "w-full flex flex-col gap-4",
	id,
	...rest
}: FormProps<T>) {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		<FormControlContext.Provider value={rest as any}>
			<form
				noValidate
				onSubmit={rest.handleSubmit(onSubmit)}
				className={className}
				id={id}
				autoComplete="off"
			>
				{children}
			</form>
		</FormControlContext.Provider>
	);
}

export default Form;
