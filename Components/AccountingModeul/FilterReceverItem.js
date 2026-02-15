import React, {useState, useEffect} from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';

const FilterReceverItem = ({ selectReciver, setSelectedItem ,selectedItem}) => {
    const [filterData, setFilterData] = useState([])

    const handleItemSelected = (event, value) => {
        const selectedIds = value.map((option) => option?.value);
        setSelectedItem(selectedIds);
    };

    useEffect(() => {
        const filterArr = selectReciver?.filter(item => item?.value !== 'addPayable')
        setFilterData(filterArr)
    }, [selectReciver])
    
    return (
        <Autocomplete
            multiple
            options={filterData}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.label}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option?.label}
                </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} placeholder="Payable/Receivable" />
            )}
            onInputChange={(event, value) => {
        
            }}
            onChange={handleItemSelected}
            value={selectedItem?.value}
        />
    );
};

export default FilterReceverItem;