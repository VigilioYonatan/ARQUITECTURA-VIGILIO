import { cn } from "@infrastructure/libs/client/helpers";

type ToggleSize = "sm" | "md" | "lg";
interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: ToggleSize;
    className?: string;
    thumbClassName?: string;
}

function Toggle({
    checked,
    onChange,
    disabled = false,
    size = "md",
    className,
    thumbClassName,
}: ToggleProps) {
    const sizes: Record<
        ToggleSize,
        { track: string; thumb: string; translate: string }
    > = {
        sm: {
            track: "w-9 h-5 px-0.5",
            thumb: "w-4 h-4",
            translate: checked ? "translate-x-4" : "translate-x-0",
        },
        md: {
            track: "w-11 h-6 px-0.5",
            thumb: "w-5 h-5",
            translate: checked ? "translate-x-5" : "translate-x-0",
        },
        lg: {
            track: "w-14 h-7 px-1",
            thumb: "w-6 h-6",
            translate: checked ? "translate-x-7" : "translate-x-0",
        },
    };

    const sizeConfig = sizes[size];

    function handleToggle() {
        if (!disabled) {
            onChange(!checked);
        }
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={handleToggle}
            disabled={disabled}
            className={cn(
                "relative inline-flex items-center rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                checked ? "bg-primary" : "bg-muted",
                disabled && "opacity-50 cursor-not-allowed",
                sizeConfig.track,
                className
            )}
        >
            <span
                className={cn(
                    "inline-block rounded-full shadow-sm transform transition-all duration-200",
                    " border border-border",
                    checked ? "translate-x-full" : "translate-x-0",
                    checked ? "bg-muted" : "bg-primary",
                    sizeConfig.thumb,
                    thumbClassName
                )}
            />
        </button>
    );
}

export default Toggle;
