import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { enGB } from 'date-fns/locale';
import React from 'react';
import { DateRangePicker } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';

const CustomDate = ({ startDate, setStartDate, endDate, setEndDate }) => {


  const FilterDateInput = styled(TextField)({
    '& .MuiInputBase-root': {
      height: '22px',
      marginRight: '10px',
      width: '150px',
    },
  });

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const dateValue = startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : '';

  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      focus={focus}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      locale={enGB}
      modifiersClassNames={{ open: '-open' }}
    >
      {({ startDateInputProps, endDateInputProps }) => (
        <div className="date-range">
          <FilterDateInput
            className="input"
            {...endDateInputProps}
            {...startDateInputProps}
            value={dateValue}
            placeholder="Select date range"
          />
        </div>
      )}
    </DateRangePicker >
  );
};

export default CustomDate;
