
import { useState } from 'react';
import { DateRange } from 'react-date-range';

// react-date-range
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


const DatePickerOrder = () => {

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);


    return (

        <>

            {/* <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelect}
            /> */}


            <DateRange
                editableDateInputs={true}
                onChange={item => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
            />

        </>

    )
}

export default DatePickerOrder
