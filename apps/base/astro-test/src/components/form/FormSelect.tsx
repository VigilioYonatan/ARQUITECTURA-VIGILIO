import { cn } from "@infrastructure/libs/client/helpers";
import { ChevronDownIconSolid } from "@vigilio/react-icons";
import type { JSX } from "astro/jsx-runtime";
import type { HTMLAttributes } from "preact";
import { useContext, useEffect, useRef, useState } from "react";
import type {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormSelectProps<T extends object>
    extends Omit<HTMLAttributes<HTMLDivElement>, "name"> {
    title: string;
    name: Path<T>;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    placeholder: string;
    ico?: JSX.Element | JSX.Element[];
    isLoading?: boolean;
    array: { value: string; key: unknown }[];
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

function FormSelect<T extends object>({
    name,
    title,
    question,
    options = {},
    array,
    placeholder,
    isLoading = false,
    ico,
    className,
    disabled,
    ...rest
}: FormSelectProps<T>) {
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        key: unknown;
    } | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const err = anidarPropiedades(errors, (name as string).split("."));

    // Initialize selected option
    useEffect(() => {
        const currentValue = getValues(name as unknown as Path<T>);
        if (currentValue) {
            const option = array.find((item) => item.key === currentValue);
            if (option) setSelectedOption(option);
        }
    }, [array, getValues, name]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: { value: string; key: unknown }) => {
        setSelectedOption(option);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setValue(name as unknown as Path<T>, option.key as any, {
            shouldValidate: true,
        });
        setIsOpen(false);
    };
    const nameCustom = `${name as string}-${Math.random().toString(32)}`;

    return (
        <div className="space-y-2 w-full" ref={selectRef} {...rest}>
            {title && (
                <label
                    htmlFor={nameCustom as string}
                    class="block text-sm font-semibold text-foreground !text-secondary-dark capitalize"
                >
                    {title}
                    {rest.required ? (
                        <span className="text-primary">*</span>
                    ) : (
                        ""
                    )}
                </label>
            )}

            <div className="relative">
                {/* Input trigger */}
                {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
                <div
                    className={cn(
                        "w-full py-2 border border-input rounded-lg text-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                        "transition-all duration-200 cursor-pointer",
                        !isFocused && "bg-card",
                        !!Object.keys(err).length &&
                            "border-destructive! !focus:ring-destructive/20 !focus:border-destructive",
                        isLoading &&
                            "opacity-50 cursor-not-allowed bg-muted/30",
                        ico ? "pl-8 pr-2" : "px-4",
                        className
                    )}
                    onClick={() => !isLoading && setIsOpen(!isOpen)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                    {ico && (
                        <div
                            class={cn(
                                "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground  rounded-l-lg  z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-foreground"
                            )}
                        >
                            {ico}
                        </div>
                    )}

                    <div
                        className={`flex justify-between items-center py-0.5 ${
                            ico ? "pl-4" : ""
                        } ${
                            disabled
                                ? "bg-card-foreground cursor-not-allowed "
                                : ""
                        }`}
                    >
                        <span
                            className={cn(
                                "text-sm line-clamp-1 text-start!",
                                selectedOption ? "" : "text-muted-foreground"
                            )}
                        >
                            {selectedOption
                                ? selectedOption.value
                                : placeholder}
                        </span>

                        <ChevronDownIconSolid
                            className={cn(
                                "w-3 h-3 fill-foreground transition-transform duration-200",
                                isOpen && !disabled ? "rotate-180" : ""
                            )}
                        />
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && !disabled && (
                    <div className="absolute z-10 w-full mt-1  border border-input rounded-lg shadow-lg max-h-60 overflow-auto bg-card">
                        {/* Options list */}
                        {array.length > 0 ? (
                            <ul>
                                {array.map((option) => (
                                    <li
                                        key={String(option.key)}
                                        className={`px-4 py-2 cursor-pointer   ${
                                            selectedOption?.key === option.key
                                                ? "bg-primary text-white"
                                                : "hover:text-primary"
                                        }`}
                                        onClick={() => handleSelect(option)}
                                    >
                                        {option.value}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-2 text-muted-foreground text-sm">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                )}

                {question && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 group">
                        <i className="fa-solid fa-circle-question text-xs text-muted-foreground" />
                        <div className="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md text-foreground z-10 font-semibold">
                            {question}
                        </div>
                    </div>
                )}

                {/* Hidden input for form registration */}
                <input
                    type="hidden"
                    {...register(name as unknown as Path<T>, options)}
                />
            </div>

            {isLoading && (
                <div className="w-full h-[2px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-primary/20">
                        <div className="absolute h-full bg-primary animate-[loading_2s_infinite] w-full" />
                    </div>
                </div>
            )}
            {
                Object.keys(err).length ? (
                    <p className="text-sm text-destructive flex items-center gap-1">
                        {err?.message}
                    </p>
                ) : null
                // <span class="h-5 w-full block" />
            }
        </div>
    );
}
export function formSelectNumber(value: string) {
    return Number(value) > 0 ? Number(value) : null;
}
export default FormSelect;
