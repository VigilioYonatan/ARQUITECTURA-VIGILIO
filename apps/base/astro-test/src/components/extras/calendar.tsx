import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { ArrowLeftIconSolid, ArrowRightIconSolid } from "@vigilio/react-icons";
import { useState } from "preact/hooks";
import { Fragment, type JSX } from "preact/jsx-runtime";
import Card from "./card";
import Loader from "./loader";

export interface Tooltip {
	color: string;
	result: {
		date: Date;
		tooltip: JSX.Element | JSX.Element[];
	}[];
}
export interface CalendarProps {
	changeMonth?: boolean;
	showTitle?: boolean;
	language?: "es" | "en";
	onPickDate?: (day: string | number, month: number, year: number) => void;
	initialDate?: Date;
	finalDate?: Date;
	custom?: (
		day: string | number,
		month: number,
		year: number,
	) => JSX.Element | JSX.Element[];
	onNextMonth?: (year: number, month: number) => void;
	onPreviousMonth?: (year: number, month: number) => void;
	image?: string;
	tooltip?: Tooltip[];
	isLoading?: boolean;
}

function Calendar({
	changeMonth = true,
	language = "es",
	onPickDate,
	initialDate = new Date(),
	finalDate,
	custom,
	onNextMonth,
	onPreviousMonth,
	image,
	tooltip = [],
	isLoading = false,
}: CalendarProps) {
	const [date, setDate] = useState<Date>(initialDate);

	const daysOfWeek: string[] =
		language === "es"
			? ["L", "M", "Mi", "J", "V", "S", "D"]
			: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const months: string[] =
		language === "es"
			? [
					"Enero",
					"Febrero",
					"Marzo",
					"Abril",
					"Mayo",
					"Junio",
					"Julio",
					"Agosto",
					"Septiembre",
					"Octubre",
					"Noviembre",
					"Diciembre",
				]
			: [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				];

	function previousMonth(): void {
		const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
		setDate(newDate);
		if (onPreviousMonth) {
			onPreviousMonth(date.getFullYear(), date.getMonth() - 1);
		}
	}

	function nextMonth(): void {
		const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		if (finalDate && newDate > finalDate) return;
		setDate(newDate);
		if (onNextMonth) {
			onNextMonth(date.getFullYear(), date.getMonth() + 1);
		}
	}

	function chooseDay(day: number) {
		const newDate = new Date(date.getFullYear(), date.getMonth(), day);
		if (finalDate && newDate > finalDate) return;
		setDate(newDate);
		if (onPickDate) {
			onPickDate(day, date.getMonth(), date.getFullYear());
		}
	}

	function renderDays(): (number | string)[] {
		const firstDayOfMonth: number = new Date(
			date.getFullYear(),
			date.getMonth(),
			1,
		).getDay();
		const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
		const daysInMonth: number = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			0,
		).getDate();
		const days: (number | string)[] = [];

		for (let i = 0; i < adjustedFirstDay; i++) {
			days.push("");
		}

		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		return days;
	}

	const isNextMonthDisabled = finalDate
		? new Date(date.getFullYear(), date.getMonth() + 1, 1) > finalDate
		: false;

	return (
		<Card className="!p-4 w-full max-w-md mx-auto">
			{image && (
				<img
					className="w-full h-[150px] object-cover rounded-t-lg mb-4"
					src={image}
					alt="Calendar header"
					loading="lazy"
				/>
			)}

			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold text-gray-800">
					{months[date.getMonth()]} {date.getFullYear()}
				</h2>
				<div className="flex items-center gap-2">
					{isLoading && <Loader size="sm" />}
					{changeMonth && (
						<div className="flex gap-2 fill-primary">
							<button
								type="button"
								onClick={previousMonth}
								disabled={isLoading}
								className="p-2 rounded-lg hover:bg-gray-100"
							>
								<ArrowLeftIconSolid {...sizeIcon.small} />
							</button>
							<button
								type="button"
								onClick={nextMonth}
								className={`p-2 rounded-lg hover:bg-gray-100 ${
									isNextMonthDisabled ? "opacity-50 cursor-not-allowed" : ""
								}`}
								disabled={isNextMonthDisabled || isLoading}
							>
								<ArrowRightIconSolid {...sizeIcon.small} />
							</button>
						</div>
					)}
				</div>
			</div>
			<div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ">
				<div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600  ">
					{daysOfWeek.map((day, index) => (
						<div
							key={day}
							className={`px-1 py-2 font-semibold ${
								index === 6 ? "text-red-500" : ""
							}`}
						>
							{day}
						</div>
					))}
				</div>
				{isLoading ? (
					<div className="grid grid-cols-7 gap-1 text-center text-sm">
						{renderDays().map((_, i) => (
							<div key={i} class="bg-gray-300 py-4 px-4 rounded-lg" />
						))}
					</div>
				) : (
					<div className="grid grid-cols-7 gap-1 text-center text-sm">
						{renderDays().map((day, index) => {
							if (day === "") {
								return <div key={`empty-${index}`} className="py-2 px-4" />;
							}

							const dayNumber = day as number;
							const currentDate = new Date(
								date.getFullYear(),
								date.getMonth(),
								dayNumber,
							);
							const isToday =
								dayNumber === new Date().getDate() &&
								date.getMonth() === new Date().getMonth() &&
								date.getFullYear() === new Date().getFullYear();
							const isSelected = dayNumber === date.getDate();
							const isSunday = index % 7 === 6;
							const isDayDisabled = finalDate ? currentDate > finalDate : false;

							return (
								// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
								<div
									key={dayNumber}
									className={`py-2 px-4 rounded-lg cursor-pointer flex justify-center items-center transition-colors ${
										isDayDisabled
											? "text-gray-400 cursor-not-allowed"
											: "hover:bg-blue-100"
									} ${
										isSelected && !isDayDisabled
											? "bg-primary text-white font-bold"
											: isToday && !isDayDisabled
												? "bg-blue-100 text-blue-800 font-medium"
												: isSunday && !isDayDisabled
													? "text-red-500 font-medium"
													: ""
									}
                                relative 
                                `}
									onClick={() => {
										if (!isDayDisabled) {
											chooseDay(dayNumber);
										}
									}}
								>
									{tooltip
										.filter((tool) =>
											tool.result.some(
												(result) =>
													new Date(result.date).toDateString() ===
													currentDate.toDateString(),
											),
										)
										.map((tool, indexTool) => {
											const matchingResults = tool.result.filter(
												(result) =>
													new Date(result.date).toDateString() ===
													currentDate.toDateString(),
											);

											return matchingResults.map((result, indexResult) => (
												<Fragment
													key={`${tool.color}-${result.date}-${indexResult}`}
												>
													<div
														style={{
															bottom: `${(indexTool + indexResult) * 4}px`,
															backgroundColor: tool.color,
														}}
														className="absolute left-0 w-full h-1.5 z-10 group"
													>
														{result.tooltip && (
															<div className="absolute left-0 z-20 hidden group-hover:block bg-black/80 px-2 w-[100px] py-1 text-white text-sm rounded">
																{result.tooltip}
															</div>
														)}
													</div>
												</Fragment>
											));
										})}

									{dayNumber.toString().padStart(2, "0")}
									{custom
										? custom(dayNumber, date.getMonth(), date.getFullYear())
										: null}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</Card>
	);
}

export default Calendar;
