import { useSignal } from "@preact/signals";
import type { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";

export interface UseDropdown {
	dropdownOpen: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	trigger: Ref<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	dropdown: Ref<any>;
	onClose: (time?: number) => void;
	onOpen: () => void;
	onOpenClose: () => void;
}
// HOOK  usar dropdown
function useDropdown(isHover = false): UseDropdown {
	const dropdownOpen = useSignal<boolean>(false);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const trigger = useRef<any>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const dropdown = useRef<any>(null);

	function onClose(time = 0) {
		setTimeout(() => {
			dropdownOpen.value = false;
		}, time * 1000);
	}
	function onOpen() {
		dropdownOpen.value = true;
	}
	function onOpenClose() {
		dropdownOpen.value = !dropdownOpen.value;
	}
	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current?.contains(target)
			) {
				return;
			}

			dropdownOpen.value = false;
		};

		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	}, [dropdownOpen]);
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!dropdown.current) return;
			if (
				!dropdownOpen ||
				dropdown.current.contains(target) ||
				trigger.current?.contains(target)
			) {
				return;
			}

			dropdownOpen.value = false;
		};
		if (isHover) {
			document.addEventListener("mousemove", clickHandler);
			return () => document.removeEventListener("mousemove", clickHandler);
		}
	}, [dropdownOpen]);

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ key }: KeyboardEvent) => {
			if (!dropdownOpen || key !== "Escape") return;
			dropdownOpen.value = false;
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	}, []);
	return {
		dropdownOpen: dropdownOpen.value,
		trigger,
		dropdown,
		onClose,
		onOpen,
		onOpenClose,
	};
}

export default useDropdown;
