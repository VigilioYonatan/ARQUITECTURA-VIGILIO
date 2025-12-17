import { cn } from "@infrastructure/libs/client/helpers";
import {
	EyeIconSolid,
	EyeSlashIconSolid,
	QuestionIconSolid,
} from "@vigilio/react-icons";
import type { JSX } from "preact";
import { useContext, useState } from "preact/hooks";
import type {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormControlProps<T extends object>
	extends Omit<JSX.IntrinsicElements["input"], "type" | "name"> {
	title: string;
	name: Path<T>;
	type?: HTMLInputElement["type"];
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
	ico?: JSX.Element | JSX.Element[];
}

function FormControl<T extends object>({
	name,
	title,
	type = "text",
	question,
	options = {},
	ico,
	className,
	...rest
}: FormControlProps<T>) {
	const {
		register,
		formState: { errors },
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
	const [hidden, useHidden] = useState(true);
	const [isFocused, setIsFocused] = useState(false);

	function onChangeHidde() {
		useHidden(!hidden);
	}

	const err = anidarPropiedades(errors, (name as unknown as string).split("."));
	const isPassword = type === "password";
	const inputType = isPassword && !hidden ? "text" : type;
	const nameId = `${name}-${Math.random().toString(32)}`;
	return (
		<div class="space-y-1.5 w-full">
			{title && (
				<label
					htmlFor={nameId as string}
					class="block text-sm font-semibold text-foreground"
				>
					{title}
					{rest.required ? <span className="text-primary">*</span> : ""}
				</label>
			)}

			<div class="relative flex gap-2">
				{ico && (
					<div
						class={cn(
							"absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground  rounded-l-lg  z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-foreground",
						)}
					>
						{ico}
					</div>
				)}
				<input
					class={cn(
						"w-full  py-2 border border-input rounded-lg text-foreground placeholder-muted-foreground",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
						"transition-all duration-200",
						"backdrop-blur-sm",
						isFocused && "bg-accent/50",
						!!Object.keys(err).length &&
							"border-destructive! !focus:ring-destructive/20 !focus:border-destructive",
						rest.disabled && "cursor-not-allowed  bg-card-foreground",
						ico && "pl-12",
						ico ? "pr-6" : "px-4",
						className as string,
					)}
					id={nameId as string}
					type={inputType}
					autoComplete="off"
					onFocus={() => {
						setIsFocused(true);
					}}
					{...rest}
					{...register(name as unknown as Path<T>, options)}
					onBlur={() => {
						setIsFocused(false);
					}}
				/>

				{isPassword && (
					<button
						type="button"
						onClick={onChangeHidde}
						className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors fill-muted-foreground"
					>
						{hidden ? (
							<EyeSlashIconSolid class="w-5 h-5 " />
						) : (
							<EyeIconSolid class="w-5 h-5" />
						)}
					</button>
				)}

				{question && (
					<div className="relative group  self-center">
						<div className="rounded-full shadow-lg p-1 bg-primary fill-white">
							<QuestionIconSolid class="w-[12px] h-[12px]" />
						</div>
						<div className="shadow-xl text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1  text-center absolute rounded-md bg-white   z-10 font-semibold text-black">
							{question}
						</div>
					</div>
				)}
			</div>

			{Object.keys(err).length ? (
				<p className="text-sm text-destructive flex items-center gap-1">
					{err?.message}
				</p>
			) : null}
		</div>
	);
}

export default FormControl;
