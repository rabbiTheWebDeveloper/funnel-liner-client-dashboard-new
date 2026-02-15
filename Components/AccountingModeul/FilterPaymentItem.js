import { Autocomplete, Checkbox, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const FilterPaymentItem = ({ selectPayment, setSelectedItem , selectedItem}) => {
    const [filterData, setFilterData] = useState([])

    const handleItemSelected = (event, selectedItem) => {
        setSelectedItem(selectedItem);
    };

    useEffect(() => {
        const filterArr = selectPayment?.filter(item => item?.value !== 'add')
        setFilterData(filterArr)
    }, [selectPayment])
    
    return (
        <Autocomplete
            multiple
            options={filterData}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
                <li {...props} key={option?.value}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option?.label}
                </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} placeholder="Payment List " />
            )}
            onInputChange={(event, value) => {
                // Perform your data filtering based on the input value
            }}
            onChange={handleItemSelected}
            value={selectedItem}
        />
    );
};

export default FilterPaymentItem;