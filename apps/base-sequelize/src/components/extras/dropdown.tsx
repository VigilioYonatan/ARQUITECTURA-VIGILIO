import useDropdown, { UseDropdown } from "@hooks/useDropdown";
import type { JSX } from "preact/jsx-runtime";

interface DropdownProps {
    children: JSX.Element | JSX.Element[];
    triggerChildren: (props: UseDropdown) => JSX.Element | JSX.Element[];
    className?: string;
    isHover?: boolean;
}
function Dropdown({
    triggerChildren,
    children,
    className = "bottom-[-30px]",
    isHover = false,
}: DropdownProps) {
    const dropdown = useDropdown(isHover);
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        <div
            class="relative "
            onMouseEnter={dropdown.onOpen}
            onMouseLeave={() => dropdown.onClose()}
        >
            <div>{triggerChildren(dropdown)}</div>
            <div
                class={` ${
                    dropdown.dropdownOpen ? "block" : "hidden "
                } absolute  bg-popover shadow-sm  z-999 border border-border  rounded-md right-0 min-w-[180px] ${className}`}
                ref={dropdown.dropdown}
            >
                {children}
            </div>
        </div>
    );
}

export default Dropdown;
