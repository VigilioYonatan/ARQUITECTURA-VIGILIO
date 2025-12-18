import {
    CalendarIconSolid,
    CalendarsIconSolid,
    ClockIconSolid,
} from "@vigilio/react-icons/fontawesome";
import dayjs from "dayjs";
import type { DatePreset } from "../types";

export const generateDatePresets = (): DatePreset[] => {
    const now = dayjs();
    const today = dayjs(now.toDate());

    return [
        {
            id: "today",
            label: "Hoy",
            value: {
                from: today.toDate(),
                to: today.add(1, "day").toDate(),
            },
            icon: <ClockIconSolid className="w-3 h-3" />,
        },
        {
            id: "yesterday",
            label: "Ayer",
            value: {
                from: today.subtract(1, "day").toDate(),
                to: today.add(1, "day").toDate(),
            },
            icon: <ClockIconSolid className="w-3 h-3" />,
        },
        {
            id: "last-7-days",
            label: "Últimos 7 días",
            value: {
                from: today.subtract(7, "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarsIconSolid className="w-3 h-3" />,
        },
        {
            id: "last-30-days",
            label: "Último mes",
            value: {
                from: today.subtract(30, "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "last-3-months",
            label: "Últimos 3 meses",
            value: {
                from: today.subtract(90, "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "last-6-months",
            label: "Últimos 6 meses",
            value: {
                from: today.subtract(180, "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "last-year",
            label: "Último año",
            value: {
                from: today.subtract(365, "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "this-week",
            label: "Esta semana",
            value: {
                from: today.subtract(today.day(), "day").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "this-month",
            label: "Este mes",
            value: {
                from: today.startOf("month").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
        {
            id: "this-year",
            label: "Este año",
            value: {
                from: today.startOf("year").toDate(),
                to: now.toDate(),
            },
            icon: <CalendarIconSolid className="w-3 h-3" />,
        },
    ];
};
