import React, { useState, useCallback } from "react";
import { Button } from "@mui/material";
import { DateRangePicker } from "react-nice-dates";
import { enGB } from "date-fns/locale";

const DateWiseFilter = ({ setDateWiseFilterOption, dateWiseFilterOption, setFilterEndDate, filterEndDate, setFilterStartDate, filterStartDate }) => {
  const [valueStartDate, setValueStartDate] = useState();
  const [valueEndDate, setValueEndDate] = useState();

  const formatDate = date => {
    if (!date) return "";
    return date.toLocaleDateString();
  };
  
  const getFormattedDateRange = useCallback(() => {
    const dateValue =
    filterStartDate && filterEndDate
      ? `${formatDate(filterStartDate)} - ${formatDate(filterEndDate)}`
      : "";
    return dateValue;
  }, [filterStartDate, filterEndDate])

  return (
    <React.Fragment>
      <Button
        className={dateWiseFilterOption === "today" && "active"}
        onClick={() => setDateWiseFilterOption("today")}
      >
        Today
      </Button>
      <Button
        className={dateWiseFilterOption === "yesterday" && "active"}
        onClick={() => setDateWiseFilterOption("yesterday")}
      >
        Yesterday
      </Button>
      <Button
        className={dateWiseFilterOption === "weekly" && "active"}
        onClick={() => setDateWiseFilterOption("weekly")}
      >
        This Week
      </Button>
      <Button
        className={dateWiseFilterOption === "monthly" && "active"}
        onClick={() => setDateWiseFilterOption("monthly")}
      >
        This Month
      </Button>
      <Button
        className={dateWiseFilterOption === "custom" && "active"}
        onClick={() => {
          setDateWiseFilterOption("custom");
        }}
      >
        Custom Date
      </Button>

      <div className="AccountDashboard accounting_modules_custom_date_range">
        {dateWiseFilterOption === "custom" ? (
          <div className="FilterItem CustomDate dateRangePicker">
            <DateRangePicker
              startDate={filterStartDate}
              endDate={filterEndDate}
              focus={focus}
              onStartDateChange={(selectedDate) => {
                setFilterStartDate(selectedDate)
              }}
              onEndDateChange={(selectedDate) => {
                setFilterEndDate(selectedDate)
              }}
              locale={enGB}
              modifiersClassNames={{ open: "-open" }}
            >
              {({ startDateInputProps, endDateInputProps }) => (
                <div className="date-range" style={{ left: "495px" }}>
                  <span className="date-range_arrow" />
                  <input
                    className={"input"}
                    {...endDateInputProps}
                    {...startDateInputProps}
                    value={getFormattedDateRange()}
                    placeholder="Custom Date Range"
                  />
                </div>
              )}
            </DateRangePicker>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default DateWiseFilter;