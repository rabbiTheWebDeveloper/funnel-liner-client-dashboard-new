import * as React from "react";
import { enGB } from "date-fns/locale";
import { DateRangePickerCalendar, START_DATE } from "react-nice-dates";
import { Slot } from "@radix-ui/react-slot";
import { cls } from "../../../lib/utils";
import styles from "./date-range-picker.module.css";
import "react-nice-dates/build/style.css";
import { Popover } from "../popover/popover";

const DateRangePickerContext = React.createContext({});

const DateRangePicker = React.forwardRef(
  (
    {
      startDate,
      endDate,
      onStartDateChange,
      onEndDateChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [internalStartDate, setInternalStartDate] = React.useState(startDate);
    const [internalEndDate, setInternalEndDate] = React.useState(endDate);
    const [focus, setFocus] = React.useState(START_DATE);

    const isControlled = startDate !== undefined && endDate !== undefined;

    const handleStartDateChange = date => {
      if (isControlled) {
        onStartDateChange?.(date);
      } else {
        setInternalStartDate(date);
      }
    };

    const handleEndDateChange = date => {
      if (isControlled) {
        onEndDateChange?.(date);
      } else {
        setInternalEndDate(date);
      }
    };

    const handleFocusChange = newFocus => {
      setFocus(newFocus || START_DATE);
    };

    const contextValue = {
      startDate: isControlled ? startDate : internalStartDate,
      endDate: isControlled ? endDate : internalEndDate,
      focus,
      onStartDateChange: handleStartDateChange,
      onEndDateChange: handleEndDateChange,
      onFocusChange: handleFocusChange,
      setAnchorEl,
      anchorEl,
    };

    return (
      <DateRangePickerContext.Provider value={contextValue}>
        <div ref={ref} className={cls(styles.wrapper, className)} {...props}>
          {children}
        </div>
      </DateRangePickerContext.Provider>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

const DateRangePickerTrigger = React.forwardRef(
  ({ children, className, asChild = false, ...props }, ref) => {
    const { setAnchorEl } = React.useContext(DateRangePickerContext);
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cls(styles.trigger, className)}
        onClick={e => setAnchorEl(e.currentTarget)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
DateRangePickerTrigger.displayName = "DateRangePickerTrigger";

const DateRangePickerContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    const {
      startDate,
      endDate,
      focus,
      onStartDateChange,
      onEndDateChange,
      onFocusChange,
      setAnchorEl,
      anchorEl,
    } = React.useContext(DateRangePickerContext);

    const [isLargeScreen, setIsLargeScreen] = React.useState(false);

    React.useEffect(() => {
      const checkScreenSize = () => {
        setIsLargeScreen(window.innerWidth >= 768);
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);

      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const open = Boolean(anchorEl);

    return (
      <>
        <style jsx global>{`
          /* Calendar container */
          .nice-dates {
            --color-accent: var(--primary);
            --color-text: var(--foreground);
            --color-text-light: var(--foreground-muted);
            width: 100%;
            font-family: inherit;
            background-color: var(--background);
          }

          /* Navigation header */
          .nice-dates-navigation {
            padding: 0 0.5rem;
            color: var(--foreground);
          }

          .nice-dates-navigation_current {
            font-weight: 600;
            font-size: 1rem;
          }
          .nice-dates-navigation_previous,
          .nice-dates-navigation_next,
          .nice-dates-navigation_arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 0.25rem;
            transition: all 0.2s;
            padding: 0 !important;
            border-radius: 9999px;
            border: 1px solid hsl(var(--border));
          }
          .nice-dates-navigation_previous:before,
          .nice-dates-navigation_next:before {
            width: 8px;
            height: 8px;
            position: static;
            margin: 0;
          }
          .nice-dates-navigation_previous:before {
            margin-right: -5px;
          }
          .nice-dates-navigation_next:before {
            margin-left: -5px;
          }
          .nice-dates-navigation_next:hover,
          .nice-dates-navigation_arrow:hover {
            background-color: var(--accent);
          }

          .nice-dates-navigation,
          .nice-dates-day {
            color: hsl(var(--foreground)) !important;
          }

          /* Calendar grid */
          .nice-dates-grid {
            width: 100% !important;
          }
          .nice-dates-grid_container {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
          }

          /* Day cells */
          .nice-dates-day {
            height: 3rem !important;
            width: 100% !important;
            font-size: 0.875rem;
            color: hsl(var(--foreground));
            border-radius: var(--radius);
            transition: all 0.2s;
          }
          .nice-dates-day:before,
          .nice-dates-day:after {
            border-radius: 0;
          }
          .nice-dates-day.-selected:hover:after {
            background-color: hsl(var(--primary) / 0.005);
          }

          .nice-dates-day:hover {
            background-color: hsl(var(--accent));
          }

          .nice-dates-day:before {
            border-radius: 0.25rem;
          }

          .nice-dates-day.-selected,
          .nice-dates-day.-selected:hover {
            background-color: var(--primary);
            color: hsl(var(--primary-foreground)) !important;
          }

          .nice-dates-day.-start,
          .nice-dates-day.-end {
            background-color: hsl(var(--primary));
            color: white;
          }

          .nice-dates-day.-in-range {
            background-color: hsl(var(--primary) / 0.5);
          }

          .nice-dates-day.-disabled {
            color: hsl(var(--muted-foreground));
          }
          .nice-dates-day_month {
            color: hsl(var(--primary));
            margin-bottom: 2px;
            position: static;
            font-weight: 600;
          }
          .nice-dates-day.-selected .nice-dates-day_month {
            color: hsl(var(--primary-foreground));
            font-weight: 400;
          }

          /* Week headers */
          .nice-dates-week-header {
            color: hsl(var(--muted-foreground));
            font-size: 0.75rem;
            height: 1rem;
            margin-bottom: 1rem;
          }
          .nice-dates-week-header .nice-dates-week-header_day {
            color: hsl(var(--muted-foreground));
          }

          /* Popover overrides */
          .nice-dates-popover {
            width: 100% !important;
            max-width: none !important;
            border: none;
            box-shadow: none;
            background: none;
            margin: 0;
          }
        `}</style>
        <Popover
          ref={ref}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          className={cls(styles.popover, className)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          {...props}
        >
          <div className={styles.calendarWrapper}>
            <DateRangePickerCalendar
              startDate={startDate}
              endDate={endDate}
              focus={focus}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              onFocusChange={onFocusChange}
              locale={enGB}
              numberOfMonths={isLargeScreen ? 2 : 1}
            />
          </div>
        </Popover>
      </>
    );
  }
);
DateRangePickerContent.displayName = "DateRangePickerContent";

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
