import { cn, sizeIcon } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import {
    MagnifyingGlassIconSolid,
    XIconSolid,
} from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import { filterContext } from "../context/filter.context";

export interface SearchProps {
    placeholder?: string;
    className?: string;
}

export function Search({ placeholder = "Buscar...", className }: SearchProps) {
    const context = useContext(filterContext);
    const { search } = context;
    const isFocused = useSignal(false);

    return (
        <div className={cn("relative w-full ", className)}>
            <div className="relative">
                <MagnifyingGlassIconSolid
                    className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-300"
                    {...sizeIcon.small}
                />
                <input
                    type="text"
                    value={search.value}
                    onInput={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            search.methods.handleInputChange(e.target.value);
                        }
                    }}
                    onFocus={() => {
                        isFocused.value = true;
                    }}
                    onBlur={() => {
                        isFocused.value = false;
                    }}
                    placeholder={placeholder}
                    className={cn(
                        "w-full pl-10 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                        "transition-all duration-200",
                        "placeholder-gray-500 text-gray-900",
                        isFocused.value && "ring-2 ring-primary border-primary"
                    )}
                />
                {search.value && (
                    <button
                        type="button"
                        onClick={search.methods.clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <XIconSolid className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
}
