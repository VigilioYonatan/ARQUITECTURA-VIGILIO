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
import { FormControlContext } from "./WebForm";

export interface WebFormControlProps<T extends object>
	extends Omit<JSX.IntrinsicElements["input"], "type" | "name"> {
	title: string;
	name: Path<T>;
	type?: HTMLInputElement["type"];
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
}

function WebFormControl<T extends object>({
	name,
	title,
	type = "text",
	question,
	options = {},
	className,
	...rest
}: WebFormControlProps<T>) {
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
		<div class="flex flex-col gap-1 w-full">
			{title && (
				<label htmlFor={nameId as string} class="text-sm font-bold">
					{title}
					{rest.required ? <span className="text-primary">*</span> : ""}
				</label>
			)}

			<div class="relative flex gap-1">
				<input
					class={cn(
						"border border-gray-400 bg-white text-sm rounded-lg py-1.5 px-2 w-full text-black",
						!!Object.keys(err).length &&
							"!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
						rest.disabled && "opacity-50 cursor-not-allowed bg-muted/30",
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
						className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors fill-muted-foreground"
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

export default WebFormControl;
