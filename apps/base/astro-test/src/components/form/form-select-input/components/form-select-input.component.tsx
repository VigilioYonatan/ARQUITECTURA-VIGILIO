import { cn } from "@infrastructure/libs/client/helpers";
import type { JSX } from "preact";
import type { Path, PathValue, RegisterOptions } from "react-hook-form";
import { useFormSelectInput } from "../hooks/use-form-select-input.hook";

export interface FormSelectInputProps<T extends object>
    extends Omit<JSX.IntrinsicElements["input"], "name"> {
    title: string;
    name: Path<T>;
    question?: JSX.Element | JSX.Element[] | string;
    ico?: JSX.Element | JSX.Element[];
    options?: RegisterOptions<T, Path<T>>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    array: { value: string; key: any }[];
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
}

function FormSelectInput<T extends object>({
    name,
    title,
    question,
    ico,
    array,
    options,
    isLoading = false,
    className,
    ...rest
}: FormSelectInputProps<T>) {
    const {
        register,
        setValue,
        dropdown,
        err,
        input,
        isFocused,
        // setIsFocused,
        valueArray,
    } = useFormSelectInput({ name, array });

    const nameId = `${name}-${Math.random().toString(32)}`;

    return (
        <div className="w-full mb-2 relative space-y-2">
            <label
                className="text-secondary-dark capitalize font-light text-sm "
                htmlFor={nameId as string}
            >
                {title}
                {rest.required ? <span className="text-primary">*</span> : ""}
            </label>
            <div className="flex items-center gap-2 relative w-full">
                <div className="relative flex gap-2 w-full">
                    {ico && (
                        <div
                            className={cn(
                                "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground  rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white"
                            )}
                        >
                            {ico}
                        </div>
                    )}

                    {dropdown.dropdownOpen ? (
                        <div
                            className="absolute p-2 rounded-md shadow  top-12 left-0 right-0 z-[10] bg-white  "
                            ref={dropdown.dropdown}
                        >
                            {valueArray.value.length ? (
                                valueArray.value.map((val) => (
                                    <button
                                        type="button"
                                        className="w-full text-sm py-1.5  hover:bg-gray-200 line-clamp-1"
                                        key={val.key}
                                        onClick={() => {
                                            setValue(
                                                name as Path<T>,
                                                val.key as PathValue<T, Path<T>>
                                            );
                                            input.value = val.value;
                                            dropdown.onClose();
                                        }}
                                    >
                                        {val.value}
                                    </button>
                                ))
                            ) : (
                                <span className="dark:text-white text-xs w-full text-center block py-2">
                                    No se encontró resultados
                                </span>
                            )}
                        </div>
                    ) : null}

                    <input
                        className={cn(
                            "w-full  py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                            "transition-all duration-200",
                            "backdrop-blur-sm",
                            isFocused && "bg-accent/50",
                            !!Object.keys(err).length &&
                                "!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
                            rest.disabled &&
                                "opacity-50 cursor-not-allowed bg-muted/30",
                            ico && "pl-14",
                            ico ? "pr-6 pl-11" : "px-4",
                            className as string
                        )}
                        id={nameId as string}
                        {...rest}
                        onChange={(e) => {
                            input.value = (e.target as HTMLInputElement).value;
                            if (dropdown.dropdownOpen) return;
                            dropdown.onOpen();
                        }}
                        value={input.value ?? ""}
                        disabled={isLoading || false}
                        autoComplete="off"
                    />

                    <input
                        type="hidden"
                        {...register(name as unknown as Path<T>, options)}
                    />
                </div>

                {question ? (
                    <div className="relative group">
                        <i className="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div className="text-xs min-w-[200px] max-w-[250px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white font-semibold">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>
            <div
                className={`${isLoading ? "loading-bar" : ""} w-full h-[2px] `}
            />
            {Object.keys(err).length ? (
                <p className="text-xs text-red-600">{err?.message}</p>
            ) : null}
            <style jsx>{`
                @keyframes loadingAnimation {
                    0% {
                        left: -100%;
                        width: 100%;
                    }
                    50% {
                        left: 0%;
                        width: 10%;
                    }
                    100% {
                        left: 100%;
                        width: 100%;
                    }
                }

                .loading-bar {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .loading-bar::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background-color: currentColor;
                    animation: loadingAnimation 2s infinite;
                }
            `}</style>
        </div>
    );
}

export default FormSelectInput;
