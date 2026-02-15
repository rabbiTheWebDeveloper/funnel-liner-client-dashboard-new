import * as React from "react";
import { cls } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select/select";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from "../ui/date-range-picker/date-range-picker";
import globalStyles from "../../global.module.css";
import { Button } from "../ui/button/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export const DateSelector = ({
  children,
  defaultValue,
  placeholder,
  showCalender = false,
  calenderTrigger = "custom",
  value: externalValue,
  onValueChange,
  ...props
}) => {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [triggerText, setTriggerText] = React.useState("Select dates");
  const calendarButtonRef = React.useRef(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  // 🟢 When "custom" is selected → open calendar automatically
  React.useEffect(() => {
    if (value === calenderTrigger && calendarButtonRef.current) {
      calendarButtonRef.current.click();
    }
  }, [value, calenderTrigger]);

  // 🟢 Dropdown value change (for today, yesterday, etc.)
  const handleValueChange = (newValue) => {
    setInternalValue(newValue);
    onValueChange?.(newValue, startDate, endDate);

    // Reset previous custom dates if not in custom mode
    if (newValue !== calenderTrigger) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // 🟢 Handle when end date is selected (both start & end picked)
  const handleEndDateChange = (date) => {
    setEndDate(date);

    // only proceed when both dates are selected
    if (date && startDate) {
      // call parent with full range
      onValueChange?.(calenderTrigger, startDate, date);

      // update trigger text
      setTriggerText(`${format(startDate, "MMM d")} - ${format(date, "MMM d")}`);

      // ✅ close calendar after short delay
      setTimeout(() => {
        calendarButtonRef.current?.blur();
      }, 200);
    }
  };

  // 🟢 Update trigger text dynamically when dates change
  React.useEffect(() => {
    if (value === calenderTrigger && startDate && endDate) {
      setTriggerText(`${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`);
    }
  }, [value, startDate, endDate]);

  return (
    <div className={cls(globalStyles["flex-center"])}>
      {/* Dropdown Selector */}
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      >
        <SelectTrigger aria-label="Select a value">
          {value === calenderTrigger ? (
            <SelectValue placeholder={triggerText}>
              {triggerText.trim() === "" ? "Select dates" : triggerText}
            </SelectValue>
          ) : (
            <SelectValue placeholder={placeholder || "Today"} />
          )}
        </SelectTrigger>

        <SelectContent>{children}</SelectContent>
      </Select>

      {/* Calendar */}
      {showCalender && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        >
          <DateRangePickerTrigger asChild>
            <Button
              ref={calendarButtonRef}
              variant="outline"
              size="icon"
              className={cls(
                globalStyles.small_button,
                globalStyles.calendar_button,
                value === calenderTrigger ? globalStyles.ring : "box-shadow-none"
              )}
            >
              <Calendar />
            </Button>
          </DateRangePickerTrigger>
          <DateRangePickerContent />
        </DateRangePicker>
      )}
    </div>
  );
};
