import { formatDateTz } from "@infrastructure/libs";
import {
	cn,
	type FilterResult,
	sizeIcon,
} from "@infrastructure/libs/client/helpers";
import { useComputed, useSignal } from "@preact/signals";
import { useDebounce } from "@vigilio/preact-paginator";
import {
	CalendarIconSolid,
	CalendarsIconSolid,
	CheckIconSolid,
	ChevronDownIconSolid,
	ClockIconSolid,
	FilterIconSolid,
	ListIconSolid,
	MagnifyingGlassIconSolid,
	RotateIconSolid,
	TableCellsIconSolid,
	XIconSolid,
} from "@vigilio/react-icons/fontawesome";
import dayjs from "dayjs";
import { createContext, h, type JSX } from "preact";
import { useContext } from "preact/hooks";
import Button from "./button";
import Card from "./card";
import Modal from "./modal";

// Hook para el sistema de filtros
export function useFilterSystem<T extends object>(
	filterGroups: FilterGroup<T>[],
) {
	const isFilterOpen = useSignal(false);
	const activeFilters = useSignal<Record<keyof T, unknown>>(
		{} as Record<keyof T, unknown>,
	);
	const typeView = useSignal<"table" | "list">("list");
	const query = useSignal<string>("");
	const debounce = useDebounce(query.value);

	function openFilters() {
		isFilterOpen.value = true;
	}

	function closeFilters() {
		isFilterOpen.value = false;
	}

	function applyFilters(filters: Record<keyof T, unknown>) {
		activeFilters.value = filters;
	}

	function clearFilters() {
		activeFilters.value = {} as Record<keyof T, unknown>;
	}

	function toggleTypeView(value: "table" | "list") {
		typeView.value = value;
	}

	const activeFiltersCount = useComputed(() => {
		return Object.values(activeFilters.value).filter((value) => {
			if (Array.isArray(value)) return value.length > 0;
			if (typeof value === "string") return value.trim() !== "";
			if (typeof value === "object" && value !== null) {
				return Object.values(value).some(
					(v) => v !== null && v !== undefined && v !== "",
				);
			}
			return value !== null && value !== undefined;
		}).length;
	});

	function handleInputChange(value: string) {
		query.value = value;
	}

	function clearSearch() {
		query.value = "";
	}

	return {
		filters: {
			isFilterOpen: isFilterOpen.value,
			value: activeFilters.value,
			activeFiltersCount: activeFiltersCount.value,
			filterGroups,
			methods: {
				openFilters,
				applyFilters,
				closeFilters,
				clearFilters,
			},
		},
		typeView: {
			value: typeView.value,
			methods: {
				toggleTypeView,
			},
		},
		search: {
			value: query.value,
			debounce,
			methods: {
				handleInputChange,
				clearSearch,
			},
		},
	};
}

// Context
const filterContext = createContext<ReturnType<typeof useFilterSystem>>({
	filters: {
		isFilterOpen: false,
		value: {},
		activeFiltersCount: 0,
		filterGroups: [],
		methods: {
			openFilters: () => {},
			applyFilters: () => {},
			closeFilters: () => {},
			clearFilters: () => {},
		},
	},
	typeView: {
		value: "table",
		methods: {
			toggleTypeView: () => {},
		},
	},
	search: {
		value: "",
		debounce: "",
		methods: {
			handleInputChange: () => {},
			clearSearch: () => {},
		},
	},
});

// Interfaces
interface FilterOption {
	label: string;
	value: unknown;
	count?: number;
}

interface DatePreset {
	id: string;
	label: string;
	value: {
		from: Date;
		to: Date;
	};
	icon?: h.JSX.Element;
}

interface FilterGroup<T> {
	key: keyof T;
	label: string;
	type: "select" | "multiselect" | "range" | "date" | "search" | "date-preset";
	options?: FilterOption[];
	datePresets?: DatePreset[];
	placeholder?: string;
	min?: number;
	max?: number;
	show?: boolean;
}

