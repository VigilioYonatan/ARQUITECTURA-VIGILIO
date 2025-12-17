import { useStore } from "@nanostores/preact";
import { atom } from "nanostores";

export type ThemeMode = "light" | "dark" | "default";
export const $theme = atom<ThemeMode>("default");

export function useThemeStore() {
	function changeThemeMode(value: ThemeMode) {
		if (value === $theme.get()) return;
		$theme.set(value);
	}
	function updateDOM(theme: ThemeMode) {
		const isDark =
			theme === "dark" ||
			(theme === "default" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);

		if (isDark) {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
		}
	}
	if (typeof window !== "undefined") {
		const savedTheme = localStorage.getItem("theme") as ThemeMode;
		if (savedTheme) {
			$theme.set(savedTheme);
		}

		$theme.subscribe((value) => {
			if (value === "default") {
				localStorage.removeItem("theme");
			} else {
				localStorage.setItem("theme", value);
			}

			// Actualizar DOM
			updateDOM(value);
		});

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				if ($theme.get() === "default") {
					updateDOM("default");
				}
			});
	}

	return {
		value: useStore($theme),
		changeThemeMode,
		updateDOM,
	};
}
