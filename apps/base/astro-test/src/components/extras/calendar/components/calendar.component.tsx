import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { ArrowLeftIconSolid, ArrowRightIconSolid } from "@vigilio/react-icons";
import { Fragment } from "preact/jsx-runtime";
import Card from "../../card";
import Loader from "../../loader";
import { type CalendarProps, useCalendar } from "../hooks/use-calendar.hook";

function Calendar(props: CalendarProps) {
    const {
        changeMonth = true,
        image,
        tooltip = [],
        isLoading = false,
        custom,
        finalDate,
    } = props;

    const {
        date,
        daysOfWeek,
        months,
        previousMonth,
        nextMonth,
        chooseDay,
        renderDays,
        isNextMonthDisabled,
    } = useCalendar(props);

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
                                    isNextMonthDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
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
                            <div
                                key={i}
                                class="bg-gray-300 py-4 px-4 rounded-lg"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {renderDays().map((day, index) => {
                            if (day === "") {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="py-2 px-4"
                                    />
                                );
                            }

                            const dayNumber = day as number;
                            const currentDate = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                dayNumber
                            );
                            const isToday =
                                dayNumber === new Date().getDate() &&
                                date.getMonth() === new Date().getMonth() &&
                                date.getFullYear() === new Date().getFullYear();
                            const isSelected = dayNumber === date.getDate();
                            const isSunday = index % 7 === 6;
                            const isDayDisabled = finalDate
                                ? currentDate > finalDate
                                : false;

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
                                                    new Date(
                                                        result.date
                                                    ).toDateString() ===
                                                    currentDate.toDateString()
                                            )
                                        )
                                        .map((tool) => {
                                            const matchingResults =
                                                tool.result.filter(
                                                    (result) =>
                                                        new Date(
                                                            result.date
                                                        ).toDateString() ===
                                                        currentDate.toDateString()
                                                );

                                            return matchingResults.map(
                                                (result, indexResult) => (
                                                    <Fragment
                                                        key={`${tool.color}-${result.date}-${indexResult}`}
                                                    >
                                                        <div
                                                            style={{
                                                                bottom: `${
                                                                    (index +
                                                                        indexResult) *
                                                                    4
                                                                }px`,
                                                                backgroundColor:
                                                                    tool.color,
                                                            }}
                                                            className="absolute left-0 w-full h-1.5 z-10 group"
                                                        >
                                                            {result.tooltip && (
                                                                <div className="absolute left-0 z-20 hidden group-hover:block bg-black/80 px-2 w-[100px] py-1 text-white text-sm rounded">
                                                                    {
                                                                        result.tooltip
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Fragment>
                                                )
                                            );
                                        })}

                                    {dayNumber.toString().padStart(2, "0")}
                                    {custom
                                        ? custom(
                                              dayNumber,
                                              date.getMonth(),
                                              date.getFullYear()
                                          )
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
