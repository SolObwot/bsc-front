import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./Button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}) {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = React.useMemo(() => {
    return getDaysInMonth(year, month).map(date => ({
      date,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selected?.toDateString() === date.toDateString()
    }));
  }, [year, month, selected]);

  const handleMonthChange = (increment) => {
    setMonth(prev => {
      const newMonth = prev + increment;
      if (newMonth > 11) {
        setYear(y => y + 1);
        return 0;
      }
      if (newMonth < 0) {
        setYear(y => y - 1);
        return 11;
      }
      return newMonth;
    });
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className={cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            buttonVariants.outline
          )}
          onClick={(e) => {
            e.preventDefault();
            handleMonthChange(-1);
          }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {new Date(year, month).toLocaleString("default", { month: "long" })}{" "}
          {year}
        </span>
        <button
          type="button"
          className={cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            buttonVariants.outline
          )}
          onClick={(e) => {
            e.preventDefault();
            handleMonthChange(1);
          }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            type="button"
            key={index}
            className={cn(
              "h-9 w-9 text-center text-sm cursor-pointer hover:bg-teal-50 rounded-full flex items-center justify-center",
              day.isToday && "bg-teal-100 text-teal-600",
              day.isSelected && "bg-teal-600 text-white hover:bg-teal-700"
            )}
            onClick={(e) => {
              e.preventDefault();
              onSelect?.(day.date);
            }}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };