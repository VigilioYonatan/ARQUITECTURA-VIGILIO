import { cn } from "@infrastructure/libs/client/helpers";
import type {
    PaginatorResult,
    PaginatorResultError,
} from "@infrastructure/types/client";
import type { UseQuery } from "@vigilio/preact-fetching";
import type { UsePaginator } from "@vigilio/preact-paginator";
import { MagnifyingGlassIconSolid } from "@vigilio/react-icons/fontawesome";
import type { JSX } from "preact";
import type { Path } from "react-hook-form";
import Loader from "../../../extras/loader";
import {
    type SavedSearchItem,
    useFormArray,
} from "../hooks/use-form-array.hook";

export interface FormArrayProps<X extends object, T extends object> {
    title: string;
    name: Path<X>;
    paginator: UsePaginator;
    query: UseQuery<PaginatorResult<T>, PaginatorResultError>;
    onValue: (value: T) => SavedSearchItem;
    onChange?: (value: string) => void;
    placeholder?: string;
    max?: number;
    isUnique?: boolean;
    disabled?: boolean;
    defaultValue?: string;
    className?: string;
    ico?: JSX.Element | JSX.Element[];
    required?: boolean;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
function FormArray<X extends object, T extends object = {}>({
    name,
    title,
    paginator,
    query,
    onValue,
    onChange,
    placeholder,
    max,
    isUnique,
    disabled,
    defaultValue,
    className,
    ico,
    required,
}: FormArrayProps<X, T>) {
    const {
        isFocused,
        savedSearches,
        showSuggestions,
        handleSearchChange,
        handleSelectSuggestion,
        handleRemoveItem,
        hasSearches,
        data,
        err,
        valueFormated,
        searchValue,
    } = useFormArray({
        name,
        paginator,
        query,
        isUnique,
        max,
        onValue,
        onChange,
        defaultValue,
    });

    const nameId = `${name}-${Math.random().toString(32)}`;

    return (
        <div className={cn("space-y-2 w-full", className)}>
            {title && (
                <label
                    className="block text-sm font-light text-foreground"
                    htmlFor={`${nameId}-search`}
                >
                    {title}{" "}
                    {required ? <span className="text-primary">*</span> : ""}
                </label>
            )}

            <div className="relative">
                <div className="flex relative items-center gap-2">
                    {ico ? (
                        <div
                            className={cn(
                                "absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground  rounded-l-lg bg-primary z-1 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-white"
                            )}
                        >
                            {ico}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={cn(
                                "absolute left-2 text-muted-foreground hover:text-primary transition-colors",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={disabled}
                        >
                            <MagnifyingGlassIconSolid width={18} />
                        </button>
                    )}

                    {/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> */}
                    <input
                        id={`${nameId}-search`}
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            showSuggestions.value = true;
                            isFocused.value = true;
                        }}
                        onBlur={() =>
                            setTimeout(() => {
                                showSuggestions.value = false;
                            }, 200)
                        }
                        placeholder={placeholder || ""}
                        className={cn(
                            "flex-1 py-2 bg-card-foreground  border border-input rounded-lg text-foreground placeholder-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring/30",
                            "transition-all duration-200 pl-10",
                            isFocused.value && "bg-accent/50",
                            !!Object.keys(err).length &&
                                "!border-destructive !focus:ring-destructive/20 focus:border-destructive",
                            disabled &&
                                "opacity-50 cursor-not-allowed bg-muted/30",
                            ico ? "pr-6 pl-14" : "px-4"
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={showSuggestions.value}
                        disabled={
                            query.isFetching ||
                            query.isLoading ||
                            (max && valueFormated.length >= max) ||
                            disabled ||
                            false
                        }
                    />
                    {query.isFetching || query.isLoading ? (
                        <Loader
                            variant="spinner"
                            className="fill-primary! text-primary!"
                            size="sm"
                        />
                    ) : null}
                </div>

                {/* Lista de sugerencias */}
                {showSuggestions.value && data && data?.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full  border border-input rounded-lg shadow-lg max-h-60 overflow-y-auto bg-card-foreground">
                        <ul className="divide-y divide-input">
                            {data?.map((props: SavedSearchItem) => (
                                <li key={String(props.id)}>
                                    <button
                                        onClick={() =>
                                            handleSelectSuggestion(props)
                                        }
                                        type="button"
                                        className={cn(
                                            "px-4 py-2 w-full text-left text-foreground",
                                            "hover:bg-accent focus:bg-accent transition-colors duration-150",
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        {props.value}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Búsquedas guardadas */}
            {hasSearches.value && (
                <div className="mt-2">
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        <ul className="flex flex-wrap gap-2">
                            {savedSearches.value.map((item) => (
                                <li
                                    key={String(item.id)}
                                    className={cn(
                                        "py-1.5 px-3 rounded-full shadow-sm flex items-center gap-2",
                                        "bg-accent text-accent-foreground border border-input/50",
                                        "relative pr-6 group"
                                    )}
                                >
                                    <span className="text-sm">
                                        {item.value}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        className={cn(
                                            "absolute -top-1 -right-1 rounded-full w-4 h-4 flex justify-center items-center",
                                            "bg-destructive text-destructive-foreground text-xs font-bold",
                                            "opacity-0 group-hover:opacity-100 transition-opacity",
                                            "hover:bg-destructive/90"
                                        )}
                                        aria-label="Remove item"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                    {err?.message}
                </p>
            ) : (
                <span className="h-3 block w-full" />
            )}
        </div>
    );
}

export default FormArray;
