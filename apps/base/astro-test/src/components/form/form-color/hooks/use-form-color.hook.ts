import { useContext, useEffect, useRef, useState } from "preact/hooks";
import {
    type FieldValues,
    type Path,
    type PathValue,
    type UseFormReturn,
} from "react-hook-form";
import { FormControlContext } from "../../Form";
import type { FormColorProps } from "../types";

export function useFormColor<T extends object>(props: FormColorProps<T>) {
    const { name, popupPosition = "bottom" } = props;
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState("#000000");
    const [mode, setMode] = useState<"palette" | "picker">("palette");
    const popupRef = useRef<HTMLDivElement>(null);

    const currentValue = watch(name);

    useEffect(() => {
        if (currentValue) {
            setCustomColor(currentValue as unknown as string);
        }
    }, [currentValue]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleColorChange = (color: string) => {
        setCustomColor(color);
        setValue(name, color as PathValue<T, Path<T>>, {
            shouldValidate: true,
        });
    };

    const getPopupPosition = () => {
        if (popupPosition === "right") {
            return { left: "100%", top: 0, marginLeft: "8px" };
        }
        return { top: "100%", left: 0, marginTop: "8px" };
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return {
        isOpen,
        toggleOpen,
        customColor,
        mode,
        setMode,
        popupRef,
        handleColorChange,
        getPopupPosition,
        register,
        watch,
        errors,
        currentValue,
    };
}
