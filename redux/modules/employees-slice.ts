import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const employeesSlice = createSlice({
    name: "employees",
    initialState: [],
    reducers: {
        GETALL: (state, action) => {
            return action.payload.employees;
        },

    }

})

export const { GETALL } = employeesSlice.actions;
export default employeesSlice.reducer;