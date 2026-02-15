import { createSlice } from '@reduxjs/toolkit';
const dropdownSlice = createSlice({
    name: 'dropdown',
    initialState: {
        activeTab: '1'
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});
export const { setActiveTab } = dropdownSlice.actions;
export default dropdownSlice.reducer;