// Función para generar presets de fechas
const generateDatePresets = (): DatePreset[] => {
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

// Provider Component
interface FilterProviderProps<T extends object> {
	children: (filterSystem: FilterResult<T>) => JSX.Element | JSX.Element[];
	filterGroups: FilterGroup<T>[];
}

function FilterProvider<T extends object>({
	children,
	filterGroups,
}: FilterProviderProps<T>) {
	const filterSystem = useFilterSystem(
		filterGroups.filter(
			(group) => typeof group.show === "undefined" || group.show,
		),
	);
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		<filterContext.Provider value={filterSystem as any}>
			{children({
				search: {
					value: filterSystem.search.value,
					debounce: filterSystem.search.debounce,
				},
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				filters: filterSystem.filters.value as any,
				typeView: filterSystem.typeView.value,
			})}
		</filterContext.Provider>
	);
}

// Advanced Filter System Component
interface FilterProps<T extends object> {
	className?: string;
	// onClose: () => void;
	// onApplyFilters: (filters: Record<string, unknown>) => void;
	// defaultFilters?: Record<string, unknown>;
}

function Filter<T extends object>({ className }: FilterProps<T>) {
	const context = useContext(filterContext);
	const filters = useSignal<Record<string, unknown>>(context.filters.value);
	const expandedGroups = useSignal<Set<string>>(new Set());

	const handleFilterChange = (groupId: string, value: unknown) => {
		const isNumber =
			!Number.isNaN(Number(value)) || value === "true" || value === "false";
		filters.value = {
			...filters.value,
			[groupId]: isNumber ? JSON.parse(value as string) : value,
		};
	};

	const handleMultiSelectChange = (
		groupId: string,
		optionId: string,
		checked: boolean,
	) => {
		filters.value = {
			...filters.value,
			[groupId]: (() => {
				const currentValues = (filters.value[groupId] as string[]) || [];
				if (checked) {
					return [...currentValues, optionId];
				}
				return currentValues.filter((id: string) => id !== optionId);
			})(),
		};
	};

	const handleDatePresetSelect = (groupId: string, preset: DatePreset) => {
		filters.value = {
			...filters.value,
			[groupId]: {
				preset: preset.id,
				from: preset.value.from.toISOString().split("T")[0],
				to: preset.value.to.toISOString().split("T")[0],
				label: preset.label,
			},
		};
	};

	const toggleGroup = (groupId: string) => {
		const newSet = new Set(expandedGroups.value);
		if (newSet.has(groupId)) {
			newSet.delete(groupId);
		} else {
			newSet.add(groupId);
		}
		expandedGroups.value = newSet;
	};

	const clearAllFilters = () => {
		filters.value = {};
	};

	const applyFilters = () => {
		context.filters.methods.applyFilters(filters.value);
		context.filters.methods.closeFilters();
	};

	const activeFiltersCount = useComputed(() => {
		return Object.values(filters.value).filter((value) => {
			if (Array.isArray(value)) return value.length > 0;
			if (typeof value === "string") return value.trim() !== "";
			if (typeof value === "object" && value !== null) {
				return Object.values(value).some(
					(v) => v !== null && v !== undefined && v !== "",
				);
			}
			return value !== null && value !== undefined;
		}).length;
	});

	const renderFilterGroup = (group: FilterGroup<T>) => {
		const isExpanded = expandedGroups.value.has(group.key as string);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const currentValue = filters.value[group.key as string] as any;

		return (
			<div
				key={group.key}
				className="border border-gray-200 rounded-lg bg-white"
			>
				<button
					type="button"
					onClick={() => toggleGroup(group.key as string)}
					className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
				>
					<span className="font-medium text-gray-900">{group.label}</span>
					<div className="flex items-center gap-2">
						{currentValue && (
							<span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
								{Array.isArray(currentValue)
									? currentValue.length
									: currentValue.preset
										? currentValue.label
										: "1"}
							</span>
						)}
						<ChevronDownIconSolid
							className={cn(
								"w-4 h-4 text-gray-500 transition-transform",
								isExpanded && "rotate-180",
							)}
						/>
					</div>
				</button>

				{isExpanded && (
					<div className="border-t border-gray-200 p-4 bg-gray-50">
						{group.type === "search" && (
							<FilterSearch
								group={group}
								currentValue={currentValue}
								handleFilterChange={handleFilterChange}
							/>
						)}

						{group.type === "select" && group.options && (
							<FilterSelect
								group={group}
								currentValue={currentValue}
								handleFilterChange={handleFilterChange}
							/>
						)}

						{group.type === "multiselect" && group.options && (
							<FilterMultiselect
								group={group}
								currentValue={currentValue}
								handleMultiSelectChange={handleMultiSelectChange}
							/>
						)}

						{group.type === "range" && (
							<FilterRange
								group={group}
								currentValue={currentValue}
								handleFilterChange={handleFilterChange}
							/>
						)}

						{group.type === "date-preset" && (
							<FilterDatePreset
								group={group}
								currentValue={currentValue}
								handleDatePresetSelect={handleDatePresetSelect}
								handleFilterChange={handleFilterChange}
							/>
						)}

						{group.type === "date" && (
							<FilterDate
								group={group}
								currentValue={currentValue}
								handleFilterChange={handleFilterChange}
							/>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className={cn("w-full max-w-3xl max-h-[90vh] overflow-hidden", className)}
		>
			<Card.content className="space-y-4 max-h-[55vh] overflow-y-auto !p-0 my-2">
				{context.filters.filterGroups.map(renderFilterGroup)}
			</Card.content>

			<Card className=" p-4 flex items-center justify-between gap-2">
				<Button
					variant="outline"
					onClick={clearAllFilters}
					className="flex items-center gap-2 bg-transparent"
					type="button"
				>
					<RotateIconSolid className="w-4 h-4" />
					Limpiar todo
				</Button>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={context.filters.methods.closeFilters}
						type="button"
					>
						Cancelar
					</Button>
					<Button
						onClick={applyFilters}
						className="bg-primary hover:bg-primary"
						type="button"
					>
						Aplicar filtros ({activeFiltersCount.value})
					</Button>
				</div>
			</Card>
		</div>
	);
}

interface FilterSearchProps<T extends object> {
	group: FilterGroup<T>;
	currentValue: unknown;
	handleFilterChange: (groupId: string, value: unknown) => void;
}

function FilterSearch<T extends object>({
	group,
	currentValue,
	handleFilterChange,
}: FilterSearchProps<T>) {
	return (
		<div className="relative">
			<MagnifyingGlassIconSolid className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-gray-400 w-4 h-4" />
			<input
				type="text"
				placeholder={group.placeholder || "Buscar..."}
				value={(currentValue as unknown as string) || ""}
				onInput={(e) =>
					handleFilterChange(group.key as string, e.currentTarget.value)
				}
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
			/>
		</div>
	);
}

interface FilterSelectProps<T extends object> {
	group: FilterGroup<T>;
	currentValue: unknown;
	handleFilterChange: (groupId: string, value: unknown) => void;
}

function FilterSelect<T extends object>({
	group,
	currentValue,
	handleFilterChange,
}: FilterSelectProps<T>) {
	return (
		<select
			value={(currentValue as unknown as string) || ""}
			onChange={(e) =>
				handleFilterChange(group.key as string, e.currentTarget.value)
			}
			className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
		>
			<option value="">Seleccionar...</option>
			{group.options?.map((option) => (
				<option key={option.label} value={option.value as string}>
					{option.label} {option.count && `(${option.count})`}
				</option>
			))}
		</select>
	);
}

interface FilterRangeProps<T extends object> {
	group: FilterGroup<T>;
	currentValue: unknown;
	handleFilterChange: (groupId: string, value: unknown) => void;
}

function FilterRange<T extends object>({
	group,
	currentValue,
	handleFilterChange,
}: FilterRangeProps<T>) {
	return (
		<div className="space-y-3">
			<div className="flex gap-3">
				<div className="flex-1">
					<label
						htmlFor={group.key as string}
						className="block text-xs text-gray-600 mb-1"
					>
						Mínimo
					</label>
					<input
						type="number"
						min={group.min}
						max={group.max}
						value={
							(
								currentValue as unknown as {
									min: number;
								}
							)?.min || ""
						}
						onInput={(e) =>
							handleFilterChange(group.key as string, {
								...(currentValue as unknown as {
									min: number;
								}),
								min: e.currentTarget.value
									? Number(e.currentTarget.value)
									: undefined,
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
					/>
				</div>
				<div className="flex-1">
					<label
						htmlFor={group.key as string}
						className="block text-xs text-gray-600 mb-1"
					>
						Máximo
					</label>
					<input
						type="number"
						min={group.min}
						max={group.max}
						value={
							(
								currentValue as unknown as {
									max: number;
								}
							)?.max || ""
						}
						id={group.key as string}
						onInput={(e) =>
							handleFilterChange(group.key as string, {
								...(currentValue as unknown as {
									max: number;
								}),
								max: e.currentTarget.value
									? Number(e.currentTarget.value)
									: undefined,
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
					/>
				</div>
			</div>
		</div>
	);
}

interface FilterMultiselectProps<T extends object> {
	group: FilterGroup<T>;
	currentValue: unknown;
	handleMultiSelectChange: (
		groupId: string,
		optionId: string,
		checked: boolean,
	) => void;
}

function FilterMultiselect<T extends object>({
	group,
	currentValue,
	handleMultiSelectChange,
}: FilterMultiselectProps<T>) {
	return (
		<div className="space-y-2 max-h-48 overflow-y-auto">
			{group.options?.map((option) => {
				const isChecked = (
					(currentValue as unknown as string[]) || []
				).includes(option.value as string);
				return (
					<label
						key={option.label}
						className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded"
					>
						<div className="relative">
							<input
								type="checkbox"
								checked={isChecked}
								onChange={(e) =>
									handleMultiSelectChange(
										group.key as string,
										option.value as string,
										e.currentTarget.checked,
									)
								}
								className="sr-only"
							/>
							<div
								className={cn(
									"w-4 h-4 border-2 rounded flex items-center justify-center transition-colors",
									isChecked
										? "bg-primary border-primary"
										: "border-gray-300 hover:border-gray-400",
								)}
							>
								{isChecked && <CheckIconSolid className="w-3 h-3 fill-white" />}
							</div>
						</div>
						<span className="text-sm text-gray-700 flex-1">{option.label}</span>
						{option.count && (
							<span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
								{option.count}
							</span>
						)}
					</label>
				);
			})}
		</div>
	);
}
interface FilterDatePresetProps<T extends object> {
	group: FilterGroup<T>;
	currentValue: unknown;
	handleFilterChange: (groupId: string, value: unknown) => void;
	handleDatePresetSelect: (groupId: string, preset: DatePreset) => void;
}

function FilterDatePreset<T extends object>({
	group,
	currentValue,
	handleFilterChange,
	handleDatePresetSelect,
}: FilterDatePresetProps<T>) {
	return (
		<div className="space-y-4">
			{/* Filtros rápidos de fecha */}
			<div>
				<label
					htmlFor={group.key as string}
					className="block text-sm font-medium text-gray-700 mb-3"
				>
					Filtros rápidos
				</label>
				<div className="grid grid-cols-2 gap-2">
					{generateDatePresets().map((preset) => {
						const isSelected =
							(
								currentValue as unknown as {
									preset: string;
								}
							)?.preset === preset.id;
						return (
							<Button
								key={preset.id}
								type="button"
								onClick={() =>
									handleDatePresetSelect(group.key as string, preset)
								}
								id={group.key as string}
								className={cn(
									"flex gap-2",
									isSelected
										? "bg-primary/20 border-primary/20 text-primary fill-primary"
										: "",
								)}
								variant="outline"
							>
								{preset.icon}
								{preset.label}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Separador */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-gray-50 text-gray-500">
						o selecciona fechas personalizadas
					</span>
				</div>
			</div>

			{/* Selector de fechas personalizado */}
			<div className="space-y-3">
				<div className="flex gap-3">
					<div className="flex-1">
						<label
							htmlFor={group.key as string}
							className="block text-xs text-gray-600 mb-1"
						>
							Desde
						</label>
						<input
							type="date"
							value={
								(
									currentValue as unknown as {
										from: string;
									}
								)?.from || ""
							}
							id={group.key as string}
							onInput={(e) =>
								handleFilterChange(group.key as string, {
									...(currentValue as unknown as {
										from: string;
									}),
									from: e.currentTarget.value,
									preset: null, // Limpiar preset al usar fechas personalizadas
									label: null,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
						/>
					</div>
					<div className="flex-1">
						<label
							htmlFor={group.key as string}
							className="block text-xs text-gray-600 mb-1"
						>
							Hasta
						</label>
						<input
							type="date"
							value={
								(
									currentValue as unknown as {
										to: string;
									}
								)?.to || ""
							}
							id={group.key as string}
							onInput={(e) =>
								handleFilterChange(group.key as string, {
									...(currentValue as unknown as {
										to: string;
									}),
									to: e.currentTarget.value,
									preset: null, // Limpiar preset al usar fechas personalizadas
									label: null,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
							min={
								(
									currentValue as unknown as {
										to: string;
									}
								)?.to || ""
							}
						/>
					</div>
				</div>

				{/* Mostrar rango seleccionado */}
				{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
				{((currentValue as any)?.from || (currentValue as any)?.to) && (
					<div className="bg-primary/10 border border-primary/20 rounded-md p-3">
						<div className="flex items-center gap-2 text-sm text-primary">
							<CalendarIconSolid className="w-4 h-4 fill-primary" />
							<span>
								{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
								{(currentValue as any).preset
									? `${
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											(currentValue as any).label
										}`
									: `${
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											(currentValue as any).from
												? formatDateTz(
														// biome-ignore lint/suspicious/noExplicitAny: <explanation>
														(currentValue as any).from,
														"DD/MM/YYYY",
													)
												: "..."
										} - ${
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											(currentValue as any).to
												? formatDateTz(
														// biome-ignore lint/suspicious/noExplicitAny: <explanation>
														(currentValue as any).to,
														"DD/MM/YYYY",
													)
												: "..."
										}`}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
interface FilterDateProps<T extends object> {
	group: FilterGroup<T>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	currentValue: any;
	handleFilterChange: (groupId: string, preset: DatePreset) => void;
}

function FilterDate<T extends object>({
	group,
	currentValue,
	handleFilterChange,
}: FilterDateProps<T>) {
	return (
		<div className="space-y-3">
			<div className="flex gap-3">
				<div className="flex-1">
					<label
						htmlFor={group.key as string}
						className="block text-xs text-gray-600 mb-1"
					>
						Desde
					</label>
					<input
						type="date"
						id={group.key as string}
						value={currentValue?.from || ""}
						onInput={(e) =>
							handleFilterChange(group.key as string, {
								...currentValue,
								from: e.currentTarget.value,
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
					/>
				</div>
				<div className="flex-1">
					<label
						htmlFor={group.key as string}
						className="block text-xs text-gray-600 mb-1"
					>
						Hasta
					</label>
					<input
						type="date"
						id={group.key as string}
						value={currentValue?.to || ""}
						onInput={(e) =>
							handleFilterChange(group.key as string, {
								...currentValue,
								to: e.currentTarget.value,
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
					/>
				</div>
			</div>
		</div>
	);
}

// View Toggle Component
interface ViewToggleProps {
	className?: string;
}

function ViewToggle({ className }: ViewToggleProps) {
	const context = useContext(filterContext);
	const { typeView } = context;

	return (
		<div className={cn("flex", className)}>
			<Button
				type="button"
				variant={typeView.value === "table" ? "primary" : "outline"}
				className={cn(
					"p-2 rounded-l-lg border rounded-r-none border-gray-300 transition-colors",
				)}
				onClick={() => typeView.methods.toggleTypeView("table")}
			>
				<TableCellsIconSolid
					className={cn(
						"w-5 h-5",
						typeView.value === "table" ? "fill-white" : "fill-gray-600",
					)}
				/>
			</Button>
			<Button
				type="button"
				variant={typeView.value === "list" ? "primary" : "outline"}
				className={cn(
					"p-2 rounded-r-lg border rounded-l-none border-gray-300 transition-colors",
				)}
				onClick={() => typeView.methods.toggleTypeView("list")}
			>
				<ListIconSolid className={cn("w-5 h-5")} />
			</Button>
		</div>
	);
}

// Search Component
interface SearchProps {
	placeholder?: string;
	className?: string;
}

function Search({ placeholder = "Buscar...", className }: SearchProps) {
	const context = useContext(filterContext);
	const { search } = context;
	const isFocused = useSignal(false);

	return (
		<div className={cn("relative w-full ", className)}>
			<div className="relative">
				<MagnifyingGlassIconSolid
					className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-300"
					{...sizeIcon.small}
				/>
				<input
					type="text"
					value={search.value}
					onInput={(e) => {
						if (e.target instanceof HTMLInputElement) {
							search.methods.handleInputChange(e.target.value);
						}
					}}
					onFocus={() => {
						isFocused.value = true;
					}}
					onBlur={() => {
						isFocused.value = false;
					}}
					placeholder={placeholder}
					className={cn(
						"w-full pl-10 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
						"transition-all duration-200",
						"placeholder-gray-500 text-gray-900",
						isFocused.value && "ring-2 ring-primary border-primary",
					)}
				/>
				{search.value && (
					<button
						type="button"
						onClick={search.methods.clearSearch}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
					>
						<XIconSolid className="w-4 h-4 text-gray-400" />
					</button>
				)}
			</div>
		</div>
	);
}

// Advanced Filter Button Component
interface AdvancedButtonProps {
	className?: string;
}

function AdvancedButton({ className }: AdvancedButtonProps) {
	const context = useContext(filterContext);
	const { filters } = context;

	return (
		<>
			<Button
				type="button"
				variant="primary"
				onClick={filters.methods.openFilters}
				className={cn(
					"flex items-center gap-2 w-full sm:!w-[160px]",
					className,
				)}
			>
				<FilterIconSolid {...sizeIcon.medium} />
				Filtros
				{filters.activeFiltersCount > 0 && (
					<span className="bg-white text-primary text-xs px-2 py-1 rounded-full">
						{filters.activeFiltersCount}
					</span>
				)}
			</Button>
			<Modal
				isOpen={filters.isFilterOpen}
				onClose={filters.methods.closeFilters}
				content={
					<div className="flex flex-col gap-4 font-bold text-2xl">
						<span className="flex items-center gap-2">
							<FilterIconSolid className="fill-white" {...sizeIcon.medium} />
							Filtros ({filters.activeFiltersCount})
						</span>
					</div>
				}
				contentClassName="min-h-[auto] max-w-[500px] w-full"
			>
				<Filter />
			</Modal>
		</>
	);
}

// Main Filter Component with Composition Pattern
const FilterSystem = Object.assign(FilterProvider, {
	search: Search,
	view: ViewToggle,
	filters: AdvancedButton,
	filters_custom: {
		select: FilterSelect,
		multiselect: FilterMultiselect,
		range: FilterRange,
		date_preset: FilterDatePreset,
		date: FilterDate,
		search: FilterSearch,
	},
});

export default FilterSystem;
export type { FilterGroup, FilterOption, DatePreset };
