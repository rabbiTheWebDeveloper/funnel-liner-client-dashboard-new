import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const FilterCategoryItem = ({ selectCatgory ,setSelectedItem , selectedItem}) => {
    const [filterData, setFilterData] = useState([])
    const handleItemSelected = (event, value) => {
        const selectedIds = value.map((option) => option.value);
        setSelectedItem(selectedIds);
    };

    useEffect(() => {
        const filterArr = selectCatgory?.filter(item => item?.value !== 'add')
        setFilterData(filterArr)
    }, [selectCatgory])
 
    return (
        <Autocomplete
            multiple
            options={filterData }
            disableCloseOnSelect
            getOptionLabel={(option) => option?.label}
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
                <TextField {...params} placeholder="Category/Ledger" />
            )}
            onInputChange={(event, value) => {
                // Perform your data filtering based on the input value
            }}
            onChange={handleItemSelected}
            value={selectedItem?.name}
        />
    );
};

export default FilterCategoryItem;