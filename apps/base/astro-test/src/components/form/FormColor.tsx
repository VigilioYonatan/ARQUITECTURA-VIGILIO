import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { ChevronDownIconSolid, QuestionIconSolid } from "@vigilio/react-icons";
import type { JSX } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import type {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import Card from "../extras/card";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

export interface FormColorProps<T extends object> {
	title: string;
	name: Path<T>;
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
	presetColors?: string[];
	popupPosition?: "bottom" | "right";
	placeholder?: string;
	required?: boolean;
}

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

export default function FormColor<T extends object>({
	title,
	name,
	question,
	options = {},
	presetColors = DEFAULT_COLORS,
	popupPosition = "bottom",
	placeholder = "Elige un color",
	required = false,
}: FormColorProps<T>) {
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

	const currentValue = watch(name as unknown as Path<T>);

	useEffect(() => {
		if (currentValue) setCustomColor(currentValue);
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
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleColorChange = (color: string) => {
		setCustomColor(color);
		setValue(name as unknown as Path<T>, color as PathValue<T, Path<T>>, {
			shouldValidate: true,
		});
	};

	const getPopupPosition = () => {
		if (popupPosition === "right")
			return { left: "100%", top: 0, marginLeft: "8px" };
		return { top: "100%", left: 0, marginTop: "8px" };
	};
	const err = anidarPropiedades(errors, (name as unknown as string).split("."));
	const nameId = `${name}-${Math.random().toString()}`;

	return (
		<div className="relative inline-block w-full" ref={popupRef}>
			<div class="space-y-2 w-full">
				{title && (
					<label
						htmlFor={nameId as string}
						class="block text-sm font-semibold text-foreground"
					>
						{title}
						{required ? <span className="text-primary">*</span> : ""}
					</label>
				)}
				<div>
					{/* Botón principal */}
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 transition w-full"
					>
						<div className="flex items-center gap-2">
							<div
								className="w-6 h-6 rounded-lg"
								style={{ backgroundColor: customColor }}
							/>
							<span className="text-sm">
								{watch(name as unknown as Path<T>)
									? watch(name as unknown as Path<T>)
									: placeholder}
							</span>
						</div>
						<ChevronDownIconSolid
							className={`${isOpen ? "rotate-180" : ""} fill-foreground`}
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
												customColor === color ? "ring-2 ring-blue-500" : ""
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
											handleColorChange((e.target as HTMLInputElement).value)
										}
										className="w-20 h-20 cursor-pointer rounded-lg border border-gray-300"
										aria-label="Color picker"
									/>
								</div>
							)}

							{/* Input oculto para React Hook Form */}
							<input
								type="hidden"
								{...register(name as unknown as Path<T>, options)}
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
