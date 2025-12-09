import { cn } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import { ChevronDownIconSolid } from "@vigilio/react-icons";
import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import type { Path } from "react-hook-form";

interface FormSelectNoFormProps<T extends object>
    extends Omit<JSX.IntrinsicElements["div"], "name" | "value" | "onChange"> {
    title: string;
    name: Path<T>;
    value: string | number | undefined;
    question?: JSX.Element | JSX.Element[] | string;
    placeholder: string;
    ico?: JSX.Element | JSX.Element[];
    isLoading?: boolean;
    array: { value: string | JSX.Element | JSX.Element[]; key: unknown }[];
    className?: string;
    disabled?: boolean;
    onChange?: (value: string | number | undefined) => void;
    required?: boolean;
}

function FormSelectNoForm<T extends object>({
    name,
    title,
    array,
    placeholder,
    isLoading = false,
    ico,
    question,
    className,
    disabled,
    value,
    required = false,
    onChange,
    ...rest
}: FormSelectNoFormProps<T>) {
    const [arraySelect, setArraySelect] = useState<
        { value: string; key: unknown }[]
    >([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{
        value: string;
        key: unknown;
    } | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const isFocused = useSignal(false);

    useEffect(() => {
        setArraySelect(array as { value: string; key: unknown }[]);
    }, [array]);

    // Initialize selected option
    useEffect(() => {
        if (value !== undefined && value !== null) {
            const option = arraySelect.find((item) => item.key === value);
            if (option) setSelectedOption(option);
        } else {
            setSelectedOption(null);
        }
    }, [value, arraySelect]);

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
        if (onChange) {
            onChange(option.key as string | number | undefined);
        }
        setIsOpen(false);
    };
    const nameId = `${name}-${Math.random().toString(32)}`;

    return (
        <div className="space-y-2 w-full" ref={selectRef} {...rest}>
            {title && (
                <label
                    htmlFor={nameId as string}
                    className="block text-sm font-light text-foreground"
                >
                    {title}
                    {required ? <span className="text-primary">*</span> : ""}
                </label>
            )}

            <div className="relative">
                {/* Input trigger */}
                {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
                <div
                    className={cn(
                        "w-full py-2 border border-input rounded-lg text-foreground min-w-[150px]",
                        disabled
                            ? "bg-muted/30 cursor-not-allowed"
                            : "bg-background",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                        "transition-all duration-200 cursor-pointer",
                        isFocused.value && "bg-accent/50",
                        isLoading &&
                            "opacity-50 cursor-not-allowed bg-muted/30",
                        ico ? "pl-10 pr-2" : "px-4",
                        className
                    )}
                    onClick={() =>
                        !isLoading && !disabled && setIsOpen(!isOpen)
                    }
                    onFocus={() => {
                        isFocused.value = true;
                    }}
                    onBlur={() => {
                        isFocused.value = false;
                    }}
                >
                    {ico && (
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-muted-foreground rounded-l-lg fill-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-primary">
                            {ico}
                        </div>
                    )}

                    <div className="flex justify-between items-center py-0.5">
                        <span
                            className={cn(
                                "text-sm line-clamp-1 flex items-center gap-2",
                                selectedOption ? "" : "text-muted-foreground"
                            )}
                        >
                            {selectedOption
                                ? selectedOption.value
                                : placeholder}
                        </span>

                        <ChevronDownIconSolid
                            className={cn(
                                "w-3 h-3 transition-transform duration-200",
                                isOpen && !disabled ? "rotate-180" : ""
                            )}
                        />
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && !disabled && (
                    <div className="absolute z-10 w-full min-w-[200px] mt-1 bg-background border border-input rounded-lg shadow-lg max-h-60 overflow-auto">
                        {/* Options list */}
                        {arraySelect.length > 0 ? (
                            <ul>
                                {arraySelect.map((option) => (
                                    <li
                                        key={String(option.key)}
                                        className={`px-4 py-2 cursor-pointer ${
                                            selectedOption?.key === option.key
                                                ? "bg-primary text-white [&>div>svg]:fill-white!"
                                                : "hover:text-primary  hover:fill-primary"
                                        } flex items-center gap-2 `}
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
                        <div className="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md bg-background text-foreground z-10 font-semibold">
                            {question}
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="w-full h-[2px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-primary/20">
                        <div className="absolute h-full bg-primary animate-[loading_2s_infinite] w-full" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormSelectNoForm;
