import React from "react";
import styles from "./sales-target-form.module.css";
import { Button } from "../ui/button/button";
import { Calendar } from "lucide-react";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from "../ui/date-range-picker/date-range-picker";
import { format } from "date-fns";

export function CustomDateRangePicker({ 
  value, 
  onChange, 
  placeholder,
  type // 'from' or 'to'
}) {
  const getTriggerText = () => {
    if (value.startDate && value.endDate) {
      return `${format(value.startDate, "MMM d")} - ${format(value.endDate, "MMM d")}`;
    }
    return placeholder || "Select date range";
  };

  const handleStartDateChange = (newDate) => {
    onChange?.({ ...value, startDate: newDate });
  };

  const handleEndDateChange = (newDate) => {
    onChange?.({ ...value, endDate: newDate });
  };

  return (
    <div className={styles.datePickerContainer}>
      <DateRangePicker
        startDate={value.startDate}
        endDate={value.endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      >
        <DateRangePickerTrigger asChild>
          <Button variant="outline" className={styles.datePickerTrigger}>
            <Calendar className={styles.calendarIcon} />
            <span>{getTriggerText()}</span>
          </Button>
        </DateRangePickerTrigger>
        <DateRangePickerContent />
      </DateRangePicker>
    </div>
  );
} 