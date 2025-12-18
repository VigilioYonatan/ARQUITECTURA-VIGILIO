import useDropdown from "@hooks/useDropdown";
import { useSignal } from "@preact/signals";
import { useContext, useEffect, useState } from "preact/hooks";
import {
    type FieldValues,
    type Path,
    type PathValue,
    type UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from "../..";
import { FormControlContext } from "../../Form";

export interface UseFormSelectInputProps<T extends object> {
    name: Path<T>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    array: { value: string; key: any }[];
}

export function useFormSelectInput<T extends object>({
    name,
    array,
}: UseFormSelectInputProps<T>) {
    const {
        register,
        formState: { errors },
        setValue,
        getValues,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const dropdown = useDropdown();

    const err = anidarPropiedades(errors, (name as string).split("."));
    const input = useSignal<null | string>(null);
    const [isFocused, setIsFocused] = useState(false);

    const valueArray = useSignal<{ value: string; key: unknown }[]>([]);
    const value = getValues(name as Path<T>);

    useEffect(() => {
        if (array.length) {
            if (!input.value || !input.value?.length) {
                valueArray.value = [];
                setValue(name as Path<T>, null as PathValue<T, Path<T>>);
                return;
            }
            valueArray.value = array
                .filter((val) =>
                    new RegExp(input.value!.toLowerCase(), "i").test(
                        val.value.toLowerCase()
                    )
                )
                .slice(0, 8);
            if (!valueArray.value.length) {
                setValue(name as Path<T>, null as PathValue<T, Path<T>>);
            }
        }
    }, [input.value, array]);

    useEffect(() => {
        if (value) {
            const data = array.find((val) => val.key === value) ?? null;
            if (data) {
                input.value = data.value;
                setValue(name as Path<T>, data?.key as PathValue<T, Path<T>>);
            }
        }
    }, [value]);

    useEffect(() => {
        if (value) {
            const data = array.find((val) => val.key === value) ?? null;
            if (data) {
                input.value = data.value;
                setValue(name as Path<T>, data?.key as PathValue<T, Path<T>>);
            }
        }
    }, [array]);

    return {
        register,
        setValue,
        dropdown,
        err,
        input,
        isFocused,
        setIsFocused,
        valueArray,
    };
}
