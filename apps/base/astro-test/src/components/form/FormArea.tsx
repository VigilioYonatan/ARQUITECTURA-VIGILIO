import { cn } from "@infrastructure/libs/client/helpers";
import { QuestionIconSolid } from "@vigilio/react-icons/fontawesome";
import { useContext, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import type {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormControlAreaProps<T extends object>
    extends Omit<JSX.IntrinsicElements["textarea"], "name"> {
    title: string;
    name: Path<T>;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    contentMaxLength?: number;
    isFloating?: boolean;
}

function FormControlArea<T extends object>({
    name,
    title,
    question,
    options = {},
    isFloating = false,
    contentMaxLength,
    ...rest
}: FormControlAreaProps<T>) {
    const [isFocused, setIsFocused] = useState(false);
    const {
        register,
        formState: { errors },
        watch,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

    const err = anidarPropiedades(errors, (name as string).split("."));
    const nameId = `${name}-${Math.random().toString(32)}`;
    return (
        <div class="space-y-2 w-full">
            {title && (
                <label
                    htmlFor={nameId as string}
                    class={`block text-sm font-semibold text-foreground ${
                        isFloating
                            ? "absolute -mt-3 ml-3 px-1 bg-background z-10"
                            : ""
                    }`}
                >
                    {title}
                    {rest.required ? (
                        <span className="text-primary">*</span>
                    ) : (
                        ""
                    )}
                </label>
            )}

            <div class="relative flex gap-2">
                <textarea
                    class={cn(
                        "w-full py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                        "transition-all duration-200",
                        "backdrop-blur-sm",
                        isFocused && "bg-accent/50",
                        !!Object.keys(err).length &&
                            "!border-destructive !focus:ring-destructive/20 !focus:border-destructive",
                        rest.disabled &&
                            "opacity-50 cursor-not-allowed bg-muted/30",
                        "px-4",
                        isFloating && "pt-3",
                        rest.className as string
                    )}
                    id={nameId as string}
                    rows={rest.rows}
                    {...{
                        rest,
                        onBlur: (event) => {
                            setIsFocused(false);
                            rest.onBlur?.(event);
                        },
                        onFocus: (event) => {
                            setIsFocused(true);
                            rest.onFocus?.(event);
                        },
                    }}
                    {...register(name as unknown as Path<T>, options)}
                    autoComplete="off"
                    placeholder={rest.placeholder}
                >
                    {watch(name as unknown as Path<T>)}
                </textarea>

                {question && (
                    <div className="relative group self-center">
                        <div className="rounded-full shadow-lg p-1 bg-primary fill-white">
                            <QuestionIconSolid class="w-[12px] h-[12px]" />
                        </div>
                        <div className="shadow-xl text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 text-center absolute rounded-md bg-white z-10 font-semibold text-black">
                            {question}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                {Object.keys(err).length ? (
                    <p className="text-sm text-destructive flex items-center gap-1">
                        {err?.message}
                    </p>
                ) : (
                    <div className="" />
                )}
                {contentMaxLength && (
                    <p className="text-xs text-muted-foreground ">
                        {(watch(name as unknown as Path<T>) as string)
                            ?.length || 0}
                        /{contentMaxLength}
                    </p>
                )}
            </div>
        </div>
    );
}

export default FormControlArea;
