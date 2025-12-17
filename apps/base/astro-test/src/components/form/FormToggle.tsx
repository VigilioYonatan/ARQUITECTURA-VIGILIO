import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { Signal } from "@preact/signals";
import {
	EyeIconSolid,
	EyeSlashIconSolid,
	QuestionIconSolid,
} from "@vigilio/react-icons/fontawesome";
import { type JSX, useContext } from "react";
import type {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormToggleProps<T extends object>
	extends Omit<JSX.IntrinsicElements["input"], "type" | "name"> {
	title: string;
	name: Path<T>;
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
	ico?: JSX.Element | JSX.Element[];
	isEye?: boolean;
	required?: boolean;
}
function FormToggle<T extends object>({
	name,
	title,
	question,
	isEye = false,
	required = false,
	...rest
}: FormToggleProps<T>) {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		FormControlContext as any,
	);
	const value = watch(name as unknown as Path<T>);

	const err = anidarPropiedades(errors, (name as string).split("."));
	const nameId = `${name}-${Math.random().toString()}`;

	const toggleValue = () => {
		setValue(name as unknown as Path<T>, !value as PathValue<T, Path<T>>);
	};

	return (
		<div className="w-full space-y-2">
			{title.length ? (
				<label
					className="block text-sm font-semibold text-foreground"
					htmlFor={nameId}
				>
					{title}
					{required ? <span className="text-primary">*</span> : ""}
				</label>
			) : null}
			<div className="flex items-center gap-2">
				<div className="w-full h-8 flex items-center gap-2 text-xs rounded-lg overflow-hidden text-secondary-dark bg-paper-light my-1">
					{isEye ? (
						<button
							type="button"
							onClick={toggleValue}
							className="p-2 focus:outline-none"
						>
							{value ? (
								<EyeIconSolid {...sizeIcon.large} className=" text-primary" />
							) : (
								<EyeSlashIconSolid
									{...sizeIcon.large}
									className=" text-gray-500"
								/>
							)}
						</button>
					) : (
						// Renderizar toggle por defecto
						<>
							<input
								type="checkbox"
								id={nameId}
								{...rest}
								checked={value}
								{...register(name as unknown as Path<T>)}
								className="hidden"
							/>
							<label
								htmlFor={nameId}
								className={`relative border border-border inline-flex items-center cursor-pointer w-[4rem] h-8 rounded-full transition-all duration-300 ${
									value ? "bg-primary" : "bg-accent"
								}`}
							>
								<span
									className={`absolute block w-8 h-8 bg-white rounded-full transition-transform duration-300 transform ${
										value ? "translate-x-7" : "translate-x-0"
									}`}
								/>
							</label>
						</>
					)}
				</div>

				{question ? (
					<div className="relative group ">
						<div className="rounded-full shadow-lg p-1 bg-primary fill-white">
							<QuestionIconSolid class="w-[12px] h-[12px]" />
						</div>
						<div className="shadow-xl text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 text-center absolute rounded-md bg-white z-10 font-semibold text-black">
							{question}
						</div>
					</div>
				) : null}
			</div>

			{Object.keys(err).length ? (
				<p className="text-xs text-red-600">{err?.message}</p>
			) : null}
		</div>
	);
}

interface FormToggleCustomProps {
	title: string;
	value: Signal<boolean>;
	index?: number;
	onChange?: (value: boolean) => void;
	isEye?: boolean;
}
export function FormToggleCustom({
	title,
	value,
	index,
	onChange,
	isEye = false,
}: FormToggleCustomProps) {
	const nameId = `${title}-${index ?? Date.now().toString()}`;

	const toggleValue = () => {
		const newValue = !value.value;
		value.value = newValue;
		if (onChange) {
			onChange?.(newValue);
		}
	};

	return (
		<div className="w-full mb-2">
			<label
				className="text-sm text-secondary-dark capitalize font-bold"
				htmlFor={nameId}
			>
				{title}
			</label>
			<div className="flex items-center gap-2">
				<div className="w-full h-10 flex items-center gap-2 text-xs rounded-lg overflow-hidden text-secondary-dark bg-paper-light my-1">
					{isEye ? (
						// Renderizar icono de ojo cuando isEye es true
						<button
							type="button"
							onClick={toggleValue}
							className="p-2 focus:outline-none"
							aria-label={value.value ? "Ocultar" : "Mostrar"}
						>
							{value.value ? (
								<EyeIconSolid className="w-5 h-5 text-primary" />
							) : (
								<EyeSlashIconSolid className="w-5 h-5 text-gray-500" />
							)}
						</button>
					) : (
						// Renderizar toggle por defecto
						<>
							<input
								type="checkbox"
								id={nameId}
								checked={value.value}
								className="hidden"
								onChange={(e) => {
									value.value = (e.target as HTMLInputElement).checked;
									if (onChange) {
										onChange?.(value.value);
									}
								}}
							/>
							<label
								htmlFor={nameId}
								className={`relative inline-flex items-center cursor-pointer w-16 h-8 rounded-full transition-all duration-300 ${
									value.value ? "bg-primary" : "bg-card-foreground"
								}`}
							>
								<span
									className={`absolute block w-8 h-8 bg-white rounded-full transition-transform duration-300 transform ${
										value.value ? "translate-x-8" : "translate-x-0"
									}`}
								/>
							</label>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default FormToggle;
