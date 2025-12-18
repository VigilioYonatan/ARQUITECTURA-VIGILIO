import type { h } from "preact";

export interface FilterOption {
    label: string;
    value: unknown;
    count?: number;
}

export interface DatePreset {
    id: string;
    label: string;
    value: {
        from: Date;
        to: Date;
    };
    icon?: h.JSX.Element;
}

export interface FilterGroup<T> {
    key: keyof T;
    label: string;
    type:
        | "select"
        | "multiselect"
        | "range"
        | "date"
        | "search"
        | "date-preset";
    options?: FilterOption[];
    datePresets?: DatePreset[];
    placeholder?: string;
    min?: number;
    max?: number;
    show?: boolean;
}
