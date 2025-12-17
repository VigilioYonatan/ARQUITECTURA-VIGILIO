import type { JSX } from "preact";
import type { SVGProps } from "preact/compat";

export type TypeComponent = "success" | "error" | "warning" | "info";

export type IconType = (
	props: SVGProps<SVGSVGElement> & { title?: string | undefined },
) => JSX.Element;
