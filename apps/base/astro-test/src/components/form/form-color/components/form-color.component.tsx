import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { ChevronDownIconSolid, QuestionIconSolid } from "@vigilio/react-icons";
import Card from "../../../extras/card";
import { anidarPropiedades } from "../../libs";
import { useFormColor } from "../hooks/use-form-color.hook";
import type { FormColorProps } from "../types";

const DEFAULT_COLORS = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
    "#000000",
    "#525252",
    "#969696",
    "#FFFFFF",
];

export function FormColor<T extends object>({
    title,
    question,
    presetColors = DEFAULT_COLORS,
    placeholder = "Elige un color",
    required = false,
    ...props
}: FormColorProps<T>) {
    const {
        isOpen,
        toggleOpen,
        customColor,
        mode,
        setMode,
        popupRef,
        handleColorChange,
        getPopupPosition,
        register,
        errors,
        currentValue,
    } = useFormColor({
        ...props,
        title,
        question,
        presetColors,
        placeholder,
        required,
    });

    const err = anidarPropiedades(
        errors,
        (props.name as unknown as string).split(".")
    );
    const nameId = `${props.name}-${Math.random().toString()}`;

    return (
        <div className="relative inline-block w-full" ref={popupRef}>
            <div class="space-y-2 w-full">
                {title && (
                    <label
                        htmlFor={nameId as string}
                        class="block text-sm font-semibold text-foreground"
                    >
                        {title}
                        {required ? (
                            <span className="text-primary">*</span>
                        ) : (
                            ""
                        )}
                    </label>
                )}
                <div>
                    {/* Botón principal */}
                    <button
                        type="button"
                        onClick={toggleOpen}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 transition w-full"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg"
                                style={{ backgroundColor: customColor }}
                            />
                            <span className="text-sm">
                                {currentValue ? currentValue : placeholder}
                            </span>
                        </div>
                        <ChevronDownIconSolid
                            className={`${
                                isOpen ? "rotate-180" : ""
                            } fill-foreground`}
                            {...sizeIcon.small}
                        />
                    </button>

                    {/* Popup */}
                    {isOpen && (
                        <Card
                            className="absolute z-50 w-72 rounded-2xl bg-card p-4"
                            style={getPopupPosition()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium text-foreground">
                                    Elige un color
                                </h3>
                                {question && (
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            className="rounded-full shadow p-1 bg-primary text-white hover:bg-primary/90 transition-colors"
                                        >
                                            <QuestionIconSolid className="w-[12px] h-[12px]" />
                                        </button>
                                        <div className="absolute -top-[40px] right-1 p-2 min-w-[160px] text-xs rounded-lg bg-popover border border-border hidden group-hover:block z-10">
                                            {question}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Toggle Paleta / Picker */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    className={`px-2 py-1 text-xs rounded-lg border ${
                                        mode === "palette"
                                            ? "bg-gray-100 border-gray-400 text-gray-800"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMode("palette");
                                    }}
                                >
                                    🎨 Paleta
                                </button>
                                <button
                                    className={`px-2 py-1 text-xs rounded-lg border ${
                                        mode === "picker"
                                            ? "bg-gray-100 border-gray-400 text-gray-800"
                                            : "border-gray-200 text-gray-500"
                                    }`}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMode("picker");
                                    }}
                                >
                                    🖌 Picker
                                </button>
                            </div>

                            {/* Vista según modo */}
                            {mode === "palette" ? (
                                <div className="grid grid-cols-6 gap-2">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleColorChange(color);
                                            }}
                                            style={{ backgroundColor: color }}
                                            className={`w-8 h-8 rounded-lg transition ${
                                                customColor === color
                                                    ? "ring-2 ring-blue-500"
                                                    : ""
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center mt-2">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                            handleColorChange(
                                                (e.target as HTMLInputElement)
                                                    .value
                                            )
                                        }
                                        className="w-20 h-20 cursor-pointer rounded-lg border border-gray-300"
                                        aria-label="Color picker"
                                    />
                                </div>
                            )}

                            {/* Input oculto para React Hook Form */}
                            <input
                                type="hidden"
                                {...register(props.name, props.options)}
                                value={customColor}
                            />
                        </Card>
                    )}
                </div>
            </div>{" "}
            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                    {err?.message}
                </p>
            ) : null}
        </div>
    );
}
