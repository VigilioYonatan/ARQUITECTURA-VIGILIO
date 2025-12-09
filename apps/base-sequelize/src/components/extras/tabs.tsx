import FormSelectNoForm from "@components/form/FormSelectNoForm";
import { cn } from "@infrastructure/libs/client/helpers";
import { useEffect, useRef } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

interface Tab {
    id: string;
    label: string | JSX.Element | JSX.Element[];
    content?: JSX.Element;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
    isCustomContent?: boolean;
}

export default function Tabs({
    tabs,
    activeTab,
    onTabChange,
    className,
    isCustomContent = false,
}: TabsProps) {
    const navRef = useRef<HTMLDivElement>(null);

    /* Línea animada (indicador) */
    useEffect(() => {
        if (!navRef.current) return;
        const active = navRef.current.querySelector<HTMLButtonElement>(
            '[data-state="active"]'
        );
        const indicator =
            navRef.current.querySelector<HTMLDivElement>("[data-indicator]");
        if (!active || !indicator) return;
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.left = `${active.offsetLeft}px`;
    }, [activeTab]);

    return (
        <div class={cn("w-full", className)}>
            {/* Headers */}
            <div
                ref={navRef}
                class="relative hidden md:flex items-center border-y border-border overflow-x-auto "
            >
                {tabs.map((tab) => (
                    <button
                        type="button"
                        key={tab.id}
                        onClick={() => !tab.disabled && onTabChange(tab.id)}
                        disabled={tab.disabled}
                        data-state={
                            activeTab === tab.id ? "active" : "inactive"
                        }
                        class={cn(
                            "p-5 text-sm font-semibold transition-colors",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "disabled:pointer-events-none disabled:opacity-50",
                            activeTab === tab.id
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}

                {/* Indicador animado */}
                <div
                    data-indicator
                    class="absolute bottom-[-1px] h-0.5 bg-primary transition-all duration-300"
                />
            </div>
            <FormSelectNoForm
                name="navType"
                title=""
                array={tabs.map((item) => ({
                    value: item.label,
                    key: item.id,
                }))}
                placeholder="Perfil"
                value={activeTab}
                className="w-full md:hidden"
                onChange={(value) => {
                    onTabChange(value as string);
                }}
            />
            {/* Content con fade-in */}
            {!isCustomContent ? (
                <div class="mt-4 min-h-[200px] animate-in fade-in-0 duration-300">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            class={cn(
                                activeTab === tab.id ? "block" : "hidden"
                            )}
                        >
                            {tab.content}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
